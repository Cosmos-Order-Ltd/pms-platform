# Cyprus Localization Service

A comprehensive localization and compliance service for the Cyprus market, providing VAT reporting, police guest registration, JCC payment integration, and SMS services.

## 🇨🇾 Cyprus-Specific Features

### VAT Compliance
- **9% Accommodation VAT** - Automatic calculation and reporting
- **TFA Integration** - Tax For All (Cyprus tax authority) reporting
- **Quarterly Reports** - Automated VAT report generation and submission

### Police Guest Registration
- **Mandatory Reporting** - Guest registration within 24 hours of arrival
- **Cyprus Police API** - Direct integration with authorities
- **Bulk Registration** - Process multiple guests simultaneously
- **Compliance Tracking** - Monitor registration status and deadlines

### JCC Payment Gateway
- **Local Payment Processing** - Cyprus-based JCC payment gateway
- **3D Secure** - Enhanced security for card transactions
- **Multi-Currency** - EUR, USD, GBP support
- **Real-time Processing** - Instant payment authorization and capture

### SMS Integration
- **Primetel Cyprus** - Local SMS provider integration
- **MTN Cyprus** - Alternative SMS provider
- **Delivery Receipts** - Track message delivery status
- **Bulk Messaging** - Send promotional and transactional messages

## 🚀 Quick Start

### Installation

```bash
npm install @pms/cyprus-localization
```

### Environment Setup

```env
# Cyprus VAT & TFA
TFA_API_URL=https://www.tfa.mof.gov.cy/api
TFA_API_KEY=your_tfa_api_key
TFA_ENABLED=true

# Police Registration
CYPRUS_POLICE_API=https://police.gov.cy/api
CYPRUS_POLICE_API_KEY=your_police_api_key
POLICE_REPORTING_ENABLED=true

# JCC Payment Gateway
JCC_API_URL=https://api.jcc.com.cy/v2
JCC_MERCHANT_ID=your_merchant_id
JCC_API_KEY=your_jcc_api_key
JCC_ENABLED=true

# SMS Providers
PRIMETEL_API_URL=https://api.primetel.com.cy/sms/v1
PRIMETEL_API_KEY=your_primetel_key
PRIMETEL_SENDER_ID=YourBrand

MTN_API_URL=https://api.mtn.com.cy/sms/v1
MTN_API_KEY=your_mtn_key
MTN_SENDER_ID=YourBrand
```

### Start Service

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 📊 API Endpoints

### VAT Management
```http
GET  /api/v1/vat/rate                    # Get current VAT rates
POST /api/v1/vat/calculate               # Calculate VAT for amount
POST /api/v1/vat/report                  # Submit VAT report to TFA
GET  /api/v1/vat/reports/:propertyId     # Get VAT reports
```

### Police Registration
```http
POST /api/v1/police/register             # Register guest with police
GET  /api/v1/police/status/:regId        # Check registration status
POST /api/v1/police/bulk-register        # Bulk register guests
GET  /api/v1/police/reports/:propertyId  # Get registration reports
```

### JCC Payments
```http
POST /api/v1/jcc/payment                 # Process payment
POST /api/v1/jcc/capture                 # Capture authorized payment
POST /api/v1/jcc/refund                  # Refund payment
GET  /api/v1/jcc/transaction/:txnId      # Get transaction status
GET  /api/v1/jcc/rates                   # Get processing rates
```

### SMS Services
```http
POST /api/v1/sms/send                    # Send SMS
POST /api/v1/sms/bulk-send               # Send bulk SMS
GET  /api/v1/sms/status/:messageId       # Check delivery status
GET  /api/v1/sms/providers               # List available providers
GET  /api/v1/sms/reports/:start/:end     # Usage reports
```

### Localization
```http
GET  /api/v1/localization/settings       # Cyprus settings
GET  /api/v1/localization/translations/:lang # Get translations
POST /api/v1/localization/format/currency    # Format currency
POST /api/v1/localization/format/date        # Format date
GET  /api/v1/localization/postal-codes       # Cyprus postal codes
GET  /api/v1/localization/bank-holidays      # Bank holidays
```

