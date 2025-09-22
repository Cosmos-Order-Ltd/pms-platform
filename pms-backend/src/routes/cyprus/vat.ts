import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Cyprus VAT configuration
const CYPRUS_VAT_RATE = 0.09; // 9% for accommodation services
const TFA_API_URL = process.env.TFA_API_URL || 'https://www.tfa.mof.gov.cy/api';

// Validation schemas
const generateVATReportSchema = z.object({
  propertyId: z.string().cuid(),
  quarter: z.number().int().min(1).max(4),
  year: z.number().int().min(2020).max(2030)
});

const submitVATReportSchema = z.object({
  reportId: z.string().cuid(),
  submitterUserId: z.string().cuid()
});

// VAT calculation utilities
class CyprusVATService {
  /**
   * Calculate VAT amount for a given base amount
   */
  static calculateVAT(baseAmount: number): number {
    return Math.round((baseAmount * CYPRUS_VAT_RATE) * 100) / 100;
  }

  /**
   * Calculate base amount from total including VAT
   */
  static calculateBaseFromTotal(totalAmount: number): number {
    const baseAmount = totalAmount / (1 + CYPRUS_VAT_RATE);
    return Math.round(baseAmount * 100) / 100;
  }

  /**
   * Get quarter start and end dates
   */
  static getQuarterDates(quarter: number, year: number): { start: Date; end: Date } {
    const quarters = {
      1: { start: new Date(year, 0, 1), end: new Date(year, 2, 31, 23, 59, 59) },
      2: { start: new Date(year, 3, 1), end: new Date(year, 5, 30, 23, 59, 59) },
      3: { start: new Date(year, 6, 1), end: new Date(year, 8, 30, 23, 59, 59) },
      4: { start: new Date(year, 9, 1), end: new Date(year, 11, 31, 23, 59, 59) }
    };

    return quarters[quarter as keyof typeof quarters];
  }

  /**
   * Generate VAT report data for a property and quarter
   */
  static async generateReportData(propertyId: string, quarter: number, year: number) {
    const { start, end } = this.getQuarterDates(quarter, year);

    // Get all reservations for the quarter
    const reservations = await prisma.reservation.findMany({
      where: {
        propertyId,
        checkIn: {
          gte: start,
          lte: end
        },
        status: {
          in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'COMPLETED']
        }
      },
      include: {
        guest: {
          select: {
            firstName: true,
            lastName: true,
            nationality: true,
            cyprusResident: true
          }
        },
        property: {
          select: {
            name: true,
            vatNumber: true
          }
        }
      }
    });

    // Calculate totals
    let totalRevenue = 0;
    let vatCollected = 0;
    let taxableAmount = 0;
    let exemptAmount = 0;

    const reservationDetails = reservations.map(reservation => {
      const baseAmount = reservation.baseAmount;
      const vatAmount = reservation.vatAmount || this.calculateVAT(baseAmount);

      // Check if guest is exempt (e.g., Cyprus residents might have different rules)
      const isExempt = false; // Implement exemption logic if needed

      if (isExempt) {
        exemptAmount += baseAmount;
      } else {
        taxableAmount += baseAmount;
        vatCollected += vatAmount;
      }

      totalRevenue += reservation.totalAmount;

      return {
        reservationNumber: reservation.reservationNumber,
        guestName: `${reservation.guest.firstName} ${reservation.guest.lastName}`,
        nationality: reservation.guest.nationality,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        baseAmount,
        vatAmount,
        totalAmount: reservation.totalAmount,
        isExempt
      };
    });

