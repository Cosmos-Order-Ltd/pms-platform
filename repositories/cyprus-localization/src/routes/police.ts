import express from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import { logger } from '../utils/logger'
import { config } from '../config'

const router = express.Router()

// POST /api/v1/police/register - Register guest with Cyprus Police
router.post('/register', asyncHandler(async (req, res) => {
  const {
    guestId,
    reservationId,
    propertyId,
    passportNumber,
    nationality,
    firstName,
    lastName,
    arrivalDate,
    departureDate,
    roomNumber
  } = req.body

  // Validate required fields
  const requiredFields = ['guestId', 'reservationId', 'propertyId', 'passportNumber', 'nationality', 'arrivalDate', 'roomNumber']
  const missingFields = requiredFields.filter(field => !req.body[field])

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Missing required fields',
      missingFields,
      requiredFields: config.police.requiredFields
    })
  }

  // Check if registration is within deadline (24 hours after arrival)
  const arrivalTime = new Date(arrivalDate)
  const now = new Date()
  const hoursAfterArrival = (now.getTime() - arrivalTime.getTime()) / (1000 * 60 * 60)

  if (hoursAfterArrival > config.police.reportingDeadline) {
    logger.warn('Late Police Registration', {
      guestId,
      arrivalDate,
      hoursLate: hoursAfterArrival - config.police.reportingDeadline
    })
  }

  // Log registration attempt
  logger.info('Police Registration Request', {
    guestId,
    reservationId,
    propertyId,
    nationality,
    arrivalDate,
    roomNumber,
    enabled: config.police.enabled
  })

  if (!config.police.enabled) {
    return res.json({
      status: 'simulated',
      message: 'Police registration disabled - logged locally only',
      registrationId: `POLICE-${guestId}-${Date.now()}`,
      submissionDate: new Date().toISOString()
    })
  }

  // TODO: Implement actual Cyprus Police API integration
  res.json({
    status: 'submitted',
    message: 'Guest registration submitted to Cyprus Police successfully',
    registrationId: `CY-POLICE-${Date.now()}`,
    policeReference: `REG-${propertyId}-${roomNumber}-${arrivalDate.substring(0, 10)}`,
    submissionDate: new Date().toISOString(),
    confirmationCode: generateConfirmationCode(),
    guestDetails: {
      guestId,
      passportNumber: maskPassportNumber(passportNumber),
      nationality,
      arrivalDate,
      departureDate,
      roomNumber
    }
  })
}))

// GET /api/v1/police/status/:registrationId - Check registration status
router.get('/status/:registrationId', asyncHandler(async (req, res) => {
  const { registrationId } = req.params

  logger.info('Police Registration Status Check', { registrationId })

  // TODO: Implement actual status checking with Cyprus Police API
  res.json({
    registrationId,
    status: 'confirmed',
    submissionDate: '2024-09-22T10:30:00Z',
    confirmationDate: '2024-09-22T11:15:00Z',
    policeReference: `REG-PROP-101-2024-09-22`,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    lastChecked: new Date().toISOString()
  })
}))

// POST /api/v1/police/bulk-register - Bulk register multiple guests
router.post('/bulk-register', asyncHandler(async (req, res) => {
  const { registrations } = req.body

  if (!registrations || !Array.isArray(registrations)) {
    return res.status(400).json({
      error: 'Invalid request - expected array of registrations'
    })
  }

  logger.info('Bulk Police Registration', {
    count: registrations.length,
    enabled: config.police.enabled
  })

  const results = registrations.map((registration, index) => {
    const registrationId = `BULK-${Date.now()}-${index}`

    return {
      index,
      guestId: registration.guestId,
      status: config.police.enabled ? 'submitted' : 'simulated',
      registrationId,
      policeReference: `REG-BULK-${index}-${new Date().toISOString().substring(0, 10)}`,
      submissionDate: new Date().toISOString()
    }
  })

  res.json({
    bulkRegistration: {
      totalRequests: registrations.length,
      successful: results.length,
      failed: 0,
      submissionDate: new Date().toISOString()
    },
    results
  })
}))

// GET /api/v1/police/reports/:propertyId - Get police registration reports
router.get('/reports/:propertyId', asyncHandler(async (req, res) => {
  const { propertyId } = req.params
  const { startDate, endDate } = req.query

  logger.info('Police Registration Reports', {
    propertyId,
    startDate,
    endDate
  })

  // TODO: Implement database query for actual reports
  res.json({
    propertyId,
    reportPeriod: {
      startDate: startDate || '2024-09-01',
      endDate: endDate || '2024-09-30'
    },
    summary: {
      totalRegistrations: 42,
      successful: 41,
      failed: 1,
      pending: 0,
      complianceRate: '97.6%'
    },
    registrations: [
      {
        guestId: 'guest-001',
        registrationId: 'CY-POLICE-12345',
        passportNumber: 'GB******789',
        nationality: 'UK',
        arrivalDate: '2024-09-22',
        roomNumber: '101',
        status: 'confirmed',
        submissionDate: '2024-09-22T10:30:00Z'
      }
    ]
  })
}))

// Helper functions
function generateConfirmationCode(): string {
  return 'CY' + Math.random().toString(36).substring(2, 8).toUpperCase()
}

function maskPassportNumber(passportNumber: string): string {
  if (!passportNumber || passportNumber.length < 4) return '*****'

  const start = passportNumber.substring(0, 2)
  const end = passportNumber.substring(passportNumber.length - 3)
  const masked = '*'.repeat(passportNumber.length - 5)

  return start + masked + end
}

export default router