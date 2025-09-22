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

import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';

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

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/reservations', reservationRoutes);
app.use('/api/v1/guests', guestRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1/system', systemRoutes);
app.use('/api/v1/cyprus', cyprusRoutes);

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