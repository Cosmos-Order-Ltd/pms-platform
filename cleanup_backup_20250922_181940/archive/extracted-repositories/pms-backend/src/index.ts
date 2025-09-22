import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import reservationRoutes from './routes/reservations';
import guestRoutes from './routes/guests';
import propertyRoutes from './routes/properties';
import roomRoutes from './routes/rooms';
import staffRoutes from './routes/staff';
import systemRoutes from './routes/system';
import cyprusRoutes from './routes/cyprus';
import tenantRoutes from './routes/tenants';

import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';
import { tenantMiddleware, trackUsageMiddleware } from './middleware/tenant';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://admin.pms.com', 'https://guest.pms.com', 'https://staff.pms.com']
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Multi-tenant and tenant management routes (no tenant middleware needed)
app.use('/api/v1/tenants', tenantRoutes);

// Tenant-aware API routes with middleware
app.use('/api/v1/auth', tenantMiddleware, trackUsageMiddleware('api_calls'), authRoutes);
app.use('/api/v1/admin', tenantMiddleware, trackUsageMiddleware('api_calls'), adminRoutes);
app.use('/api/v1/reservations', tenantMiddleware, trackUsageMiddleware('api_calls'), reservationRoutes);
app.use('/api/v1/guests', tenantMiddleware, trackUsageMiddleware('api_calls'), guestRoutes);
app.use('/api/v1/properties', tenantMiddleware, trackUsageMiddleware('api_calls'), propertyRoutes);
app.use('/api/v1/rooms', tenantMiddleware, trackUsageMiddleware('api_calls'), roomRoutes);
app.use('/api/v1/staff', tenantMiddleware, trackUsageMiddleware('api_calls'), staffRoutes);
app.use('/api/v1/system', tenantMiddleware, trackUsageMiddleware('api_calls'), systemRoutes);
app.use('/api/v1/cyprus', tenantMiddleware, trackUsageMiddleware('api_calls'), cyprusRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 PMS Backend API running on port ${PORT}`);
  console.log(`📋 Health check available at: http://localhost:${PORT}/health`);
});