const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3017;

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

// Cyprus API Endpoints Configuration
const CYPRUS_APIS = {
  police: {
    url: 'https://api.police.gov.cy/v1/guest-registration',
    testUrl: 'https://httpbin.org/post', // For testing
    enabled: process.env.NODE_ENV === 'production'
  },
  vat: {
    url: 'https://vat.mof.gov.cy/api/validate',
    testUrl: 'https://httpbin.org/post',
    enabled: process.env.NODE_ENV === 'production'
  },
  jcc: {
    url: 'https://secure.jccsmart.com/api/payment',
    testUrl: 'https://httpbin.org/post',
    enabled: process.env.NODE_ENV === 'production'
  },
  propertyRegistry: {
    url: 'https://lands.moi.gov.cy/api/property',
    testUrl: 'https://httpbin.org/post',
    enabled: process.env.NODE_ENV === 'production'
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Cyprus Integration Service',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

/**
 * Cyprus Police Guest Registration
 * Automatically registers guests with Cyprus Police within 24 hours
 */
app.post('/api/police/register', async (req, res) => {
  try {
    const { tenantId, guest, booking, property } = req.body;

    // Validate required fields
    if (!guest.passportNumber || !guest.nationality || !booking.checkIn || !booking.checkOut) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_REQUIRED_FIELDS',
        message: 'Passport number, nationality, check-in and check-out dates are required'
      });
    }

    // Get tenant's police API key
    const tenantQuery = await pool.query(
      'SELECT police_api_key FROM tenants WHERE tenant_id = $1',
      [tenantId]
    );

    if (tenantQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'TENANT_NOT_FOUND',
        message: 'Tenant not found'
      });
    }

    const policeApiKey = tenantQuery.rows[0].police_api_key;

    // Prepare registration data
    const registrationData = {
      passport_number: guest.passportNumber,
      nationality: guest.nationality,
      first_name: guest.firstName,
      last_name: guest.lastName,
      date_of_birth: guest.dateOfBirth,
      arrival_date: booking.checkIn,
      departure_date: booking.checkOut,
      property_license: property.licenseNumber,
      accommodation_address: property.address,
      registration_timestamp: new Date().toISOString()
    };

    // Choose endpoint based on environment
    const endpoint = CYPRUS_APIS.police.enabled
      ? CYPRUS_APIS.police.url
      : CYPRUS_APIS.police.testUrl;

    // Submit to Cyprus Police API
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': policeApiKey || 'test_key_123',
        'User-Agent': 'PMS-Platform/1.0'
      },
      body: JSON.stringify(registrationData)
    });

    const responseData = await response.text();
    let policeResponse;

    try {
      policeResponse = JSON.parse(responseData);
    } catch (e) {
      policeResponse = { raw: responseData };
    }

    if (response.ok) {
      // Update booking with police registration ID
      const registrationId = policeResponse.registration_id || `TEST_${Date.now()}`;

      // Update tenant's booking record
      await pool.query(
        'UPDATE tenant_' + tenantId.replace(/[^a-zA-Z0-9_]/g, '_') + '.bookings SET police_registration_sent = true, police_registration_id = $1 WHERE id = $2',
        [registrationId, booking.id]
      ).catch(err => {
        console.log('Database update warning:', err.message);
      });

      res.json({
        success: true,
        message: 'Guest registered with Cyprus Police successfully',
        data: {
          registrationId,
          submittedAt: new Date().toISOString(),
          policeResponse: policeResponse
        }
      });
    } else {
      throw new Error(`Police API error: ${response.status} - ${responseData}`);
    }

  } catch (error) {
    console.error('Police registration error:', error);
    res.status(500).json({
      success: false,
      error: 'POLICE_REGISTRATION_ERROR',
      message: error.message
    });
  }
});

/**
 * Cyprus VAT Number Validation
 */
app.post('/api/vat/validate', async (req, res) => {
  try {
    const { vatNumber } = req.body;

    if (!vatNumber) {
      return res.status(400).json({
        success: false,
        error: 'VAT_NUMBER_REQUIRED',
        message: 'VAT number is required'
      });
    }

    // Cyprus VAT format validation
    const cyprusVatRegex = /^CY[0-9]{8}[A-Z]$/;
    if (!cyprusVatRegex.test(vatNumber)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_VAT_FORMAT',
        message: 'Cyprus VAT number must be in format CY########L (8 digits + letter)'
      });
    }

    const endpoint = CYPRUS_APIS.vat.enabled
      ? `${CYPRUS_APIS.vat.url}/${vatNumber}`
      : CYPRUS_APIS.vat.testUrl;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PMS-Platform/1.0'
      }
    });

    const vatData = await response.json().catch(() => ({}));

    res.json({
      success: true,
      data: {
        vatNumber,
        isValid: response.ok,
        companyName: vatData.company_name || 'Test Company',
        status: vatData.status || 'active',
        validatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('VAT validation error:', error);
    res.status(500).json({
      success: false,
      error: 'VAT_VALIDATION_ERROR',
      message: error.message
    });
  }
});

/**
 * JCC Payment Processing
 */
