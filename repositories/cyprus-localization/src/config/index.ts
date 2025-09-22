import dotenv from 'dotenv'

dotenv.config()

export const config = {
  // Server configuration
  port: parseInt(process.env.PORT || '3017'),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',

  // Cyprus-specific settings
  cyprus: {
    timezone: 'Asia/Nicosia',
    currency: 'EUR',
    vatRate: 0.09, // 9% VAT for accommodation
    policeReportingRequired: true,
    supportedLanguages: ['en', 'el', 'ru', 'he'],
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h'
  },

  // VAT & TFA (Tax For All) Integration
  tfa: {
    apiUrl: process.env.TFA_API_URL || 'https://www.tfa.mof.gov.cy/api',
    apiKey: process.env.TFA_API_KEY || '',
    enabled: process.env.TFA_ENABLED === 'true',
    sandboxMode: process.env.TFA_SANDBOX === 'true',
    reportingPeriod: 'quarterly' // quarterly reporting for accommodation
  },

  // Cyprus Police Registration
  police: {
    apiUrl: process.env.CYPRUS_POLICE_API || 'https://police.gov.cy/api',
    apiKey: process.env.CYPRUS_POLICE_API_KEY || '',
    enabled: process.env.POLICE_REPORTING_ENABLED === 'true',
    reportingDeadline: 24, // hours after check-in
    requiredFields: ['passportNumber', 'nationality', 'arrivalDate', 'roomNumber']
  },

  // JCC Payment Gateway
  jcc: {
    apiUrl: process.env.JCC_API_URL || 'https://api.jcc.com.cy/v2',
    merchantId: process.env.JCC_MERCHANT_ID || '',
    apiKey: process.env.JCC_API_KEY || '',
    enabled: process.env.JCC_ENABLED === 'true',
    sandboxMode: process.env.JCC_SANDBOX === 'true',
    supportedCards: ['VISA', 'MASTERCARD', 'MAESTRO', 'AMERICAN_EXPRESS'],
    threeDSecure: true,
    currency: 'EUR'
  },

  // SMS Providers (Cyprus)
  sms: {
    defaultProvider: process.env.SMS_DEFAULT_PROVIDER || 'PRIMETEL',
    primetel: {
      apiUrl: process.env.PRIMETEL_API_URL || 'https://api.primetel.com.cy/sms/v1',
      apiKey: process.env.PRIMETEL_API_KEY || '',
      senderId: process.env.PRIMETEL_SENDER_ID || 'PMS',
      enabled: process.env.PRIMETEL_ENABLED === 'true'
    },
    mtn: {
      apiUrl: process.env.MTN_API_URL || 'https://api.mtn.com.cy/sms/v1',
      apiKey: process.env.MTN_API_KEY || '',
      senderId: process.env.MTN_SENDER_ID || 'PMS',
      enabled: process.env.MTN_ENABLED === 'true'
    },
    costPerSMS: 0.024, // EUR - typical Cyprus SMS cost
    maxLength: 160
  },

  // Database connection
  database: {
    url: process.env.DATABASE_URL || 'sqlite:./cyprus.db'
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json'
  },

  // Security
  security: {
    jwtSecret: process.env.JWT_SECRET || 'cyprus-localization-secret',
    bcryptRounds: 12,
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000 // 15 minutes
  }
}

// Validation
const requiredEnvVars = [
  'TFA_API_KEY',
  'CYPRUS_POLICE_API_KEY',
  'JCC_MERCHANT_ID',
  'JCC_API_KEY',
  'PRIMETEL_API_KEY'
]

const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

if (missingVars.length > 0 && config.nodeEnv === 'production') {
  console.error('❌ Missing required environment variables:', missingVars.join(', '))
  process.exit(1)
}

export default config