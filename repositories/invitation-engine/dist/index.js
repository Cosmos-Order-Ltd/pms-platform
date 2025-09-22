"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const winston_1 = __importDefault(require("winston"));
const connection_1 = __importDefault(require("./database/connection"));
const health_1 = __importDefault(require("./routes/health"));
const invitations_1 = __importDefault(require("./routes/invitations"));
const location_1 = __importDefault(require("./routes/location"));
const qr_1 = __importDefault(require("./routes/qr"));
const courier_1 = __importDefault(require("./routes/courier"));
const admin_1 = __importDefault(require("./routes/admin"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const trials_1 = __importDefault(require("./routes/trials"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const rateLimiter_1 = __importDefault(require("./middleware/rateLimiter"));
const auth_1 = __importDefault(require("./middleware/auth"));
dotenv_1.default.config();
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
        }),
        new winston_1.default.transports.File({
            filename: process.env.LOG_FILE || './logs/invitation-engine.log'
        })
    ]
});
const config = {
    port: parseInt(process.env.PORT || '3019'),
    adminPort: parseInt(process.env.ADMIN_PORT || '3020'),
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3010', 'http://192.168.30.98:3010']
};
class InvitationServer {
    app;
    adminApp;
    server;
    adminServer;
    io;
    adminIo;
    constructor() {
        this.app = (0, express_1.default)();
        this.adminApp = (0, express_1.default)();
        this.setupMainApp();
        this.setupAdminApp();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }
    setupMainApp() {
        this.app.use((0, helmet_1.default)({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", "data:", "https:"],
                    connectSrc: ["'self'", "wss:"]
                }
            }
        }));
        this.app.use((0, cors_1.default)({
            origin: config.corsOrigins,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
        }));
        this.app.use((0, compression_1.default)());
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
        this.app.use((0, morgan_1.default)('combined', {
            stream: { write: (message) => logger.info(message.trim()) }
        }));
        this.app.use(rateLimiter_1.default);
    }
    setupAdminApp() {
        this.adminApp.use((0, helmet_1.default)());
        this.adminApp.use((0, cors_1.default)({
            origin: ['http://localhost:3020', 'http://192.168.30.98:3020'],
            credentials: true
        }));
        this.adminApp.use((0, compression_1.default)());
        this.adminApp.use(express_1.default.json());
        this.adminApp.use(express_1.default.urlencoded({ extended: true }));
        this.adminApp.use((0, morgan_1.default)('combined', {
            stream: { write: (message) => logger.info(`[ADMIN] ${message.trim()}`) }
        }));
        this.adminApp.use(express_1.default.static('src/admin/public'));
    }
    setupMiddleware() {
        this.app.use((req, res, next) => {
            req.requestId = Math.random().toString(36).substring(2, 15);
            res.setHeader('X-Request-ID', req.requestId);
            next();
        });
        this.adminApp.use((req, res, next) => {
            req.requestId = Math.random().toString(36).substring(2, 15);
            res.setHeader('X-Request-ID', req.requestId);
            next();
        });
        this.app.use((req, res, next) => {
            req.startTime = Date.now();
            next();
        });
        this.adminApp.use((req, res, next) => {
            req.startTime = Date.now();
            next();
        });
    }
    setupRoutes() {
        this.app.use('/health', health_1.default);
        this.app.use('/api/invitations', invitations_1.default);
        this.app.use('/api/location', location_1.default);
        this.app.use('/qr', qr_1.default);
        this.app.use('/api/qr', qr_1.default);
        this.app.use('/webhook/courier', courier_1.default);
        this.app.use('/api/courier', courier_1.default);
        this.app.use('/api/trials', trials_1.default);
        this.app.use('/api/analytics', analytics_1.default);
        this.app.get('/', (req, res) => {
            res.json({
                service: 'Cyprus Access Control (CAC)',
                description: 'Geofenced Invitation Orchestration Service',
                version: '1.0.0',
                container: '#31',
                purpose: 'Universal Access Control for Cyprus Business Empire',
                endpoints: {
                    health: '/health',
                    invitations: '/api/invitations',
                    location: '/api/location',
                    qr: '/qr',
                    courier: '/api/courier',
                    trials: '/api/trials',
                    webhooks: '/webhook/courier',
                    analytics: '/api/analytics'
                },
                documentation: 'https://github.com/cosmos-order-ltd/invitation-engine',
                support: 'invitations@cypruspms.com'
            });
        });
        this.adminApp.use('/api', auth_1.default.adminAuth, admin_1.default);
        this.adminApp.get('/', (req, res) => {
            res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Cyprus Access Control - Admin Dashboard</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #2c3e50; margin-bottom: 30px; }
            .status { padding: 15px; margin: 20px 0; border-radius: 5px; }
            .status.success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
            .status.info { background: #cce7ff; border: 1px solid #99d3ff; color: #004085; }
            .endpoints { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 30px; }
            .endpoint { padding: 15px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; }
            .endpoint h3 { margin: 0 0 10px 0; color: #495057; }
            .endpoint a { color: #007bff; text-decoration: none; }
            .endpoint a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🎯 Cyprus Access Control (CAC)</h1>
            <div class="status success">
              <strong>Container #31 Operational</strong><br>
              Geofenced Invitation Orchestration Service is running and ready to control access to your Cyprus business empire.
            </div>

            <div class="status info">
              <strong>Mission Status:</strong> Universal access control for hotels (CYH), real estate (CYR), and companies (CYC) in Cyprus.
            </div>

            <div class="endpoints">
              <div class="endpoint">
                <h3>📊 Live Dashboard</h3>
                <a href="/api/dashboard">Real-time Invitation Map</a>
              </div>

              <div class="endpoint">
                <h3>📈 Analytics</h3>
                <a href="/api/analytics/dashboard">Conversion Funnel</a>
              </div>

              <div class="endpoint">
                <h3>🎫 Create Invitation</h3>
                <a href="/api/invitations/create">Generate New Invitation</a>
              </div>

              <div class="endpoint">
                <h3>🗺️ Geofencing</h3>
                <a href="/api/geofencing">Location Management</a>
              </div>

              <div class="endpoint">
                <h3>📦 Courier Tracking</h3>
                <a href="/api/courier/tracking">Delivery Status</a>
              </div>

              <div class="endpoint">
                <h3>⏰ Trial Management</h3>
                <a href="/api/trials">Active Countdown Timers</a>
              </div>
            </div>

            <p style="margin-top: 40px; color: #6c757d; font-size: 14px;">
              <strong>Security Notice:</strong> This admin interface is protected and logs all access attempts.
              All invitation data is encrypted and audited for compliance.
            </p>
          </div>
        </body>
        </html>
      `);
        });
        this.app.use('*', (req, res) => {
            res.status(404).json({
                error: 'Endpoint not found',
                service: 'Cyprus Access Control (CAC)',
                suggestion: 'Check /health for service status or / for available endpoints'
            });
        });
        this.adminApp.use('*', (req, res) => {
            res.status(404).json({
                error: 'Admin endpoint not found',
                message: 'This admin interface requires proper authentication'
            });
        });
    }
    setupErrorHandling() {
        this.app.use(errorHandler_1.default);
        this.adminApp.use(errorHandler_1.default);
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error);
            process.exit(1);
        });
        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
        });
    }
    setupWebSockets() {
        this.io = new socket_io_1.Server(this.server, {
            cors: {
                origin: config.corsOrigins,
                methods: ['GET', 'POST']
            }
        });
        this.io.on('connection', (socket) => {
            logger.info(`Client connected: ${socket.id}`);
            socket.on('subscribe-invitation', (invitationNumber) => {
                socket.join(`invitation-${invitationNumber}`);
                logger.info(`Client ${socket.id} subscribed to invitation ${invitationNumber}`);
            });
            socket.on('disconnect', () => {
                logger.info(`Client disconnected: ${socket.id}`);
            });
        });
        this.adminIo = new socket_io_1.Server(this.adminServer, {
            cors: {
                origin: ['http://localhost:3020', 'http://192.168.30.98:3020'],
                methods: ['GET', 'POST']
            }
        });
        this.adminIo.on('connection', (socket) => {
            logger.info(`Admin client connected: ${socket.id}`);
            socket.on('subscribe-admin', () => {
                socket.join('admin-updates');
                logger.info(`Admin client ${socket.id} subscribed to updates`);
            });
            socket.on('disconnect', () => {
                logger.info(`Admin client disconnected: ${socket.id}`);
            });
        });
    }
    async start() {
        try {
            const healthCheck = await connection_1.default.healthCheck();
            if (!healthCheck.postgres || !healthCheck.redis) {
                logger.error('Database connectivity check failed:', healthCheck);
                throw new Error('Database connection failed');
            }
            this.server = (0, http_1.createServer)(this.app);
            this.adminServer = (0, http_1.createServer)(this.adminApp);
            this.setupWebSockets();
            this.server.listen(config.port, () => {
                logger.info(`🎯 Cyprus Access Control (CAC) API running on port ${config.port}`);
                logger.info(`📡 Main API: http://192.168.30.98:${config.port}`);
                logger.info(`🔑 Invitation QR Codes: http://192.168.30.98:${config.port}/qr`);
                logger.info(`🌍 Location Validation: http://192.168.30.98:${config.port}/api/location`);
            });
            this.adminServer.listen(config.adminPort, () => {
                logger.info(`👑 Cyprus Access Control Admin Dashboard running on port ${config.adminPort}`);
                logger.info(`📊 Admin Interface: http://192.168.30.98:${config.adminPort}`);
                logger.info(`🗺️ Live Invitation Map: http://192.168.30.98:${config.adminPort}/api/dashboard`);
            });
            logger.info('🚀 Container #31 is operational and ready to control Cyprus business access');
            logger.info('🎫 Ready to generate CYH, CYR, and CYC invitation series');
        }
        catch (error) {
            logger.error('Failed to start Cyprus Access Control servers:', error);
            process.exit(1);
        }
    }
    async shutdown() {
        logger.info('Shutting down Cyprus Access Control servers...');
        if (this.io) {
            this.io.close();
        }
        if (this.adminIo) {
            this.adminIo.close();
        }
        if (this.server) {
            this.server.close();
        }
        if (this.adminServer) {
            this.adminServer.close();
        }
        await connection_1.default.close();
        logger.info('Cyprus Access Control shutdown complete');
        process.exit(0);
    }
    get webSockets() {
        return {
            main: this.io,
            admin: this.adminIo
        };
    }
}
const invitationServer = new InvitationServer();
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    invitationServer.shutdown();
});
process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    invitationServer.shutdown();
});
invitationServer.start().catch((error) => {
    logger.error('Failed to start server:', error);
    process.exit(1);
});
exports.default = invitationServer;
//# sourceMappingURL=index.js.map