## 💡 Usage Examples

### VAT Calculation
```javascript
const response = await fetch('/api/v1/vat/calculate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 100.00,
    nights: 3,
    guests: 2
  })
})

const { calculation } = await response.json()
// calculation.vatAmount = 9.00 (9% of 100.00)
// calculation.totalAmount = 109.00
```

### Police Registration
```javascript
const registration = await fetch('/api/v1/police/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    guestId: 'guest-123',
    reservationId: 'res-456',
    propertyId: 'prop-789',
    passportNumber: 'GB123456789',
    nationality: 'UK',
    firstName: 'John',
    lastName: 'Doe',
    arrivalDate: '2024-10-15',
    departureDate: '2024-10-18',
    roomNumber: '101'
  })
})

const result = await registration.json()
// result.policeReference = 'REG-prop-789-101-2024-10-15'
```

### SMS Sending
```javascript
const sms = await fetch('/api/v1/sms/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '+35799123456',
    message: 'Your booking confirmation: RES-2024-001',
    provider: 'PRIMETEL',
    reservationId: 'res-456'
  })
})

const result = await sms.json()
// result.status = 'sent'
// result.cost = 0.024
```

## 🏛️ Cyprus Compliance

### Legal Requirements

1. **VAT Reporting**
   - Quarterly submission to Cyprus Tax Authority
   - 9% rate for accommodation services
   - TFA (Tax For All) system integration

2. **Police Registration**
   - All foreign guests must be registered within 24 hours
   - Required information: passport, nationality, dates, room
   - Digital submission to Cyprus Police system

3. **Payment Processing**
   - PCI DSS compliance for card processing
   - 3D Secure authentication required
   - Local acquiring through JCC preferred

### Regional Settings

- **Timezone**: Asia/Nicosia (UTC+2/+3)
- **Currency**: Euro (EUR)
- **Languages**: English, Greek, Russian, Hebrew
- **Date Format**: DD/MM/YYYY
- **Phone Format**: +357XXXXXXXX

## 🔧 Configuration

### Provider Settings

```typescript
const config = {
  cyprus: {
    timezone: 'Asia/Nicosia',
    currency: 'EUR',
    vatRate: 0.09,
    supportedLanguages: ['en', 'el', 'ru', 'he']
  },
  sms: {
    defaultProvider: 'PRIMETEL',
    costPerSMS: 0.024,
    maxLength: 160
  },
  jcc: {
    threeDSecure: true,
    supportedCards: ['VISA', 'MASTERCARD', 'MAESTRO', 'AMEX']
  }
}
```

## 🌍 Multi-Language Support

The service provides translations for:
- **English** (en) - Primary language
- **Greek** (el) - Official language
- **Russian** (ru) - Large expat community
- **Hebrew** (he) - Tourism market

## 📊 Monitoring & Analytics

### Health Checks
```http
GET /health
```

### Metrics Available
- VAT calculation requests
- Police registration submissions
- Payment processing volume
- SMS delivery rates
- API response times
- Error rates by endpoint

## 🛠️ Development

### Local Development

```bash
# Install dependencies
npm install

# Start in development mode
npm run dev

# Run tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

### Testing with Sandbox

All external services support sandbox/test modes:

```env
TFA_SANDBOX=true
JCC_SANDBOX=true
CYPRUS_POLICE_SANDBOX=true
```

## 🔒 Security

- **HTTPS Only** - All external API calls
- **API Key Management** - Secure credential storage
- **Rate Limiting** - Prevent abuse
- **Input Validation** - Joi schema validation
- **Error Handling** - No sensitive data in responses
- **Audit Logging** - All transactions logged

## 📄 License

ISC License - See LICENSE file for details.

## 🆘 Support

- Documentation: [Internal Wiki]
- Issues: [Gitea Issues](http://192.168.30.98:3000/charilaouc/pms-cyprus-localization/issues)
- Emergency: Cyprus Tax Authority +357 22 601601
- Police Support: +357 24 808060