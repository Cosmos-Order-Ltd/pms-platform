import express from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import { logger } from '../utils/logger'
import { config } from '../config'

const router = express.Router()

// GET /api/v1/localization/settings - Get Cyprus localization settings
router.get('/settings', asyncHandler(async (req, res) => {
  res.json({
    country: 'Cyprus',
    countryCode: 'CY',
    region: 'Europe',
    timezone: config.cyprus.timezone,
    currency: config.cyprus.currency,
    languages: {
      primary: 'en',
      supported: config.cyprus.supportedLanguages,
      official: ['el', 'tr'] // Greek and Turkish are official languages
    },
    formats: {
      date: config.cyprus.dateFormat,
      time: config.cyprus.timeFormat,
      number: {
        decimal: ',',
        thousand: '.',
        currency: {
          symbol: '€',
          position: 'after',
          format: '#.##0,00 €'
        }
      }
    },
    compliance: {
      vatRate: config.cyprus.vatRate,
      vatReportingPeriod: 'quarterly',
      policeReportingRequired: config.cyprus.policeReportingRequired,
      policeReportingDeadline: '24 hours after arrival'
    },
    contact: {
      emergencyNumber: '112',
      policeNumber: '199',
      touristPolice: '+357 24 808060',
      taxAuthority: '+357 22 601601'
    }
  })
}))

// GET /api/v1/localization/translations/:language - Get translations for language
router.get('/translations/:language', asyncHandler(async (req, res) => {
  const { language } = req.params

  if (!config.cyprus.supportedLanguages.includes(language)) {
    return res.status(400).json({
      error: `Language '${language}' not supported`,
      supportedLanguages: config.cyprus.supportedLanguages
    })
  }

  logger.info('Translation Request', { language })

  // TODO: Load actual translations from database or files
  const translations = getTranslations(language)

  res.json({
    language,
    translations,
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-09-01T00:00:00Z',
      completeness: '95%',
      totalKeys: Object.keys(translations).length
    }
  })
}))

// POST /api/v1/localization/format/currency - Format currency for Cyprus
router.post('/format/currency', asyncHandler(async (req, res) => {
  const { amount, currency = 'EUR', language = 'en' } = req.body

  if (!amount && amount !== 0) {
    return res.status(400).json({
      error: 'Amount is required'
    })
  }

  const numAmount = parseFloat(amount)
  if (isNaN(numAmount)) {
    return res.status(400).json({
      error: 'Invalid amount - must be a number'
    })
  }

  const formatted = formatCurrency(numAmount, currency, language)

  res.json({
    original: numAmount,
    currency,
    language,
    formatted,
    format: {
      decimal: ',',
      thousand: '.',
      symbol: '€',
      position: 'after'
    }
  })
}))

// POST /api/v1/localization/format/date - Format date for Cyprus
router.post('/format/date', asyncHandler(async (req, res) => {
  const { date, format = config.cyprus.dateFormat, language = 'en' } = req.body

  if (!date) {
    return res.status(400).json({
      error: 'Date is required'
    })
  }

  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) {
    return res.status(400).json({
      error: 'Invalid date format'
    })
  }

  const formatted = formatDate(dateObj, format, language)

  res.json({
    original: date,
    timezone: config.cyprus.timezone,
    language,
    format,
    formatted,
    dayOfWeek: getDayOfWeek(dateObj, language),
    month: getMonth(dateObj, language)
  })
}))

// GET /api/v1/localization/postal-codes - Get Cyprus postal code information
router.get('/postal-codes', asyncHandler(async (req, res) => {
  const { city } = req.query

  // Cyprus postal codes by major cities
  const postalCodes = {
    'Nicosia': ['1000-1999', '2000-2999'],
    'Limassol': ['3000-3999', '4000-4999'],
    'Larnaca': ['6000-6999', '7000-7999'],
    'Paphos': ['8000-8999'],
    'Famagusta': ['5000-5999'],
    'Kyrenia': ['0000-0999'] // Northern Cyprus
  }

  if (city) {
    const cityData = postalCodes[city as string]
    if (!cityData) {
      return res.status(404).json({
        error: `Postal codes for '${city}' not found`,
        availableCities: Object.keys(postalCodes)
      })
    }

    return res.json({
      city,
      postalCodes: cityData,
      format: '4 digits (0000-9999)'
    })
  }

  res.json({
    country: 'Cyprus',
    format: '4 digits (0000-9999)',
    cities: postalCodes,
    note: 'Postal codes in Northern Cyprus may differ due to political situation'
  })
}))

