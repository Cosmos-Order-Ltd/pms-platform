const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3019;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433'),
  database: process.env.DB_NAME || 'pms_production',
  user: process.env.DB_USER || 'pms',
  password: process.env.DB_PASSWORD || 'S5VbL7nEJsrIgqWj2Vd91Sidq3tIvSGKnw5Fa0QBhmU=',
  max: 20,
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Tenant Onboarding Service',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

/**
 * POST /api/onboard
 * Complete tenant onboarding with automatic setup
 */
app.post('/api/onboard', async (req, res) => {
  try {
    const {
      companyName,
      contactEmail,
      contactPhone,
      cyprusVatNumber,
      propertyName,
      propertyAddress,
      propertyLicense,
      propertyCapacity,
      subscriptionTier = 'professional'
    } = req.body;

    // Validate required fields
    if (!companyName || !contactEmail || !propertyName) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_REQUIRED_FIELDS',
        message: 'Company name, contact email, and property name are required'
      });
    }

    // Generate tenant ID
    const tenantId = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_+|_+$/g, '')
      .substring(0, 20) + '_' + Date.now().toString().slice(-6);

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Create tenant record
      const tenantResult = await client.query(`
        INSERT INTO tenants (
          tenant_id, company_name, schema_name, subscription_tier,
          contact_email, contact_phone, cyprus_vat_number,
          max_properties, max_bookings_per_month, max_api_calls_per_day
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [
        tenantId,
        companyName,
        `tenant_${tenantId}`,
        subscriptionTier,
        contactEmail,
        contactPhone,
        cyprusVatNumber,
        subscriptionTier === 'basic' ? 1 : subscriptionTier === 'professional' ? 5 : 50,
        subscriptionTier === 'basic' ? 100 : subscriptionTier === 'professional' ? 1000 : 10000,
        subscriptionTier === 'basic' ? 1000 : subscriptionTier === 'professional' ? 10000 : 100000
      ]);

      // 2. Create tenant schema
      await client.query('SELECT create_tenant_schema($1)', [tenantId]);

      // 3. Add first property to tenant's schema
      await client.query(`
        INSERT INTO tenant_${tenantId}.properties (
          name, address, license_number, capacity, property_type
        ) VALUES ($1, $2, $3, $4, 'hotel')
      `, [propertyName, propertyAddress, propertyLicense, propertyCapacity || 10]);

      await client.query('COMMIT');

      // 4. Create billing subscription
      const subscriptionResponse = await fetch('http://localhost:3018/api/subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          tier: subscriptionTier,
          billingPeriod: 'monthly',
          customerInfo: { email: contactEmail }
        })
      });

      const subscriptionData = await subscriptionResponse.json().catch(() => ({}));

      // 5. Generate onboarding checklist
      const onboardingSteps = [
        {
          step: 'account_created',
          title: 'Account Created',
          completed: true,
          description: 'Your PMS account has been successfully created'
        },
        {
          step: 'property_added',
          title: 'Property Added',
          completed: true,
          description: `${propertyName} has been added to your account`
        },
        {
          step: 'cyprus_compliance',
          title: 'Cyprus Compliance Setup',
          completed: !!cyprusVatNumber,
          description: 'Configure Cyprus VAT number and police API credentials',
          action: cyprusVatNumber ? null : 'Add Cyprus VAT number in settings'
        },
        {
          step: 'payment_setup',
          title: 'Payment Method',
          completed: false,
          description: 'Add a payment method to activate your subscription',
          action: 'Add credit card or PayPal account'
        },
        {
          step: 'staff_training',
          title: 'Staff Training',
          completed: false,
          description: 'Train your staff on the PMS system',
          action: 'Schedule a training session'
        },
        {
          step: 'first_booking',
          title: 'First Booking',
          completed: false,
          description: 'Create your first booking to test the system',
          action: 'Add a test booking'
        }
      ];

      res.json({
        success: true,
        message: 'Tenant onboarded successfully!',
        data: {
          tenant: {
            tenantId,
            companyName,
            subscriptionTier,
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            accessUrls: {
              admin: `http://admin.pms.local?tenant=${tenantId}`,
              guest: `http://guest.pms.local?tenant=${tenantId}`,
              staff: `http://staff.pms.local?tenant=${tenantId}`,
              marketplace: `http://market.pms.local?tenant=${tenantId}`
            },
            apiAccess: {
              endpoint: `http://192.168.30.98:5000/api/v1`,
              headers: {
                'X-Tenant-ID': tenantId,
                'Content-Type': 'application/json'
              }
            }
          },
          subscription: subscriptionData.data || {},
          onboardingSteps,
          nextSteps: [
            'Add your payment method to activate the subscription',
            'Configure Cyprus compliance settings',
            'Invite your staff members',
            'Import existing guest data',
            'Start taking bookings!'
          ],
          supportContact: {
            email: 'support@cypruspms.com',
            phone: '+357-99-123456',
            hours: 'Monday-Friday 9AM-6PM CET'
          }
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({
      success: false,
      error: 'ONBOARDING_ERROR',
      message: 'Failed to complete onboarding. Please try again or contact support.'
    });
  }
});

