/**
 * COSMOS ORDER REAL ESTATE PLATFORM - MAIN SERVER
 * Container #43 - Real Estate Development Platform
 * "From land acquisition to buyer handover - fully automated"
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import winston from 'winston';

// Import routes
import { authRoutes } from './routes/auth';
import { projectRoutes } from './routes/projects';
import { propertyRoutes } from './routes/properties';
import { investorRoutes } from './routes/investors';
import { buyerRoutes } from './routes/buyers';
import { complianceRoutes } from './routes/compliance';
import { analyticsRoutes } from './routes/analytics';
import { dashboardRoutes } from './routes/dashboard';

// Import middleware
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

// Import services
import { DatabaseService } from './services/DatabaseService';
import { CacheService } from './services/CacheService';
import { NotificationService } from './services/NotificationService';
import { WebSocketService } from './services/WebSocketService';

// Configuration
const PORT = process.env.PORT || 3030;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        ...(NODE_ENV === 'development' ? [new winston.transports.Console({
            format: winston.format.simple()
        })] : [])
    ]
});

// Initialize Express app
const app = express();
const server = createServer(app);

// Initialize WebSocket
const wss = new WebSocketServer({ server });
const wsService = new WebSocketService(wss);

// Initialize services
const dbService = new DatabaseService();
const cacheService = new CacheService();
const notificationService = new NotificationService();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "wss:", "ws:"]
        }
    }
}));

// CORS configuration
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'https://cosmosorder.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Basic middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);

// Apply rate limiting
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'operational',
        service: 'cosmos-real-estate-platform',
        container: 'container-43',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: NODE_ENV,
        features: {
            landAcquisition: 'enabled',
            projectManagement: 'enabled',
            salesAutomation: 'enabled',
            cyprusCompliance: 'enabled',
            investorRelations: 'enabled',
            constructionTracking: 'enabled',
            aiAnalytics: 'enabled'
        },
        integrations: {
            database: 'postgresql',
            cache: 'redis',
            websocket: 'active',
            notifications: 'enabled'
        }
    });
});

// Service info endpoint
app.get('/', (req, res) => {
    res.json({
        platform: 'Cosmos Order Real Estate Development Platform',
        container: 'Container #43',
        description: 'Complete real estate development lifecycle management',
        invitation: {
            series: 'CYR',
            issued: 2,
            active: 2,
            access: 'invitation-only'
        },
        capabilities: [
            'Land Acquisition Analysis',
            'Project Development Management',
            'Construction Progress Tracking',
            'Sales & Marketing Automation',
            'Investor Relations Management',
            'Cyprus Compliance Engine',
            'Financial Analytics & Reporting',
            'Market Analysis & Forecasting'
        ],
        endpoints: {
            auth: '/api/auth',
            projects: '/api/projects',
            properties: '/api/properties',
            investors: '/api/investors',
            buyers: '/api/buyers',
            compliance: '/api/compliance',
            analytics: '/api/analytics',
            dashboard: '/api/dashboard'
        },
        realTimeFeatures: {
            projectUpdates: 'WebSocket enabled',
            constructionProgress: 'Live tracking',
            salesMetrics: 'Real-time',
            complianceAlerts: 'Instant notifications'
        },
        documentation: 'https://docs.cosmosorder.com/real-estate',
        support: 'support@cosmosorder.com'
    });
});

// API Routes
app.use('/api/auth', authRoutes);

// Protected routes (require authentication)
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/properties', authMiddleware, propertyRoutes);
app.use('/api/investors', authMiddleware, investorRoutes);
app.use('/api/buyers', authMiddleware, buyerRoutes);
app.use('/api/compliance', authMiddleware, complianceRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

// WebSocket connection handling
wss.on('connection', (ws, req) => {
    logger.info('New WebSocket connection established');

    // Send welcome message
    ws.send(JSON.stringify({
        type: 'welcome',
        message: 'Connected to Cosmos Order Real Estate Platform',
        timestamp: new Date().toISOString(),
        features: ['real-time-updates', 'live-notifications', 'progress-tracking']
    }));

    // Handle WebSocket messages
    ws.on('message', async (data) => {
        try {
            const message = JSON.parse(data.toString());
            await wsService.handleMessage(ws, message);
        } catch (error) {
            logger.error('WebSocket message error:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Invalid message format'
            }));
        }
    });

    ws.on('close', () => {
        logger.info('WebSocket connection closed');
    });

    ws.on('error', (error) => {
        logger.error('WebSocket error:', error);
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: 'The requested endpoint does not exist',
        availableEndpoints: [
            'GET /',
            'GET /health',
            'POST /api/auth/login',
            'GET /api/projects',
            'GET /api/dashboard/metrics'
        ]
    });
});

// Initialize database and start server
async function startServer() {
    try {
        // Initialize database
        logger.info('Initializing database connection...');
        await dbService.connect();
        logger.info('Database connected successfully');

        // Initialize cache
        logger.info('Initializing cache service...');
        await cacheService.connect();
        logger.info('Cache service connected successfully');

        // Initialize notification service
        logger.info('Initializing notification service...');
        await notificationService.initialize();
        logger.info('Notification service initialized successfully');

        // Start server
        server.listen(PORT, () => {
            logger.info('🏗️ Cosmos Order Real Estate Platform Started');
            logger.info('================================================');
            logger.info(`🌐 Server running on port ${PORT}`);
            logger.info(`📊 Environment: ${NODE_ENV}`);
            logger.info(`🎯 Container: #43`);
            logger.info(`🔗 Health Check: http://localhost:${PORT}/health`);
            logger.info(`📡 WebSocket: ws://localhost:${PORT}`);
            logger.info('================================================');
            logger.info('🏨 Features Enabled:');
            logger.info('   ✅ Land Acquisition Analysis');
            logger.info('   ✅ Project Development Management');
            logger.info('   ✅ Construction Progress Tracking');
            logger.info('   ✅ Sales & Marketing Automation');
            logger.info('   ✅ Investor Relations Management');
            logger.info('   ✅ Cyprus Compliance Engine');
            logger.info('   ✅ Financial Analytics & Reporting');
            logger.info('   ✅ Real-time WebSocket Updates');
            logger.info('================================================');
            logger.info('🎫 Invitation Series: CYR (Cyprus Real Estate)');
            logger.info('   • CYR-001: Your Wife - Co-Founder Access');
            logger.info('   • CYR-002: Your Best Friend - Investor Access');
            logger.info('================================================');
            logger.info('🚀 Real Estate Platform Ready for Production');

            // Send startup notification
            notificationService.sendSystemNotification({
                type: 'system-startup',
                message: 'Real Estate Platform (Container #43) started successfully',
                timestamp: new Date().toISOString(),
                metadata: {
                    port: PORT,
                    environment: NODE_ENV,
                    features: 8,
                    invitationSeries: 'CYR'
                }
            });
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully...');

    // Close WebSocket connections
    wss.clients.forEach((client) => {
        client.close();
    });

    // Close database connections
    await dbService.disconnect();
    await cacheService.disconnect();

    // Close server
    server.close(() => {
        logger.info('Server closed successfully');
        process.exit(0);
    });
});

process.on('SIGINT', async () => {
    logger.info('SIGINT received, shutting down gracefully...');

    // Close WebSocket connections
    wss.clients.forEach((client) => {
        client.close();
    });

    // Close database connections
    await dbService.disconnect();
    await cacheService.disconnect();

    // Close server
    server.close(() => {
        logger.info('Server closed successfully');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Start the server
startServer();

export { app, server, wss };