// GET /api/v1/localization/bank-holidays - Get Cyprus bank holidays
router.get('/bank-holidays', asyncHandler(async (req, res) => {
  const { year = new Date().getFullYear() } = req.query

  const holidays = getCyprusBankHolidays(parseInt(year as string))

  res.json({
    country: 'Cyprus',
    year: parseInt(year as string),
    holidays,
    note: 'Dates are based on Greek Orthodox calendar for religious holidays',
    totalDays: holidays.length
  })
}))

// Helper functions
function getTranslations(language: string) {
  const translations: Record<string, any> = {
    en: {
      'common.welcome': 'Welcome',
      'common.hello': 'Hello',
      'common.goodbye': 'Goodbye',
      'common.thank_you': 'Thank you',
      'common.yes': 'Yes',
      'common.no': 'No',
      'hotel.check_in': 'Check-in',
      'hotel.check_out': 'Check-out',
      'hotel.reservation': 'Reservation',
      'hotel.guest': 'Guest',
      'hotel.room': 'Room',
      'payment.total': 'Total',
      'payment.vat': 'VAT (9%)',
      'payment.receipt': 'Receipt'
    },
    el: {
      'common.welcome': 'Καλώς ήρθατε',
      'common.hello': 'Γεια σας',
      'common.goodbye': 'Αντίο',
      'common.thank_you': 'Ευχαριστώ',
      'common.yes': 'Ναι',
      'common.no': 'Όχι',
      'hotel.check_in': 'Άφιξη',
      'hotel.check_out': 'Αναχώρηση',
      'hotel.reservation': 'Κράτηση',
      'hotel.guest': 'Επισκέπτης',
      'hotel.room': 'Δωμάτιο',
      'payment.total': 'Σύνολο',
      'payment.vat': 'ΦΠΑ (9%)',
      'payment.receipt': 'Απόδειξη'
    },
    ru: {
      'common.welcome': 'Добро пожаловать',
      'common.hello': 'Здравствуйте',
      'common.goodbye': 'До свидания',
      'common.thank_you': 'Спасибо',
      'common.yes': 'Да',
      'common.no': 'Нет',
      'hotel.check_in': 'Заселение',
      'hotel.check_out': 'Выселение',
      'hotel.reservation': 'Бронирование',
      'hotel.guest': 'Гость',
      'hotel.room': 'Номер',
      'payment.total': 'Итого',
      'payment.vat': 'НДС (9%)',
      'payment.receipt': 'Квитанция'
    }
  }

  return translations[language] || translations.en
}

function formatCurrency(amount: number, currency: string, language: string): string {
  // Cyprus uses comma as decimal separator and period as thousand separator
  const formatted = amount.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${formatted} ${currency === 'EUR' ? '€' : currency}`
}

function formatDate(date: Date, format: string, language: string): string {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()

  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`
    default:
      return `${day}/${month}/${year}`
  }
}

function getDayOfWeek(date: Date, language: string): string {
  const days = {
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    el: ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'],
    ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
  }

  const dayNames = days[language as keyof typeof days] || days.en
  return dayNames[date.getDay()]
}

function getMonth(date: Date, language: string): string {
  const months = {
    en: ['January', 'February', 'March', 'April', 'May', 'June',
         'July', 'August', 'September', 'October', 'November', 'December'],
    el: ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος',
         'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'],
    ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
         'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
  }

  const monthNames = months[language as keyof typeof months] || months.en
  return monthNames[date.getMonth()]
}

function getCyprusBankHolidays(year: number) {
  return [
    { date: `${year}-01-01`, name: 'New Year\'s Day', type: 'public' },
    { date: `${year}-01-06`, name: 'Epiphany', type: 'public' },
    { date: `${year}-03-25`, name: 'Greek Independence Day', type: 'public' },
    { date: `${year}-04-01`, name: 'Cyprus National Day', type: 'public' },
    { date: `${year}-05-01`, name: 'Labour Day', type: 'public' },
    { date: `${year}-08-15`, name: 'Assumption of Mary', type: 'public' },
    { date: `${year}-10-01`, name: 'Cyprus Independence Day', type: 'public' },
    { date: `${year}-10-28`, name: 'Greek National Day', type: 'public' },
    { date: `${year}-12-25`, name: 'Christmas Day', type: 'public' },
    { date: `${year}-12-26`, name: 'Boxing Day', type: 'public' }
  ]
}

export default router