/**
 * GET /api/onboarding-status/:tenantId
 * Get onboarding progress for a tenant
 */
app.get('/api/onboarding-status/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Get tenant info
    const tenantQuery = await pool.query(
      'SELECT * FROM tenants WHERE tenant_id = $1',
      [tenantId]
    );

    if (tenantQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'TENANT_NOT_FOUND',
        message: 'Tenant not found'
      });
    }

    const tenant = tenantQuery.rows[0];

    // Check various completion statuses
    const propertyCount = await pool.query(
      `SELECT COUNT(*) FROM tenant_${tenantId}.properties`
    ).then(r => parseInt(r.rows[0].count)).catch(() => 0);

    const bookingCount = await pool.query(
      `SELECT COUNT(*) FROM tenant_${tenantId}.bookings`
    ).then(r => parseInt(r.rows[0].count)).catch(() => 0);

    const hasPaymentMethod = !!tenant.stripe_customer_id;
    const hasCyprusCompliance = !!tenant.cyprus_vat_number;

    // Calculate progress
    const completedSteps = [
      true, // Account created
      propertyCount > 0, // Property added
      hasCyprusCompliance, // Cyprus compliance
      hasPaymentMethod, // Payment method
      false, // Staff training (manual)
      bookingCount > 0 // First booking
    ];

    const progress = Math.round((completedSteps.filter(Boolean).length / completedSteps.length) * 100);

    res.json({
      success: true,
      data: {
        tenantId,
        companyName: tenant.company_name,
        progress,
        completedSteps: completedSteps.filter(Boolean).length,
        totalSteps: completedSteps.length,
        isTrialActive: new Date(tenant.trial_ends_at) > new Date(),
        trialEndsAt: tenant.trial_ends_at,
        status: {
          accountCreated: true,
          propertyAdded: propertyCount > 0,
          cyprusCompliance: hasCyprusCompliance,
          paymentMethod: hasPaymentMethod,
          staffTraining: false,
          firstBooking: bookingCount > 0
        },
        stats: {
          properties: propertyCount,
          bookings: bookingCount,
          subscriptionTier: tenant.subscription_tier
        },
        recommendations: [
          !hasPaymentMethod && 'Add a payment method to avoid service interruption',
          !hasCyprusCompliance && 'Complete Cyprus compliance setup for legal requirements',
          propertyCount === 0 && 'Add your first property to start taking bookings',
          bookingCount === 0 && 'Create a test booking to familiarize yourself with the system'
        ].filter(Boolean)
      }
    });

  } catch (error) {
    console.error('Onboarding status error:', error);
    res.status(500).json({
      success: false,
      error: 'STATUS_ERROR',
      message: error.message
    });
  }
});

/**
 * POST /api/demo-data/:tenantId
 * Generate demo data for a tenant
 */
