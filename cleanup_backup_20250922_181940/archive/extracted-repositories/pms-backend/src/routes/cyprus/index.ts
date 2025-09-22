import express from 'express';
import jccRoutes from './jcc';
import vatRoutes from './vat';
import policeRoutes from './police';
import smsRoutes from './sms';

const router = express.Router();

// Cyprus-specific route modules
router.use('/jcc', jccRoutes);
router.use('/vat', vatRoutes);
router.use('/police', policeRoutes);
router.use('/sms', smsRoutes);

// Cyprus configuration endpoint
router.get('/config', async (_req, res) => {
  try {
    const config = {
      vat: {
        rate: 0.09,
        enabled: true,
        reporting: {
          frequency: 'quarterly',
          nextDue: getNextVATDueDate()
        }
      },
      jcc: {
        enabled: !!process.env.JCC_MERCHANT_ID,
        supportedCurrencies: ['EUR', 'GBP', 'USD', 'ILS'],
        threeDSecure: true
      },
      police: {
        enabled: true,
        deadline: '24 hours after arrival',
        requiredForNonResidents: true
      },
      sms: {
        enabled: true,
        providers: ['PRIMETEL', 'MTN_CYPRUS'],
        defaultProvider: 'PRIMETEL',
        costPerSms: 0.024,
        supportedLanguages: ['en', 'el', 'he', 'ru']
      },
      localization: {
        timezone: 'Asia/Nicosia',
        dateFormat: 'DD/MM/YYYY',
        primaryLanguage: 'en',
        supportedLanguages: ['en', 'el', 'he', 'ru'],
        currency: 'EUR'
      }
    };

    res.json({
      success: true,
      data: config
    });

  } catch (error) {
    console.error('Cyprus Config Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Cyprus configuration'
    });
  }
});

// Cyprus dashboard overview
router.get('/dashboard', async (req, res) => {
  try {
    const { propertyId } = req.query;

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        message: 'Property ID is required'
      });
    }

    // Get overview data from all Cyprus services
    const [vatData, policeData, smsData, jccData] = await Promise.all([
      fetch(`/api/v1/cyprus/vat/dashboard/${propertyId}`).then(r => r.json()).catch(() => ({})),
      fetch(`/api/v1/cyprus/police/dashboard/${propertyId}`).then(r => r.json()).catch(() => ({})),
      fetch(`/api/v1/cyprus/sms/statistics`).then(r => r.json()).catch(() => ({})),
      fetch(`/api/v1/cyprus/jcc/transactions?propertyId=${propertyId}&limit=5`).then(r => r.json()).catch(() => ({}))
    ]);

    const dashboard = {
      vat: (vatData as any)?.data || null,
      police: (policeData as any)?.data || null,
      sms: (smsData as any)?.data || null,
      jcc: (jccData as any)?.data || null,
      alerts: [] as any[],
      complianceScore: calculateComplianceScore((vatData as any)?.data, (policeData as any)?.data)
    };

    // Add alerts based on data
    if ((policeData as any)?.data?.alerts?.hasOverdue) {
      dashboard.alerts.push({
        type: 'warning',
        title: 'Overdue Police Registrations',
        message: `${(policeData as any).data.statistics.overdueRegistrations} guests have overdue police registrations`,
        action: 'review_police_registrations'
      });
    }

    if ((vatData as any)?.data?.complianceStatus) {
      const pendingQuarters = Object.entries((vatData as any).data.complianceStatus)
        .filter(([_, status]) => status === 'PENDING').length;

      if (pendingQuarters > 0) {
        dashboard.alerts.push({
          type: 'info',
          title: 'VAT Reports Pending',
          message: `${pendingQuarters} quarterly VAT reports need to be submitted`,
          action: 'review_vat_reports'
        });
      }
    }

    res.json({
      success: true,
      data: dashboard
    });

  } catch (error) {
    console.error('Cyprus Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Cyprus dashboard data'
    });
  }
});

// Cyprus health check
router.get('/health', async (_req, res) => {
  const healthStatus = {
    timestamp: new Date().toISOString(),
    services: {
      vat: { status: 'operational', lastCheck: new Date().toISOString() },
      police: { status: 'operational', lastCheck: new Date().toISOString() },
      sms: {
        status: process.env.PRIMETEL_API_KEY ? 'operational' : 'degraded',
        providers: {
          primetel: !!process.env.PRIMETEL_API_KEY,
          mtn: !!process.env.MTN_API_KEY
        }
      },
      jcc: {
        status: process.env.JCC_MERCHANT_ID ? 'operational' : 'disabled',
        enabled: !!process.env.JCC_MERCHANT_ID
      }
    },
    compliance: {
      vatEnabled: true,
      policeEnabled: true,
      jccEnabled: !!process.env.JCC_MERCHANT_ID
    }
  };

  const overallStatus = Object.values(healthStatus.services)
    .every(service => service.status === 'operational') ? 'healthy' : 'degraded';

  res.json({
    status: overallStatus,
    ...healthStatus
  });
});

// Utility functions
function getNextVATDueDate(): string {
  const now = new Date();
  const currentQuarter = Math.ceil((now.getMonth() + 1) / 3);
  const currentYear = now.getFullYear();

  // VAT reports are due at the end of the month following each quarter
  const dueMonth = currentQuarter * 3; // March, June, September, December
  let dueYear = currentYear;

  // If we're past the due date for current quarter, calculate next quarter
  if (now.getMonth() >= dueMonth) {
    if (currentQuarter === 4) {
      dueYear = currentYear + 1;
    }
  }

  const nextQuarter = currentQuarter === 4 ? 1 : currentQuarter + 1;
  const nextDueMonth = nextQuarter * 3;

  return new Date(dueYear, nextDueMonth, 0).toISOString(); // Last day of due month
}

function calculateComplianceScore(vatData: any, policeData: any): number {
  let score = 100;
  let deductions = 0;

  // VAT compliance (40% of score)
  if (vatData?.complianceStatus) {
    const pendingQuarters = Object.values(vatData.complianceStatus)
      .filter((status: any) => status === 'PENDING').length;
    deductions += pendingQuarters * 10; // 10 points per pending quarter
  }

  // Police compliance (40% of score)
  if (policeData?.statistics) {
    const { overdueRegistrations, pendingRegistrations } = policeData.statistics;
    if (overdueRegistrations > 0) {
      deductions += Math.min(overdueRegistrations * 5, 30); // Max 30 points deduction
    }
    if (pendingRegistrations > 5) {
      deductions += 10; // Additional deduction for many pending
    }
  }

  // SMS/Communication compliance (20% of score)
  // No major deductions for SMS as it's not legally required

  return Math.max(0, score - deductions);
}

export default router;