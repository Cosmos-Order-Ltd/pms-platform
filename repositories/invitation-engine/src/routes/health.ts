/**
 * Cyprus Access Control (CAC) - Health Check Routes
 * Comprehensive health monitoring for Container #31
 */

import { Router, Request, Response } from 'express';
import databaseManager from '../database/connection';
import { version } from '../../package.json';

const router = Router();

interface HealthStatus {
  status: 'OK' | 'WARNING' | 'ERROR';
  timestamp: string;
  version: string;
  container: string;
  service: string;
  uptime: number;
  requestId: string;
  components: {
    database: ComponentHealth;
    redis: ComponentHealth;
    fileSystem: ComponentHealth;
    memory: ComponentHealth;
    apis: ComponentHealth;
  };
  metrics: {
    poolStats: any;
    memoryUsage: NodeJS.MemoryUsage;
    cpuUsage: NodeJS.CpuUsage;
  };
}

interface ComponentHealth {
  status: 'OK' | 'WARNING' | 'ERROR';
  message: string;
  details?: any;
  lastChecked: string;
  responseTime?: number;
}

/**
 * Basic health check endpoint
 * GET /health
 */
router.get('/', async (req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    // Quick database check
    const dbHealth = await databaseManager.healthCheck();
    const responseTime = Date.now() - startTime;

    const healthStatus = {
      status: (dbHealth.postgres && dbHealth.redis) ? 'OK' : 'ERROR',
      timestamp: new Date().toISOString(),
      version,
      container: '#31',
      service: 'Cyprus Access Control (CAC)',
      uptime: process.uptime(),
      requestId: req.requestId || 'unknown',
      responseTime,
      database: dbHealth.postgres,
      redis: dbHealth.redis,
      message: 'Geofenced Invitation Orchestration Service operational'
    };

    const statusCode = healthStatus.status === 'OK' ? 200 : 503;
    res.status(statusCode).json(healthStatus);

  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      version,
      container: '#31',
      service: 'Cyprus Access Control (CAC)',
      requestId: req.requestId || 'unknown',
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Health check failed'
    });
  }
});

/**
 * Detailed health check with full diagnostics
 * GET /health/detailed
 */
router.get('/detailed', async (req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    // Database health check
    const dbStartTime = Date.now();
    const dbHealth = await databaseManager.healthCheck();
    const dbResponseTime = Date.now() - dbStartTime;

    // File system check
    const fsStartTime = Date.now();
    const fsHealth = await checkFileSystem();
    const fsResponseTime = Date.now() - fsStartTime;

    // Memory check
    const memoryHealth = checkMemoryUsage();

    // API endpoints check
    const apiStartTime = Date.now();
    const apiHealth = await checkAPIEndpoints();
    const apiResponseTime = Date.now() - apiStartTime;

    // Determine overall status
    const componentStatuses = [
      dbHealth.postgres && dbHealth.redis,
      fsHealth.status === 'OK',
      memoryHealth.status === 'OK',
      apiHealth.status === 'OK'
    ];

    let overallStatus: 'OK' | 'WARNING' | 'ERROR' = 'OK';
    if (componentStatuses.some(status => !status)) {
      overallStatus = 'ERROR';
    } else if (memoryHealth.status === 'WARNING') {
      overallStatus = 'WARNING';
    }

    const healthStatus: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version,
      container: '#31',
      service: 'Cyprus Access Control (CAC)',
      uptime: process.uptime(),
      requestId: req.requestId || 'unknown',
      components: {
        database: {
          status: dbHealth.postgres ? 'OK' : 'ERROR',
          message: dbHealth.details.postgres || 'Unknown',
          responseTime: dbResponseTime,
          lastChecked: new Date().toISOString()
        },
        redis: {
          status: dbHealth.redis ? 'OK' : 'ERROR',
          message: dbHealth.details.redis || 'Unknown',
          responseTime: dbResponseTime,
          lastChecked: new Date().toISOString()
        },
        fileSystem: {
          status: fsHealth.status,
          message: fsHealth.message,
          details: fsHealth.details,
          responseTime: fsResponseTime,
          lastChecked: new Date().toISOString()
        },
        memory: {
          status: memoryHealth.status,
          message: memoryHealth.message,
          details: memoryHealth.details,
          lastChecked: new Date().toISOString()
        },
        apis: {
          status: apiHealth.status,
          message: apiHealth.message,
          details: apiHealth.details,
          responseTime: apiResponseTime,
          lastChecked: new Date().toISOString()
        }
      },
      metrics: {
        poolStats: databaseManager.getPoolStats(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      }
    };

    const statusCode = overallStatus === 'OK' ? 200 : overallStatus === 'WARNING' ? 206 : 503;
    res.status(statusCode).json(healthStatus);

  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      version,
      container: '#31',
      service: 'Cyprus Access Control (CAC)',
      requestId: req.requestId || 'unknown',
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Detailed health check failed'
    });
  }
});

/**
 * Readiness probe for Kubernetes
 * GET /health/ready
 */