    return {
      summary: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        vatCollected: Math.round(vatCollected * 100) / 100,
        taxableAmount: Math.round(taxableAmount * 100) / 100,
        exemptAmount: Math.round(exemptAmount * 100) / 100,
        reservationCount: reservations.length
      },
      reservations: reservationDetails
    };
  }

  /**
   * Submit VAT report to TFA system (mock implementation)
   */
  static async submitToTFA(report: any): Promise<{ reference: string; status: string }> {
    // In production, this would integrate with the actual TFA API
    // For now, return a mock response
    const reference = `TFA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate 95% success rate
    const success = Math.random() > 0.05;

    return {
      reference,
      status: success ? 'SUBMITTED' : 'FAILED'
    };
  }
}

// Routes

/**
 * @route POST /api/v1/cyprus/vat/calculate
 * @desc Calculate VAT for a given amount
 * @access Private
 */
router.post('/calculate', async (req, res) => {
  try {
    const { baseAmount, includesVat } = req.body;

    if (!baseAmount || typeof baseAmount !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Base amount is required and must be a number'
      });
    }

    let vatAmount: number;
    let totalAmount: number;
    let netAmount: number;

    if (includesVat) {
      // Amount includes VAT, extract the VAT portion
      netAmount = CyprusVATService.calculateBaseFromTotal(baseAmount);
      vatAmount = baseAmount - netAmount;
      totalAmount = baseAmount;
    } else {
      // Amount excludes VAT, add VAT
      netAmount = baseAmount;
      vatAmount = CyprusVATService.calculateVAT(baseAmount);
      totalAmount = baseAmount + vatAmount;
    }

    res.json({
      success: true,
      data: {
        netAmount: Math.round(netAmount * 100) / 100,
        vatAmount: Math.round(vatAmount * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
        vatRate: CYPRUS_VAT_RATE
      }
    });

  } catch (error) {
    console.error('VAT Calculation Error:', error);
    res.status(500).json({
      success: false,
      message: 'VAT calculation failed'
    });
  }
});

/**
 * @route POST /api/v1/cyprus/vat/generate-report
 * @desc Generate VAT report for a property and quarter
 * @access Private
 */
router.post('/generate-report', async (req, res) => {
  try {
    const validatedData = generateVATReportSchema.parse(req.body);
    const { propertyId, quarter, year } = validatedData;

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        id: true,
        name: true,
        vatNumber: true
      }
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if report already exists
    const existingReport = await prisma.cyprusVATReport.findUnique({
      where: {
        propertyId_quarter_year: {
          propertyId,
          quarter,
          year
        }
      }
    });

    if (existingReport && existingReport.status !== 'DRAFT') {
      return res.status(409).json({
        success: false,
        message: 'VAT report already exists for this period'
      });
    }

    // Generate report data
    const reportData = await CyprusVATService.generateReportData(propertyId, quarter, year);

    // Create or update report
    const report = await prisma.cyprusVATReport.upsert({
      where: {
        propertyId_quarter_year: {
          propertyId,
          quarter,
          year
        }
      },
      update: {
        totalRevenue: reportData.summary.totalRevenue,
        vatCollected: reportData.summary.vatCollected,
        taxableAmount: reportData.summary.taxableAmount,
        exemptAmount: reportData.summary.exemptAmount,
        preparedBy: req.user?.id,
        status: 'DRAFT'
      },
      create: {
        propertyId,
        quarter,
        year,
        reportingPeriod: `Q${quarter} ${year}`,
        totalRevenue: reportData.summary.totalRevenue,
        vatCollected: reportData.summary.vatCollected,
        taxableAmount: reportData.summary.taxableAmount,
        exemptAmount: reportData.summary.exemptAmount,
        preparedBy: req.user?.id,
        status: 'DRAFT'
      },
      include: {
        property: {
          select: {
            name: true,
            vatNumber: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: {
        report,
        details: reportData
      }
    });

  } catch (error) {
    console.error('VAT Report Generation Error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to generate VAT report'
    });
  }
});

/**
 * @route POST /api/v1/cyprus/vat/submit-report
 * @desc Submit VAT report to TFA system
 * @access Private
 */
router.post('/submit-report', async (req, res) => {
  try {
    const validatedData = submitVATReportSchema.parse(req.body);
    const { reportId, submitterUserId } = validatedData;

    // Find the report
    const report = await prisma.cyprusVATReport.findUnique({
      where: { id: reportId },
      include: {
        property: {
          select: {
            name: true,
            vatNumber: true
          }
        }
      }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'VAT report not found'
      });
    }

    if (report.status !== 'DRAFT') {
      return res.status(400).json({
        success: false,
        message: 'Only draft reports can be submitted'
      });
    }

    // Submit to TFA system
    const submissionResult = await CyprusVATService.submitToTFA(report);

    // Update report with submission details
    const updatedReport = await prisma.cyprusVATReport.update({
      where: { id: reportId },
      data: {
        submissionDate: new Date(),
        tfaReference: submissionResult.reference,
        status: submissionResult.status === 'SUBMITTED' ? 'SUBMITTED' : 'REJECTED',
        reviewedBy: submitterUserId
      }
    });

    res.json({
      success: true,
      data: {
        report: updatedReport,
        tfaReference: submissionResult.reference,
        status: submissionResult.status
      }
    });

  } catch (error) {
    console.error('VAT Report Submission Error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit VAT report'
    });
  }
});

/**
 * @route GET /api/v1/cyprus/vat/reports
 * @desc Get VAT reports for a property
 * @access Private
 */
router.get('/reports', async (req, res) => {
  try {
    const {
      propertyId,
      year,
      status,
      page = 1,
      limit = 20
    } = req.query;

    const where: any = {};

    if (propertyId) {
      where.propertyId = propertyId;
    }

    if (year) {
      where.year = Number(year);
    }

    if (status) {
      where.status = status;
    }

    const [reports, total] = await Promise.all([
      prisma.cyprusVATReport.findMany({
        where,
        include: {
          property: {
            select: {
              name: true,
              vatNumber: true
            }
          }
        },
        orderBy: [
          { year: 'desc' },
          { quarter: 'desc' }
        ],
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.cyprusVATReport.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });

  } catch (error) {
    console.error('VAT Reports Query Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch VAT reports'
    });
  }
});

/**
 * @route GET /api/v1/cyprus/vat/reports/:id
 * @desc Get a specific VAT report with details
 * @access Private
 */
router.get('/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const report = await prisma.cyprusVATReport.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            name: true,
            vatNumber: true,
            address: true
          }
        }
      }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'VAT report not found'
      });
    }

    // Get detailed reservation data for the report period
    const reportDetails = await CyprusVATService.generateReportData(
      report.propertyId,
      report.quarter,
      report.year
    );

    res.json({
      success: true,
      data: {
        report,
        details: reportDetails
      }
    });

  } catch (error) {
    console.error('VAT Report Detail Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch VAT report details'
    });
  }
});

/**
 * @route DELETE /api/v1/cyprus/vat/reports/:id
 * @desc Delete a draft VAT report
 * @access Private
 */
router.delete('/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const report = await prisma.cyprusVATReport.findUnique({
      where: { id }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'VAT report not found'
      });
    }

    if (report.status !== 'DRAFT') {
      return res.status(400).json({
        success: false,
        message: 'Only draft reports can be deleted'
      });
    }

    await prisma.cyprusVATReport.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'VAT report deleted successfully'
    });

  } catch (error) {
    console.error('VAT Report Deletion Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete VAT report'
    });
  }
});

/**
 * @route GET /api/v1/cyprus/vat/dashboard/:propertyId
 * @desc Get VAT dashboard data for a property
 * @access Private
 */
router.get('/dashboard/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const currentYear = new Date().getFullYear();
    const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);

    // Get current year reports
    const reports = await prisma.cyprusVATReport.findMany({
      where: {
        propertyId,
        year: currentYear
      },
      orderBy: { quarter: 'asc' }
    });

    // Calculate year-to-date totals
    const ytdTotals = reports.reduce((acc, report) => ({
      totalRevenue: acc.totalRevenue + report.totalRevenue,
      vatCollected: acc.vatCollected + report.vatCollected,
      taxableAmount: acc.taxableAmount + report.taxableAmount
    }), {
      totalRevenue: 0,
      vatCollected: 0,
      taxableAmount: 0
    });

    // Check compliance status
    const complianceStatus = {
      q1: reports.find(r => r.quarter === 1)?.status || 'PENDING',
      q2: reports.find(r => r.quarter === 2)?.status || 'PENDING',
      q3: reports.find(r => r.quarter === 3)?.status || 'PENDING',
      q4: reports.find(r => r.quarter === 4)?.status || 'PENDING'
    };

    // Next due date (quarterly reporting)
    const nextDueQuarter = currentQuarter > 4 ? 1 : currentQuarter;
    const nextDueYear = currentQuarter > 4 ? currentYear + 1 : currentYear;
    const nextDueDate = new Date(nextDueYear, (nextDueQuarter - 1) * 3 + 3, 31); // End of quarter + 1 month

    res.json({
      success: true,
      data: {
        currentYear,
        currentQuarter,
        ytdTotals,
        complianceStatus,
        nextDueDate,
        reports,
        vatRate: CYPRUS_VAT_RATE
      }
    });

  } catch (error) {
    console.error('VAT Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch VAT dashboard data'
    });
  }
});

export default router;