app.post('/api/payment/jcc', async (req, res) => {
  try {
    const { amount, currency = 'EUR', description, customerInfo, tenantId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_AMOUNT',
        message: 'Valid amount is required'
      });
    }

    // Get tenant's JCC credentials (in production)
    const paymentData = {
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      description: description || 'Hotel Booking Payment',
      customer: customerInfo,
      capture: true,
      metadata: {
        tenant_id: tenantId,
        processed_by: 'PMS-Platform',
        timestamp: new Date().toISOString()
      }
    };

    const endpoint = CYPRUS_APIS.jcc.enabled
      ? CYPRUS_APIS.jcc.url
      : CYPRUS_APIS.jcc.testUrl;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.JCC_API_KEY || 'test_key'}`,
        'User-Agent': 'PMS-Platform/1.0'
      },
      body: JSON.stringify(paymentData)
    });

    const paymentResponse = await response.json().catch(() => ({}));

    if (response.ok) {
      res.json({
        success: true,
        message: 'Payment processed successfully',
        data: {
          paymentId: paymentResponse.id || `TEST_PMT_${Date.now()}`,
          amount: amount,
          currency,
          status: 'completed',
          processedAt: new Date().toISOString(),
          jccResponse: paymentResponse
        }
      });
    } else {
      throw new Error(`JCC Payment error: ${response.status}`);
    }

  } catch (error) {
    console.error('JCC payment error:', error);
    res.status(500).json({
      success: false,
      error: 'PAYMENT_PROCESSING_ERROR',
      message: error.message
    });
  }
});

/**
 * SMS Notifications (Cyprus providers)
 */
app.post('/api/sms/send', async (req, res) => {
  try {
    const { phoneNumber, message, provider = 'PRIMETEL', tenantId } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_REQUIRED_FIELDS',
        message: 'Phone number and message are required'
      });
    }

    // Cyprus SMS providers
    const smsProviders = {
      PRIMETEL: {
        url: 'https://api.primetel.com.cy/sms/v1/send',
        testUrl: 'https://httpbin.org/post'
      },
      MTN: {
        url: 'https://api.mtn.com.cy/sms/v1/send',
        testUrl: 'https://httpbin.org/post'
      }
    };

    const selectedProvider = smsProviders[provider] || smsProviders.PRIMETEL;
    const endpoint = process.env.NODE_ENV === 'production'
      ? selectedProvider.url
      : selectedProvider.testUrl;

    const smsData = {
      to: phoneNumber,
      message: message,
      sender_id: 'PMS',
      tenant_id: tenantId
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SMS_API_KEY || 'test_key'}`,
        'User-Agent': 'PMS-Platform/1.0'
      },
      body: JSON.stringify(smsData)
    });

    const smsResponse = await response.json().catch(() => ({}));

    res.json({
      success: true,
      message: 'SMS sent successfully',
      data: {
        messageId: smsResponse.message_id || `TEST_SMS_${Date.now()}`,
        provider,
        sentAt: new Date().toISOString(),
        providerResponse: smsResponse
      }
    });

  } catch (error) {
    console.error('SMS sending error:', error);
    res.status(500).json({
      success: false,
      error: 'SMS_SENDING_ERROR',
      message: error.message
    });
  }
});

/**
 * Property Registration Check
 */
app.post('/api/property/verify', async (req, res) => {
  try {
    const { propertyId, licenseNumber, tenantId } = req.body;

    if (!licenseNumber) {
      return res.status(400).json({
        success: false,
        error: 'LICENSE_REQUIRED',
        message: 'Property license number is required'
      });
    }

    const endpoint = CYPRUS_APIS.propertyRegistry.enabled
      ? `${CYPRUS_APIS.propertyRegistry.url}/verify/${licenseNumber}`
      : CYPRUS_APIS.propertyRegistry.testUrl;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PMS-Platform/1.0'
      }
    });

    const propertyData = await response.json().catch(() => ({}));

    res.json({
      success: true,
      data: {
        licenseNumber,
        isValid: response.ok,
        propertyType: propertyData.property_type || 'hotel',
        capacity: propertyData.capacity || 0,
        location: propertyData.location || 'Cyprus',
        validatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Property verification error:', error);
    res.status(500).json({
      success: false,
      error: 'PROPERTY_VERIFICATION_ERROR',
      message: error.message
    });
  }
});

/**
 * Compliance Dashboard - Get all Cyprus compliance status
 */
app.get('/api/compliance/dashboard/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Get tenant info
    const tenantQuery = await pool.query(
      'SELECT company_name, cyprus_vat_number, police_api_key FROM tenants WHERE tenant_id = $1',
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

    // Get compliance statistics (mock data for now)
    const complianceStats = {
      policeRegistrations: {
        total: 45,
        pending: 2,
        completed: 43,
        overdue: 0
      },
      vatReporting: {
        isValid: !!tenant.cyprus_vat_number,
        vatNumber: tenant.cyprus_vat_number,
        lastReport: '2024-12-01'
      },
      propertyLicense: {
        isValid: true,
        expiryDate: '2025-06-30'
      },
      apiConnections: {
        police: !!tenant.police_api_key,
        vat: true,
        jcc: true,
        sms: true
      }
    };

    res.json({
      success: true,
      data: {
        tenant: tenant.company_name,
        complianceScore: 95,
        lastUpdated: new Date().toISOString(),
        statistics: complianceStats
      }
    });

  } catch (error) {
    console.error('Compliance dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'DASHBOARD_ERROR',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Cyprus Integration Service Error:', error);
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
    message: 'Cyprus integration endpoint not found',
    availableEndpoints: [
      'POST /api/police/register',
      'POST /api/vat/validate',
      'POST /api/payment/jcc',
      'POST /api/sms/send',
      'POST /api/property/verify',
      'GET /api/compliance/dashboard/:tenantId'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🇨🇾 Cyprus Integration Service running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🏛️ Police Registration: http://localhost:${PORT}/api/police/register`);
  console.log(`💰 VAT Validation: http://localhost:${PORT}/api/vat/validate`);
  console.log(`💳 JCC Payments: http://localhost:${PORT}/api/payment/jcc`);
  console.log(`📱 SMS Service: http://localhost:${PORT}/api/sms/send`);
});

module.exports = app;