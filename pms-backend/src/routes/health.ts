import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const router = Router();
const prisma = new PrismaClient();

// Redis client with error handling
let redis: Redis | null = null;
try {
  redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
} catch (error) {
  console.warn('Redis connection failed, health check will report as disconnected');
}

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  service: string;
  version: string;
  uptime: number;
  database: 'connected' | 'disconnected' | 'error';
  redis: 'connected' | 'disconnected' | 'error';
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  environment: string;
}

// Health check endpoint
router.get('/health', async (req: Request, res: Response) => {
  const startTime = Date.now();
  let overallStatus: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';

  // Check database connectivity
  let databaseStatus: 'connected' | 'disconnected' | 'error' = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    databaseStatus = 'connected';
  } catch (error) {
    databaseStatus = 'error';
    overallStatus = 'unhealthy';
    console.error('Database health check failed:', error);
  }

  // Check Redis connectivity
  let redisStatus: 'connected' | 'disconnected' | 'error' = 'disconnected';
  if (redis) {
    try {
      await redis.ping();
      redisStatus = 'connected';
    } catch (error) {
      redisStatus = 'error';
      overallStatus = overallStatus === 'healthy' ? 'degraded' : 'unhealthy';
      console.error('Redis health check failed:', error);
    }
  } else {
    redisStatus = 'disconnected';
    overallStatus = overallStatus === 'healthy' ? 'degraded' : 'unhealthy';
  }

  // Get memory usage
  const memoryUsage = process.memoryUsage();
  const totalMemory = memoryUsage.heapTotal;
  const usedMemory = memoryUsage.heapUsed;
  const memoryPercentage = Math.round((usedMemory / totalMemory) * 100);

  // Get uptime in seconds
  const uptime = Math.floor(process.uptime());

  const healthStatus: HealthStatus = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    service: 'pms-backend',
    version: process.env.npm_package_version || '1.0.0',
    uptime,
    database: databaseStatus,
    redis: redisStatus,
    memory: {
      used: Math.round(usedMemory / 1024 / 1024), // MB
      total: Math.round(totalMemory / 1024 / 1024), // MB
      percentage: memoryPercentage,
    },
    environment: process.env.NODE_ENV || 'development',
  };

  const responseTime = Date.now() - startTime;

  // Set appropriate HTTP status code
  const statusCode = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;

  res.status(statusCode).json({
    ...healthStatus,
    responseTime: `${responseTime}ms`,
  });
});

// Readiness check endpoint (for Kubernetes)
router.get('/ready', async (req: Request, res: Response) => {
  try {
    // Check if service is ready to accept traffic
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      service: 'pms-backend',
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      service: 'pms-backend',
      error: 'Database not accessible',
    });
  }
});

// Liveness check endpoint (for Kubernetes)
router.get('/live', (req: Request, res: Response) => {
  // Simple liveness check - if we can respond, we're alive
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    service: 'pms-backend',
    uptime: Math.floor(process.uptime()),
  });
});

export default router;