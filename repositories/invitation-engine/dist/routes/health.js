"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const connection_1 = __importDefault(require("../database/connection"));
const package_json_1 = require("../../package.json");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    const startTime = Date.now();
    try {
        const dbHealth = await connection_1.default.healthCheck();
        const responseTime = Date.now() - startTime;
        const healthStatus = {
            status: (dbHealth.postgres && dbHealth.redis) ? 'OK' : 'ERROR',
            timestamp: new Date().toISOString(),
            version: package_json_1.version,
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
    }
    catch (error) {
        res.status(503).json({
            status: 'ERROR',
            timestamp: new Date().toISOString(),
            version: package_json_1.version,
            container: '#31',
            service: 'Cyprus Access Control (CAC)',
            requestId: req.requestId || 'unknown',
            error: error instanceof Error ? error.message : 'Unknown error',
            message: 'Health check failed'
        });
    }
});
router.get('/detailed', async (req, res) => {
    const startTime = Date.now();
    try {
        const dbStartTime = Date.now();
        const dbHealth = await connection_1.default.healthCheck();
        const dbResponseTime = Date.now() - dbStartTime;
        const fsStartTime = Date.now();
        const fsHealth = await checkFileSystem();
        const fsResponseTime = Date.now() - fsStartTime;
        const memoryHealth = checkMemoryUsage();
        const apiStartTime = Date.now();
        const apiHealth = await checkAPIEndpoints();
        const apiResponseTime = Date.now() - apiStartTime;
        const componentStatuses = [
            dbHealth.postgres && dbHealth.redis,
            fsHealth.status === 'OK',
            memoryHealth.status === 'OK',
            apiHealth.status === 'OK'
        ];
        let overallStatus = 'OK';
        if (componentStatuses.some(status => !status)) {
            overallStatus = 'ERROR';
        }
        else if (memoryHealth.status === 'WARNING') {
            overallStatus = 'WARNING';
        }
        const healthStatus = {
            status: overallStatus,
            timestamp: new Date().toISOString(),
            version: package_json_1.version,
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
                poolStats: connection_1.default.getPoolStats(),
                memoryUsage: process.memoryUsage(),
                cpuUsage: process.cpuUsage()
            }
        };
        const statusCode = overallStatus === 'OK' ? 200 : overallStatus === 'WARNING' ? 206 : 503;
        res.status(statusCode).json(healthStatus);
    }
    catch (error) {
        res.status(503).json({
            status: 'ERROR',
            timestamp: new Date().toISOString(),
            version: package_json_1.version,
            container: '#31',
            service: 'Cyprus Access Control (CAC)',
            requestId: req.requestId || 'unknown',
            error: error instanceof Error ? error.message : 'Unknown error',
            message: 'Detailed health check failed'
        });
    }
});
router.get('/ready', async (req, res) => {
    try {
        const dbHealth = await connection_1.default.healthCheck();
        if (dbHealth.postgres && dbHealth.redis) {
            res.status(200).json({
                status: 'READY',
                timestamp: new Date().toISOString(),
                message: 'Service is ready to handle requests'
            });
        }
        else {
            res.status(503).json({
                status: 'NOT_READY',
                timestamp: new Date().toISOString(),
                message: 'Service is not ready - database connections failed'
            });
        }
    }
    catch (error) {
        res.status(503).json({
            status: 'NOT_READY',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.get('/live', (req, res) => {
    res.status(200).json({
        status: 'ALIVE',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        pid: process.pid,
        message: 'Service process is alive'
    });
});
router.get('/metrics', async (req, res) => {
    try {
        const metrics = {
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            cpu: process.cpuUsage(),
            database: {
                poolStats: connection_1.default.getPoolStats(),
                connected: connection_1.default.connected
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
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to collect metrics',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.get('/info', (req, res) => {
    res.json({
        service: 'Cyprus Access Control (CAC)',
        description: 'Geofenced Invitation Orchestration Service',
        purpose: 'Universal Access Control for Cyprus Business Empire',
        version: package_json_1.version,
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
async function checkFileSystem() {
    const fs = require('fs').promises;
    const path = require('path');
    try {
        const directories = ['./logs', './uploads'];
        const checks = [];
        for (const dir of directories) {
            try {
                await fs.access(dir, fs.constants.F_OK | fs.constants.W_OK);
                checks.push({ directory: dir, status: 'OK' });
            }
            catch (error) {
                try {
                    await fs.mkdir(dir, { recursive: true });
                    checks.push({ directory: dir, status: 'CREATED' });
                }
                catch (createError) {
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
    }
    catch (error) {
        return {
            status: 'ERROR',
            message: error instanceof Error ? error.message : 'File system check failed'
        };
    }
}
function checkMemoryUsage() {
    const memUsage = process.memoryUsage();
    const totalMemoryMB = memUsage.heapTotal / 1024 / 1024;
    const usedMemoryMB = memUsage.heapUsed / 1024 / 1024;
    const memoryUsagePercent = (usedMemoryMB / totalMemoryMB) * 100;
    let status = 'OK';
    let message = 'Memory usage normal';
    if (memoryUsagePercent > 90) {
        status = 'ERROR';
        message = 'High memory usage detected';
    }
    else if (memoryUsagePercent > 75) {
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
async function checkAPIEndpoints() {
    try {
        await connection_1.default.query('SELECT 1 as test');
        return {
            status: 'OK',
            message: 'API endpoints functional',
            details: {
                database: 'Connected',
                endpoints: 'Accessible'
            }
        };
    }
    catch (error) {
        return {
            status: 'ERROR',
            message: 'API endpoints check failed',
            details: {
                error: error instanceof Error ? error.message : 'Unknown error'
            }
        };
    }
}
exports.default = router;
//# sourceMappingURL=health.js.map