app.post('/api/demo-data/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Add demo guests
      const guests = [
        { first_name: 'John', last_name: 'Smith', email: 'john.smith@email.com', nationality: 'GBR', passport_number: 'AB123456' },
        { first_name: 'Maria', last_name: 'Garcia', email: 'maria.garcia@email.com', nationality: 'ESP', passport_number: 'ES789012' },
        { first_name: 'Hans', last_name: 'Mueller', email: 'hans.mueller@email.com', nationality: 'DEU', passport_number: 'DE345678' },
        { first_name: 'Sophie', last_name: 'Dubois', email: 'sophie.dubois@email.com', nationality: 'FRA', passport_number: 'FR901234' }
      ];

      for (const guest of guests) {
        await client.query(`
          INSERT INTO tenant_${tenantId}.guests (first_name, last_name, email, nationality, passport_number)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT DO NOTHING
        `, [guest.first_name, guest.last_name, guest.email, guest.nationality, guest.passport_number]);
      }

      // Add demo bookings
      const property = await client.query(`SELECT id FROM tenant_${tenantId}.properties LIMIT 1`);
      if (property.rows.length > 0) {
        const propertyId = property.rows[0].id;
        const guestIds = await client.query(`SELECT id FROM tenant_${tenantId}.guests LIMIT 4`);

        for (let i = 0; i < guestIds.rows.length; i++) {
          const checkIn = new Date();
          checkIn.setDate(checkIn.getDate() + (i * 7) + 1);
          const checkOut = new Date(checkIn);
          checkOut.setDate(checkOut.getDate() + 3);

          await client.query(`
            INSERT INTO tenant_${tenantId}.bookings (
              property_id, guest_id, check_in, check_out, room_number, total_amount, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT DO NOTHING
          `, [
            propertyId,
            guestIds.rows[i].id,
            checkIn.toISOString().split('T')[0],
            checkOut.toISOString().split('T')[0],
            `${100 + i}`,
            150 + (i * 50),
            i === 0 ? 'confirmed' : 'pending'
          ]);
        }
      }

      await client.query('COMMIT');

      res.json({
        success: true,
        message: 'Demo data created successfully',
        data: {
          guests: guests.length,
          bookings: guests.length,
          recommendations: [
            'Review the demo bookings in your admin panel',
            'Test the police registration for demo guests',
            'Generate invoices for the demo bookings',
            'Explore the analytics dashboard with demo data'
          ]
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Demo data error:', error);
    res.status(500).json({
      success: false,
      error: 'DEMO_DATA_ERROR',
      message: error.message
    });
  }
});

/**
 * GET /api/sales-dashboard
 * Sales and conversion metrics
 */
app.get('/api/sales-dashboard', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as signups_30d,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as signups_7d,
        COUNT(*) FILTER (WHERE subscription_status = 'active') as active_subscriptions,
        COUNT(*) FILTER (WHERE subscription_status = 'trial') as trial_accounts,
        COUNT(*) FILTER (WHERE subscription_status = 'trial' AND trial_ends_at < CURRENT_DATE) as expired_trials,
        AVG(
          CASE subscription_tier
            WHEN 'basic' THEN 199
            WHEN 'professional' THEN 499
            WHEN 'enterprise' THEN 1299
            ELSE 0
          END
        ) FILTER (WHERE subscription_status = 'active') as avg_revenue_per_user
      FROM tenants
    `);

    const conversionStats = await pool.query(`
      SELECT
        subscription_tier,
        COUNT(*) as count,
        COUNT(*) FILTER (WHERE subscription_status = 'active') as converted
      FROM tenants
      GROUP BY subscription_tier
    `);

    const recentSignups = await pool.query(`
      SELECT tenant_id, company_name, subscription_tier, created_at
      FROM tenants
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      ORDER BY created_at DESC
      LIMIT 10
    `);

    const tierBreakdown = {};
    let totalMRR = 0;

    conversionStats.rows.forEach(row => {
      const tierPricing = { basic: 199, professional: 499, enterprise: 1299 };
      tierBreakdown[row.subscription_tier] = {
        total: parseInt(row.count),
        converted: parseInt(row.converted),
        conversionRate: Math.round((parseInt(row.converted) / parseInt(row.count)) * 100),
        mrr: parseInt(row.converted) * tierPricing[row.subscription_tier]
      };
      totalMRR += tierBreakdown[row.subscription_tier].mrr;
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalMRR,
          signupsLast30Days: parseInt(stats.rows[0].signups_30d),
          signupsLast7Days: parseInt(stats.rows[0].signups_7d),
          activeSubscriptions: parseInt(stats.rows[0].active_subscriptions),
          trialAccounts: parseInt(stats.rows[0].trial_accounts),
          expiredTrials: parseInt(stats.rows[0].expired_trials),
          averageRevenuePerUser: Math.round(parseFloat(stats.rows[0].avg_revenue_per_user || 0))
        },
        tierBreakdown,
        recentSignups: recentSignups.rows.map(row => ({
          tenantId: row.tenant_id,
          companyName: row.company_name,
          tier: row.subscription_tier,
          signedUpAt: row.created_at
        })),
        projections: {
          annualRevenue: totalMRR * 12,
          quarterlyGrowthTarget: Math.round(totalMRR * 1.5),
          conversionOpportunity: parseInt(stats.rows[0].trial_accounts) * 499 // Avg conversion to professional
        }
      }
    });

  } catch (error) {
    console.error('Sales dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'DASHBOARD_ERROR',
      message: error.message
    });
  }
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Tenant Onboarding Error:', error);
  res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'ENDPOINT_NOT_FOUND',
    message: 'Onboarding endpoint not found',
    availableEndpoints: [
      'POST /api/onboard',
      'GET /api/onboarding-status/:tenantId',
      'POST /api/demo-data/:tenantId',
      'GET /api/sales-dashboard'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Tenant Onboarding Service running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🎯 Complete onboarding flow operational!`);
});

module.exports = app;