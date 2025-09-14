import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth';
import serviceRoutes from './routes/services';
import healthRoutes from './routes/health';

import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';
import { initializeRedis } from './services/redis';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [
        'https://admin.pms.domain.com',
        'https://guest.pms.domain.com',
        'https://staff.pms.domain.com',
        'https://marketplace.pms.domain.com'
      ]
    : [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
        'http://localhost:5000'
      ],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/health', healthRoutes);
app.use('/ready', healthRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Initialize services
async function startServer() {
  try {
    // Initialize Redis connection
    await initializeRedis();
    console.log('✅ Redis connected successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 PMS Core Authentication Service running on port ${PORT}`);
      console.log(`📋 Health check available at: http://localhost:${PORT}/health`);
      console.log(`🔐 Authentication API available at: http://localhost:${PORT}/api/v1/auth`);
      console.log(`⚙️ Service management API available at: http://localhost:${PORT}/api/v1/services`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();