router.get('/ready', async (req: Request, res: Response) => {
  try {
    // Check if service is ready to handle requests
    const dbHealth = await databaseManager.healthCheck();

    if (dbHealth.postgres && dbHealth.redis) {
      res.status(200).json({
        status: 'READY',
        timestamp: new Date().toISOString(),
        message: 'Service is ready to handle requests'
      });
    } else {
      res.status(503).json({
        status: 'NOT_READY',
        timestamp: new Date().toISOString(),
        message: 'Service is not ready - database connections failed'
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'NOT_READY',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Liveness probe for Kubernetes
 * GET /health/live
 */
router.get('/live', (req: Request, res: Response) => {
  // Simple liveness check - if this endpoint responds, the process is alive
  res.status(200).json({
    status: 'ALIVE',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    pid: process.pid,
    message: 'Service process is alive'
  });
});

/**
 * Performance metrics endpoint
 * GET /health/metrics
 */
router.get('/metrics', async (req: Request, res: Response) => {
  try {
    const metrics = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      database: {
        poolStats: databaseManager.getPoolStats(),
        connected: databaseManager.connected
      },
      process: {
        pid: process.pid,
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        container: '#31',
        service: 'Cyprus Access Control (CAC)'
      }
    };

    res.json(metrics);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to collect metrics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Service information endpoint
 * GET /health/info
 */
router.get('/info', (req: Request, res: Response) => {
  res.json({
    service: 'Cyprus Access Control (CAC)',
    description: 'Geofenced Invitation Orchestration Service',
    purpose: 'Universal Access Control for Cyprus Business Empire',
    version,
    container: '#31',
    capabilities: [
      'Geofenced invitation generation and tracking',
      'Multi-vector location verification',
      'Courier integration (DHL, UPS, FedEx)',
      'QR code intelligence with anti-spoofing',
      'Trial countdown management',
      'Cyprus business registry integration',
      'Real-time analytics and conversion tracking',
      'Cross-platform access control (CYH, CYR, CYC series)'
    ],
    businessTypes: {
      hotels: {
        prefix: 'CYH',
        description: 'Cyprus Hotels - PMS platform access',
        compliance: 'Police registration, VAT automation'
      },
      realEstate: {
        prefix: 'CYR',
        description: 'Cyprus Real Estate - Property management',
        compliance: 'Property listing automation'
      },
      companies: {
        prefix: 'CYC',
        description: 'Cyprus Companies - Business tools',
        compliance: 'VAT automation, business registry integration'
      }
    },
    infrastructure: {
      database: 'PostgreSQL with Redis caching',
      messaging: 'WebSocket real-time updates',
      security: 'JWT authentication, device fingerprinting',
      monitoring: 'Comprehensive health checks and analytics'
    },
    contact: {
      support: 'invitations@cypruspms.com',
      documentation: 'https://github.com/cosmos-order-ltd/invitation-engine'
    }
  });
});

// Helper functions

/**
 * Check file system health
 */
async function checkFileSystem(): Promise<{ status: 'OK' | 'ERROR'; message: string; details?: any }> {
  const fs = require('fs').promises;
  const path = require('path');

  try {
    // Check if required directories exist and are writable
    const directories = ['./logs', './uploads'];
    const checks = [];

    for (const dir of directories) {
      try {
        await fs.access(dir, fs.constants.F_OK | fs.constants.W_OK);
        checks.push({ directory: dir, status: 'OK' });
      } catch (error) {
        // Try to create directory if it doesn't exist
        try {
          await fs.mkdir(dir, { recursive: true });
          checks.push({ directory: dir, status: 'CREATED' });
        } catch (createError) {
          checks.push({ directory: dir, status: 'ERROR', error: createError.message });
        }
      }
    }

    const hasErrors = checks.some(check => check.status === 'ERROR');

    return {
      status: hasErrors ? 'ERROR' : 'OK',
      message: hasErrors ? 'File system check failed' : 'File system accessible',
      details: checks
    };
  } catch (error) {
    return {
      status: 'ERROR',
      message: error instanceof Error ? error.message : 'File system check failed'
    };
  }
}

/**
 * Check memory usage
 */
function checkMemoryUsage(): { status: 'OK' | 'WARNING' | 'ERROR'; message: string; details: any } {
  const memUsage = process.memoryUsage();
  const totalMemoryMB = memUsage.heapTotal / 1024 / 1024;
  const usedMemoryMB = memUsage.heapUsed / 1024 / 1024;
  const memoryUsagePercent = (usedMemoryMB / totalMemoryMB) * 100;

  let status: 'OK' | 'WARNING' | 'ERROR' = 'OK';
  let message = 'Memory usage normal';

  if (memoryUsagePercent > 90) {
    status = 'ERROR';
    message = 'High memory usage detected';
  } else if (memoryUsagePercent > 75) {
    status = 'WARNING';
    message = 'Elevated memory usage';
  }

  return {
    status,
    message,
    details: {
      heapUsed: `${Math.round(usedMemoryMB)}MB`,
      heapTotal: `${Math.round(totalMemoryMB)}MB`,
      usagePercent: `${Math.round(memoryUsagePercent)}%`,
      external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`
    }
  };
}

/**
 * Check API endpoints health
 */
async function checkAPIEndpoints(): Promise<{ status: 'OK' | 'ERROR'; message: string; details?: any }> {
  try {
    // Test basic database query to ensure API can function
    await databaseManager.query('SELECT 1 as test');

    return {
      status: 'OK',
      message: 'API endpoints functional',
      details: {
        database: 'Connected',
        endpoints: 'Accessible'
      }
    };
  } catch (error) {
    return {
      status: 'ERROR',
      message: 'API endpoints check failed',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}

export default router;