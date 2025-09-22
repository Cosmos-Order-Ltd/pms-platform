/**
 * Cyprus Access Control (CAC) - Main Server Entry Point
 * Geofenced Invitation Orchestration Service
 * Container #31 - Universal Access Control for Cyprus Business Empire
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import winston from 'winston';

// Import database and utilities
import databaseManager from './database/connection';

// Import routes
import healthRoutes from './routes/health';
import invitationRoutes from './routes/invitations';
import locationRoutes from './routes/location';
import qrRoutes from './routes/qr';
import courierRoutes from './routes/courier';
import adminRoutes from './routes/admin';
import analyticsRoutes from './routes/analytics';
import trialsRoutes from './routes/trials';

// Import middleware
import errorHandler from './middleware/errorHandler';
import rateLimiter from './middleware/rateLimiter';
import authMiddleware from './middleware/auth';

// Load environment variables
dotenv.config();

// Initialize logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: process.env.LOG_FILE || './logs/invitation-engine.log'
    })
  ]
});

// Application configuration
const config = {
  port: parseInt(process.env.PORT || '3019'),
  adminPort: parseInt(process.env.ADMIN_PORT || '3020'),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3010', 'http://192.168.30.98:3010']
};

class InvitationServer {
  private app: express.Application;
  private adminApp: express.Application;
  private server: any;
  private adminServer: any;
  private io: SocketIOServer;
  private adminIo: SocketIOServer;

  constructor() {
    this.app = express();
    this.adminApp = express();
    this.setupMainApp();
    this.setupAdminApp();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  /**
   * Configure main application (Public API)
   */
  private setupMainApp(): void {
    // Security middleware
    this.app.use(helmet({
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

    // CORS configuration
    this.app.use(cors({
      origin: config.corsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Basic middleware
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging
    this.app.use(morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) }
    }));

    // Rate limiting
    this.app.use(rateLimiter);
  }

  /**
   * Configure admin application (Admin Dashboard)
   */
  private setupAdminApp(): void {
    // Security middleware for admin
    this.adminApp.use(helmet());

    // CORS for admin dashboard
    this.adminApp.use(cors({
      origin: ['http://localhost:3020', 'http://192.168.30.98:3020'],
      credentials: true
    }));

    // Basic middleware
    this.adminApp.use(compression());
    this.adminApp.use(express.json());
    this.adminApp.use(express.urlencoded({ extended: true }));

    // Logging for admin
    this.adminApp.use(morgan('combined', {
      stream: { write: (message) => logger.info(`[ADMIN] ${message.trim()}`) }
    }));

    // Serve static files for admin dashboard
    this.adminApp.use(express.static('src/admin/public'));
  }

  /**
   * Setup additional middleware
   */
  private setupMiddleware(): void {
    // Request ID middleware
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

    // Request timing
    this.app.use((req, res, next) => {
      req.startTime = Date.now();
      next();
    });

    this.adminApp.use((req, res, next) => {
      req.startTime = Date.now();
      next();
    });
  }

  /**
   * Setup API routes
   */
  private setupRoutes(): void {
    // Main API routes (Port 3019)
    this.app.use('/health', healthRoutes);
    this.app.use('/api/invitations', invitationRoutes);
    this.app.use('/api/location', locationRoutes);
    this.app.use('/qr', qrRoutes);
    this.app.use('/api/qr', qrRoutes);
    this.app.use('/webhook/courier', courierRoutes);
    this.app.use('/api/courier', courierRoutes);
    this.app.use('/api/trials', trialsRoutes);
    this.app.use('/api/analytics', analyticsRoutes);

    // Root endpoint with service information
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

    // Admin routes (Port 3020) - Protected
    this.adminApp.use('/api', authMiddleware.adminAuth, adminRoutes);

    // Admin dashboard home
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

    // 404 handlers
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

  /**
   * Setup error handling
   */
  private setupErrorHandling(): void {
    this.app.use(errorHandler);
    this.adminApp.use(errorHandler);

    // Global error handlers
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });
  }

  /**
   * Setup WebSocket connections for real-time updates
   */
  private setupWebSockets(): void {
    // Main API WebSocket (for public updates)
    this.io = new SocketIOServer(this.server, {
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

    // Admin WebSocket (for admin dashboard)
    this.adminIo = new SocketIOServer(this.adminServer, {
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

  /**
   * Start the servers
   */
  async start(): Promise<void> {
    try {
      // Check database connectivity
      const healthCheck = await databaseManager.healthCheck();
      if (!healthCheck.postgres || !healthCheck.redis) {
        logger.error('Database connectivity check failed:', healthCheck);
        throw new Error('Database connection failed');
      }

      // Create HTTP servers
      this.server = createServer(this.app);
      this.adminServer = createServer(this.adminApp);

      // Setup WebSockets
      this.setupWebSockets();

      // Start main API server
      this.server.listen(config.port, () => {
        logger.info(`🎯 Cyprus Access Control (CAC) API running on port ${config.port}`);
        logger.info(`📡 Main API: http://192.168.30.98:${config.port}`);
        logger.info(`🔑 Invitation QR Codes: http://192.168.30.98:${config.port}/qr`);
        logger.info(`🌍 Location Validation: http://192.168.30.98:${config.port}/api/location`);
      });

      // Start admin server
      this.adminServer.listen(config.adminPort, () => {
        logger.info(`👑 Cyprus Access Control Admin Dashboard running on port ${config.adminPort}`);
        logger.info(`📊 Admin Interface: http://192.168.30.98:${config.adminPort}`);
        logger.info(`🗺️ Live Invitation Map: http://192.168.30.98:${config.adminPort}/api/dashboard`);
      });

      logger.info('🚀 Container #31 is operational and ready to control Cyprus business access');
      logger.info('🎫 Ready to generate CYH, CYR, and CYC invitation series');

    } catch (error) {
      logger.error('Failed to start Cyprus Access Control servers:', error);
      process.exit(1);
    }
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    logger.info('Shutting down Cyprus Access Control servers...');

    // Close WebSocket connections
    if (this.io) {
      this.io.close();
    }
    if (this.adminIo) {
      this.adminIo.close();
    }

    // Close HTTP servers
    if (this.server) {
      this.server.close();
    }
    if (this.adminServer) {
      this.adminServer.close();
    }

    // Close database connections
    await databaseManager.close();

    logger.info('Cyprus Access Control shutdown complete');
    process.exit(0);
  }

  /**
   * Get WebSocket instances for external use
   */
  get webSockets() {
    return {
      main: this.io,
      admin: this.adminIo
    };
  }
}

// Create and start server
const invitationServer = new InvitationServer();

// Handle shutdown signals
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  invitationServer.shutdown();
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  invitationServer.shutdown();
});

// Start the server
invitationServer.start().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});

export default invitationServer;

// Extend Express Request interface for TypeScript
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      startTime?: number;
      user?: {
        id: string;
        role: string;
        permissions: string[];
      };
    }
  }
}