import express from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import { logger } from '../utils/logger'
import { config } from '../config'

const router = express.Router()

// POST /api/v1/sms/send - Send SMS via Cyprus providers
router.post('/send', asyncHandler(async (req, res) => {
  const {
    phoneNumber,
    message,
    provider = config.sms.defaultProvider,
    reservationId,
    guestId
  } = req.body

  if (!phoneNumber || !message) {
    return res.status(400).json({
      error: 'Missing required fields: phoneNumber, message'
    })
  }

  // Validate Cyprus phone number format
  if (!isValidCyprusPhoneNumber(phoneNumber)) {
    return res.status(400).json({
      error: 'Invalid Cyprus phone number format. Expected: +357XXXXXXXX'
    })
  }

  // Check message length
  if (message.length > config.sms.maxLength) {
    return res.status(400).json({
      error: `Message too long. Maximum ${config.sms.maxLength} characters allowed.`
    })
  }

  const messageId = `SMS-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`

  logger.info('SMS Send Request', {
    messageId,
    phoneNumber: maskPhoneNumber(phoneNumber),
    provider,
    messageLength: message.length,
    reservationId,
    guestId
  })

  // Check if provider is enabled
  const providerConfig = provider === 'PRIMETEL' ? config.sms.primetel : config.sms.mtn
  if (!providerConfig.enabled) {
    return res.status(400).json({
      error: `SMS provider ${provider} is not enabled`
    })
  }

  // TODO: Implement actual SMS provider integration
  res.json({
    messageId,
    providerRef: `${provider}-${Date.now()}`,
    status: 'sent',
    phoneNumber: maskPhoneNumber(phoneNumber),
    provider,
    cost: config.sms.costPerSMS,
    currency: 'EUR',
    estimatedDelivery: new Date(Date.now() + 30000).toISOString(), // 30 seconds
    sentAt: new Date().toISOString(),
    messageLength: message.length,
    parts: Math.ceil(message.length / 160)
  })
}))

// POST /api/v1/sms/bulk-send - Send bulk SMS messages
router.post('/bulk-send', asyncHandler(async (req, res) => {
  const { messages, provider = config.sms.defaultProvider } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({
      error: 'Invalid request - expected array of messages'
    })
  }

  const batchId = `BATCH-${Date.now()}`

  logger.info('SMS Bulk Send Request', {
    batchId,
    count: messages.length,
    provider
  })

  const results = messages.map((msg, index) => {
    const messageId = `${batchId}-${index}`

    return {
      index,
      messageId,
      phoneNumber: maskPhoneNumber(msg.phoneNumber),
      status: isValidCyprusPhoneNumber(msg.phoneNumber) ? 'sent' : 'failed',
      error: !isValidCyprusPhoneNumber(msg.phoneNumber) ? 'Invalid phone number' : null,
      cost: isValidCyprusPhoneNumber(msg.phoneNumber) ? config.sms.costPerSMS : 0,
      sentAt: new Date().toISOString()
    }
  })

  const successful = results.filter(r => r.status === 'sent').length
  const totalCost = successful * config.sms.costPerSMS

  res.json({
    batchId,
    summary: {
      totalMessages: messages.length,
      successful,
      failed: messages.length - successful,
      totalCost: parseFloat(totalCost.toFixed(4)),
      currency: 'EUR'
    },
    results,
    provider,
    processedAt: new Date().toISOString()
  })
}))

// GET /api/v1/sms/status/:messageId - Check SMS delivery status
router.get('/status/:messageId', asyncHandler(async (req, res) => {
  const { messageId } = req.params

  logger.info('SMS Status Check', { messageId })

  // TODO: Implement actual SMS status checking
  res.json({
    messageId,
    status: 'delivered',
    phoneNumber: '+357********',
    provider: config.sms.defaultProvider,
    sentAt: '2024-09-22T10:30:00Z',
    deliveredAt: '2024-09-22T10:30:15Z',
    cost: config.sms.costPerSMS,
    currency: 'EUR',
    deliveryReceipt: {
      received: true,
      timestamp: '2024-09-22T10:30:15Z',
      status: 'DELIVRD'
    }
  })
}))

// GET /api/v1/sms/providers - Get available SMS providers
router.get('/providers', asyncHandler(async (req, res) => {
  res.json({
    defaultProvider: config.sms.defaultProvider,
    providers: [
      {
        name: 'PRIMETEL',
        displayName: 'Primetel Cyprus',
        enabled: config.sms.primetel.enabled,
        features: ['Delivery receipts', 'Unicode support', 'Long messages'],
        coverage: 'Cyprus domestic',
        pricing: {
          costPerSMS: config.sms.costPerSMS,
          currency: 'EUR',
          billing: 'per message part (160 chars)'
        }
      },
      {
        name: 'MTN_CYPRUS',
        displayName: 'MTN Cyprus',
        enabled: config.sms.mtn.enabled,
        features: ['Delivery receipts', 'Unicode support', 'Bulk messaging'],
        coverage: 'Cyprus domestic',
        pricing: {
          costPerSMS: config.sms.costPerSMS,
          currency: 'EUR',
          billing: 'per message part (160 chars)'
        }
      }
    ],
    limits: {
      maxMessageLength: config.sms.maxLength,
      maxBulkSize: 1000,
      rateLimitPerMinute: 60
    }
  })
}))

// GET /api/v1/sms/reports/:startDate/:endDate - Get SMS usage reports
router.get('/reports/:startDate/:endDate', asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.params

  logger.info('SMS Usage Report', { startDate, endDate })

  // TODO: Implement database query for actual reports
  res.json({
    reportPeriod: {
      startDate,
      endDate
    },
    summary: {
      totalMessages: 156,
      successful: 152,
      failed: 4,
      totalCost: 3.74,
      currency: 'EUR',
      successRate: '97.4%'
    },
    byProvider: {
      PRIMETEL: {
        messages: 98,
        successful: 96,
        cost: 2.35
      },
      MTN_CYPRUS: {
        messages: 58,
        successful: 56,
        cost: 1.39
      }
    },
    topReasons: [
      { reason: 'Booking confirmation', count: 45 },
      { reason: 'Check-in reminder', count: 32 },
      { reason: 'Payment receipt', count: 28 },
      { reason: 'Check-out notification', count: 22 }
    ],
    dailyBreakdown: generateDailyBreakdown(startDate, endDate)
  })
}))

// Helper functions
function isValidCyprusPhoneNumber(phoneNumber: string): boolean {
  // Cyprus phone numbers: +357XXXXXXXX (8 digits after +357)
  const cyprusRegex = /^\+357[2-9]\d{7}$/
  return cyprusRegex.test(phoneNumber)
}

function maskPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber || phoneNumber.length < 8) return '*******'

  const start = phoneNumber.substring(0, 4) // +357
  const end = phoneNumber.substring(phoneNumber.length - 2)
  const masked = '*'.repeat(phoneNumber.length - 6)

  return start + masked + end
}

function generateDailyBreakdown(startDate: string, endDate: string) {
  // Simple mock data generation
  const start = new Date(startDate)
  const end = new Date(endDate)
  const breakdown = []

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    breakdown.push({
      date: d.toISOString().substring(0, 10),
      messages: Math.floor(Math.random() * 20) + 5,
      cost: parseFloat((Math.random() * 0.5 + 0.1).toFixed(3))
    })
  }

  return breakdown
}

export default router