import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { config } from './config'
import { logger } from './utils/logger'
import { errorHandler } from './middleware/errorHandler'

// Import route handlers
import vatRoutes from './routes/vat'
import policeRoutes from './routes/police'
import jccRoutes from './routes/jcc'
import smsRoutes from './routes/sms'
import localizationRoutes from './routes/localization'

const app = express()

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
})
app.use(limiter)

// Body parsing middleware
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'pms-cyprus-localization',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
    cyprus: {
      timezone: 'Asia/Nicosia',
      currency: 'EUR',
      vatRate: '9%',
      services: ['VAT Reporting', 'Police Registration', 'JCC Payments', 'SMS Integration']
    }
  })
})

// API routes
app.use('/api/v1/vat', vatRoutes)
app.use('/api/v1/police', policeRoutes)
app.use('/api/v1/jcc', jccRoutes)
app.use('/api/v1/sms', smsRoutes)
app.use('/api/v1/localization', localizationRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      '/health',
      '/api/v1/vat',
      '/api/v1/police',
      '/api/v1/jcc',
      '/api/v1/sms',
      '/api/v1/localization'
    ]
  })
})

// Error handling middleware
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 3017
const HOST = process.env.HOST || '0.0.0.0'

app.listen(PORT, HOST, () => {
  logger.info(`🇨🇾 Cyprus Localization Service started`)
  logger.info(`📍 Server running on http://${HOST}:${PORT}`)
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  logger.info(`🏛️ VAT Rate: 9% (Cyprus accommodation)`)
  logger.info(`🚔 Police Registration: Enabled`)
  logger.info(`💳 JCC Payments: ${config.jcc.enabled ? 'Enabled' : 'Disabled'}`)
  logger.info(`📱 SMS Providers: Primetel, MTN Cyprus`)
})

export default app