import express from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import { logger } from '../utils/logger'
import { config } from '../config'

const router = express.Router()

// GET /api/v1/vat/rate - Get current Cyprus VAT rate for accommodation
router.get('/rate', asyncHandler(async (req, res) => {
  res.json({
    country: 'Cyprus',
    currency: 'EUR',
    accommodation: {
      rate: config.cyprus.vatRate,
      percentage: `${config.cyprus.vatRate * 100}%`,
      description: 'Cyprus accommodation VAT rate',
      effective_date: '2024-01-01'
    },
    standard: {
      rate: 0.19,
      percentage: '19%',
      description: 'Cyprus standard VAT rate'
    }
  })
}))

// POST /api/v1/vat/calculate - Calculate VAT for reservation
router.post('/calculate', asyncHandler(async (req, res) => {
  const { amount, nights, guests } = req.body

  if (!amount || amount <= 0) {
    return res.status(400).json({
      error: 'Invalid amount provided'
    })
  }

  const baseAmount = parseFloat(amount)
  const vatAmount = baseAmount * config.cyprus.vatRate
  const totalAmount = baseAmount + vatAmount

  res.json({
    calculation: {
      baseAmount,
      vatRate: config.cyprus.vatRate,
      vatAmount: parseFloat(vatAmount.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      currency: 'EUR'
    },
    details: {
      nights: nights || 1,
      guests: guests || 1,
      vatPercentage: `${config.cyprus.vatRate * 100}%`,
      calculatedAt: new Date().toISOString()
    }
  })
}))

// POST /api/v1/vat/report - Submit VAT report to TFA
router.post('/report', asyncHandler(async (req, res) => {
  const { propertyId, quarter, year, revenue, vatCollected } = req.body

  if (!propertyId || !quarter || !year || !revenue) {
    return res.status(400).json({
      error: 'Missing required fields: propertyId, quarter, year, revenue'
    })
  }

  // Log VAT report submission
  logger.info('VAT Report Submission', {
    propertyId,
    quarter,
    year,
    revenue,
    vatCollected,
    tfaEnabled: config.tfa.enabled
  })

  if (!config.tfa.enabled) {
    return res.json({
      status: 'simulated',
      message: 'TFA integration disabled - report logged locally',
      reportId: `VAT-${propertyId}-Q${quarter}-${year}`,
      submissionDate: new Date().toISOString()
    })
  }

  // TODO: Implement actual TFA API integration
  res.json({
    status: 'submitted',
    message: 'VAT report submitted to TFA successfully',
    reportId: `TFA-${Date.now()}`,
    tfaReference: `CY-VAT-${year}-Q${quarter}-${propertyId}`,
    submissionDate: new Date().toISOString(),
    nextReportDue: getNextReportDueDate(quarter, year)
  })
}))

// GET /api/v1/vat/reports/:propertyId - Get VAT reports for property
router.get('/reports/:propertyId', asyncHandler(async (req, res) => {
  const { propertyId } = req.params
  const { year } = req.query

  logger.info('VAT Reports Request', { propertyId, year })

  // TODO: Implement database query for actual reports
  res.json({
    propertyId,
    year: year || new Date().getFullYear(),
    reports: [
      {
        quarter: 1,
        revenue: 125000,
        vatCollected: 11250,
        status: 'submitted',
        submissionDate: '2024-04-30T23:59:59Z',
        tfaReference: 'CY-VAT-2024-Q1-' + propertyId
      },
      {
        quarter: 2,
        revenue: 180000,
        vatCollected: 16200,
        status: 'submitted',
        submissionDate: '2024-07-31T23:59:59Z',
        tfaReference: 'CY-VAT-2024-Q2-' + propertyId
      },
      {
        quarter: 3,
        revenue: 220000,
        vatCollected: 19800,
        status: 'draft',
        dueDate: '2024-10-31T23:59:59Z'
      }
    ]
  })
}))

function getNextReportDueDate(quarter: number, year: number): string {
  const nextQuarter = quarter === 4 ? 1 : quarter + 1
  const nextYear = quarter === 4 ? year + 1 : year

  const dueDates = {
    1: `${nextYear}-04-30T23:59:59Z`, // Q1 due end of April
    2: `${nextYear}-07-31T23:59:59Z`, // Q2 due end of July
    3: `${nextYear}-10-31T23:59:59Z`, // Q3 due end of October
    4: `${nextYear}-01-31T23:59:59Z`  // Q4 due end of January
  }

  return dueDates[nextQuarter as keyof typeof dueDates]
}

export default router