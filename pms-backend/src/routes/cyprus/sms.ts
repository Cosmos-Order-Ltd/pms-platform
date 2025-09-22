import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// SMS Provider Configuration
const SMS_CONFIG = {
  primetel: {
    apiUrl: process.env.PRIMETEL_API_URL || 'https://api.primetel.com.cy/sms/v1',
    apiKey: process.env.PRIMETEL_API_KEY,
    senderId: process.env.PRIMETEL_SENDER_ID || 'PMS',
    costPerSms: 0.024 // EUR
  },
  mtn: {
    apiUrl: process.env.MTN_API_URL || 'https://api.mtn.com.cy/sms/v1',
    apiKey: process.env.MTN_API_KEY,
    senderId: process.env.MTN_SENDER_ID || 'PMS',
    costPerSms: 0.025 // EUR
  }
};

// Validation schemas
const sendSmsSchema = z.object({
  phoneNumber: z.string().regex(/^\+357\d{8}$/, 'Must be a valid Cyprus phone number (+357XXXXXXXX)'),
  message: z.string().min(1).max(160),
  provider: z.enum(['PRIMETEL', 'MTN_CYPRUS']).optional(),
  reservationId: z.string().cuid().optional(),
  guestId: z.string().cuid().optional(),
  scheduled: z.string().datetime().optional()
});

const bulkSmsSchema = z.object({
  messages: z.array(sendSmsSchema).min(1).max(100),
  provider: z.enum(['PRIMETEL', 'MTN_CYPRUS']).optional()
});

const smsTemplateSchema = z.object({
  name: z.string().min(1),
  content: z.string().min(1).max(160),
  variables: z.array(z.string()).optional(),
  language: z.enum(['en', 'el', 'he', 'ru']).default('en')
});

// SMS Service Implementation
class CyprusSMSService {
  /**
   * Send SMS via PrimeTel
   */
  static async sendViaPrimeTel(phoneNumber: string, message: string): Promise<{
    success: boolean;
    providerRef?: string;
    cost?: number;
    errorMessage?: string;
  }> {
    try {
      const response = await fetch(`${SMS_CONFIG.primetel.apiUrl}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SMS_CONFIG.primetel.apiKey}`,
          'X-Sender-ID': SMS_CONFIG.primetel.senderId
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: message,
          from: SMS_CONFIG.primetel.senderId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'PrimeTel API error');
      }

      const result = await response.json();

      return {
        success: true,
        providerRef: result.message_id,
        cost: SMS_CONFIG.primetel.costPerSms
      };

    } catch (error) {
      console.error('PrimeTel SMS Error:', error);
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'PrimeTel send failed'
      };
    }
  }

  /**
   * Send SMS via MTN Cyprus
   */
  static async sendViaMTN(phoneNumber: string, message: string): Promise<{
    success: boolean;
    providerRef?: string;
    cost?: number;
    errorMessage?: string;
  }> {
    try {
      const response = await fetch(`${SMS_CONFIG.mtn.apiUrl}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SMS_CONFIG.mtn.apiKey}`,
          'X-Sender-ID': SMS_CONFIG.mtn.senderId
        },
        body: JSON.stringify({
          recipient: phoneNumber,
          text: message,
          sender: SMS_CONFIG.mtn.senderId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'MTN API error');
      }

      const result = await response.json();

      return {
        success: true,
        providerRef: result.reference,
        cost: SMS_CONFIG.mtn.costPerSms
      };

    } catch (error) {
      console.error('MTN SMS Error:', error);
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'MTN send failed'
      };
    }
  }

  /**
   * Choose optimal provider based on reliability and cost
   */
  static async sendSMS(phoneNumber: string, message: string, preferredProvider?: string): Promise<{
    success: boolean;
    provider: string;
    providerRef?: string;
    cost?: number;
    errorMessage?: string;
  }> {
    // Try preferred provider first
    if (preferredProvider === 'PRIMETEL') {
      const result = await this.sendViaPrimeTel(phoneNumber, message);
      return { ...result, provider: 'PRIMETEL' };
    }

    if (preferredProvider === 'MTN_CYPRUS') {
      const result = await this.sendViaMTN(phoneNumber, message);
      return { ...result, provider: 'MTN_CYPRUS' };
    }

    // Auto-select provider (PrimeTel first as it's typically more reliable)
    let result = await this.sendViaPrimeTel(phoneNumber, message);
    if (result.success) {
      return { ...result, provider: 'PRIMETEL' };
    }

    // Fallback to MTN
    result = await this.sendViaMTN(phoneNumber, message);
    return { ...result, provider: 'MTN_CYPRUS' };
  }

  /**
   * Format Cyprus phone number
   */
  static formatCyprusNumber(phoneNumber: string): string {
    // Remove any spaces, dashes, or other characters
    let cleaned = phoneNumber.replace(/[^\d+]/g, '');

    // If it starts with 357, add the +
    if (cleaned.startsWith('357')) {
      cleaned = '+' + cleaned;
    }

    // If it doesn't start with +357, assume it's a local number
    if (!cleaned.startsWith('+357')) {
      cleaned = '+357' + cleaned;
    }

    return cleaned;
  }

  /**
   * Validate Cyprus phone number
   */
  static isValidCyprusNumber(phoneNumber: string): boolean {
    const formatted = this.formatCyprusNumber(phoneNumber);
    return /^\+357\d{8}$/.test(formatted);
  }

  /**
   * Get SMS templates by language
   */
  static getTemplates(language: string = 'en'): Record<string, string> {
    const templates: Record<string, Record<string, string>> = {
      en: {
        booking_confirmation: 'Your booking #{reservationNumber} is confirmed. Check-in: {checkIn} at {propertyName}. Thank you!',
        check_in_reminder: 'Reminder: Your check-in is today at {checkInTime}. Room {roomNumber} is ready. Welcome to {propertyName}!',
        check_out_reminder: 'Check-out reminder: Please vacate room {roomNumber} by {checkOutTime}. Thank you for staying with us!',
        payment_reminder: 'Payment reminder: Outstanding amount of €{amount} for booking #{reservationNumber}. Please settle before check-in.',
        welcome_message: 'Welcome to {propertyName}! WiFi: {wifiPassword}. Reception: {receptionPhone}. Enjoy your stay!',
        late_checkout: 'Late checkout approved until {newCheckOutTime} for room {roomNumber}. Additional charges may apply.',
        cancellation: 'Your booking #{reservationNumber} has been cancelled. Refund will be processed within 3-5 business days.'
      },
      el: {
        booking_confirmation: 'Η κράτησή σας #{reservationNumber} επιβεβαιώθηκε. Check-in: {checkIn} στο {propertyName}. Ευχαριστούμε!',
        check_in_reminder: 'Υπενθύμιση: Το check-in σας είναι σήμερα στις {checkInTime}. Δωμάτιο {roomNumber} είναι έτοιμο. Καλώς ήρθατε στο {propertyName}!',
        check_out_reminder: 'Υπενθύμιση check-out: Παρακαλώ εκκενώστε το δωμάτιο {roomNumber} μέχρι {checkOutTime}. Ευχαριστούμε που μείνατε μαζί μας!',
        payment_reminder: 'Υπενθύμιση πληρωμής: Εκκρεμεί ποσό €{amount} για κράτηση #{reservationNumber}. Παρακαλώ τακτοποιήστε πριν το check-in.',
        welcome_message: 'Καλώς ήρθατε στο {propertyName}! WiFi: {wifiPassword}. Ρεσεψιόν: {receptionPhone}. Καλή διαμονή!',
        late_checkout: 'Αργό check-out εγκρίθηκε μέχρι {newCheckOutTime} για δωμάτιο {roomNumber}. Ενδέχεται επιπλέον χρεώσεις.',
        cancellation: 'Η κράτησή σας #{reservationNumber} ακυρώθηκε. Η επιστροφή χρημάτων θα γίνει εντός 3-5 εργάσιμων ημερών.'
      },
      he: {
        booking_confirmation: 'ההזמנה שלך #{reservationNumber} אושרה. צ\'ק-אין: {checkIn} ב{propertyName}. תודה!',
        check_in_reminder: 'תזכורת: הצ\'ק-אין שלך היום ב{checkInTime}. חדר {roomNumber} מוכן. ברוכים הבאים ל{propertyName}!',
        check_out_reminder: 'תזכורת צ\'ק-אאוט: אנא פנו את חדר {roomNumber} עד {checkOutTime}. תודה על השהייה!',
        payment_reminder: 'תזכורת תשלום: יתרה של €{amount} להזמנה #{reservationNumber}. אנא שלמו לפני הצ\'ק-אין.',
        welcome_message: 'ברוכים הבאים ל{propertyName}! WiFi: {wifiPassword}. קבלה: {receptionPhone}. שהייה נעימה!',
        late_checkout: 'צ\'ק-אאוט מאוחר אושר עד {newCheckOutTime} לחדר {roomNumber}. עלולים לחול חיובים נוספים.',
        cancellation: 'ההזמנה שלך #{reservationNumber} בוטלה. ההחזר יעובד תוך 3-5 ימי עסקים.'
      },
      ru: {
        booking_confirmation: 'Ваше бронирование #{reservationNumber} подтверждено. Заселение: {checkIn} в {propertyName}. Спасибо!',
        check_in_reminder: 'Напоминание: Ваше заселение сегодня в {checkInTime}. Номер {roomNumber} готов. Добро пожаловать в {propertyName}!',
        check_out_reminder: 'Напоминание о выселении: Просьба освободить номер {roomNumber} до {checkOutTime}. Спасибо за проживание!',
        payment_reminder: 'Напоминание об оплате: Задолженность €{amount} по бронированию #{reservationNumber}. Просьба оплатить до заселения.',
        welcome_message: 'Добро пожаловать в {propertyName}! WiFi: {wifiPassword}. Ресепшн: {receptionPhone}. Приятного отдыха!',
        late_checkout: 'Поздний выезд одобрен до {newCheckOutTime} для номера {roomNumber}. Могут взиматься дополнительные сборы.',
        cancellation: 'Ваше бронирование #{reservationNumber} отменено. Возврат средств будет обработан в течение 3-5 рабочих дней.'
      }
    };

    return templates[language] || templates.en;
  }

  /**
   * Replace template variables with actual values
   */
  static renderTemplate(template: string, variables: Record<string, any>): string {
    let rendered = template;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{${key}}`;
      rendered = rendered.replace(new RegExp(placeholder, 'g'), String(value));
    }

    return rendered;
  }
}

// Routes

/**
 * @route POST /api/v1/cyprus/sms/send
 * @desc Send a single SMS
 * @access Private
 */
router.post('/send', async (req, res) => {
  try {
    const validatedData = sendSmsSchema.parse(req.body);

    // Format and validate phone number
    const formattedNumber = CyprusSMSService.formatCyprusNumber(validatedData.phoneNumber);
    if (!CyprusSMSService.isValidCyprusNumber(formattedNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Cyprus phone number format'
      });
    }

    // Send SMS
    const result = await CyprusSMSService.sendSMS(
      formattedNumber,
      validatedData.message,
      validatedData.provider
    );

    // Log SMS to database
    const smsLog = await prisma.cyprusSMSLog.create({
      data: {
        phoneNumber: formattedNumber,
        message: validatedData.message,
        provider: result.provider as any,
        status: result.success ? 'SENT' : 'FAILED',
        providerRef: result.providerRef,
        cost: result.cost,
        reservationId: validatedData.reservationId,
        guestId: validatedData.guestId,
        sentBy: req.user?.id,
        errorCode: result.success ? null : 'SEND_FAILED',
        errorMessage: result.errorMessage
      }
    });

    res.json({
      success: result.success,
      data: {
        smsId: smsLog.id,
        provider: result.provider,
        providerRef: result.providerRef,
        cost: result.cost,
        status: result.success ? 'SENT' : 'FAILED'
      },
      message: result.success ? 'SMS sent successfully' : result.errorMessage
    });

  } catch (error) {
    console.error('SMS Send Error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send SMS'
    });
  }
});

/**
 * @route POST /api/v1/cyprus/sms/send-bulk
 * @desc Send multiple SMS messages
 * @access Private
 */
router.post('/send-bulk', async (req, res) => {
  try {
    const validatedData = bulkSmsSchema.parse(req.body);
    const results = [];

    for (const smsData of validatedData.messages) {
      try {
        const formattedNumber = CyprusSMSService.formatCyprusNumber(smsData.phoneNumber);

        if (!CyprusSMSService.isValidCyprusNumber(formattedNumber)) {
          results.push({
            phoneNumber: smsData.phoneNumber,
            success: false,
            error: 'Invalid phone number format'
          });
          continue;
        }

        const result = await CyprusSMSService.sendSMS(
          formattedNumber,
          smsData.message,
          validatedData.provider || smsData.provider
        );

        // Log to database
        const smsLog = await prisma.cyprusSMSLog.create({
          data: {
            phoneNumber: formattedNumber,
            message: smsData.message,
            provider: result.provider as any,
            status: result.success ? 'SENT' : 'FAILED',
            providerRef: result.providerRef,
            cost: result.cost,
            reservationId: smsData.reservationId,
            guestId: smsData.guestId,
            sentBy: req.user?.id,
            errorCode: result.success ? null : 'SEND_FAILED',
            errorMessage: result.errorMessage
          }
        });

        results.push({
          phoneNumber: formattedNumber,
          success: result.success,
          smsId: smsLog.id,
          provider: result.provider,
          cost: result.cost,
          error: result.errorMessage
        });

        // Small delay to avoid overwhelming the provider
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        results.push({
          phoneNumber: smsData.phoneNumber,
          success: false,
          error: error instanceof Error ? error.message : 'Send failed'
        });
      }
    }

    const successful = results.filter(r => r.success).length;
    const totalCost = results
      .filter(r => r.success && r.cost)
      .reduce((sum, r) => sum + (r.cost || 0), 0);

    res.json({
      success: true,
      data: {
        total: validatedData.messages.length,
        successful,
        failed: validatedData.messages.length - successful,
        totalCost: Math.round(totalCost * 100) / 100,
        results
      }
    });

  } catch (error) {
    console.error('Bulk SMS Error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Bulk SMS failed'
    });
  }
});

/**
 * @route POST /api/v1/cyprus/sms/send-template
 * @desc Send SMS using a predefined template
 * @access Private
 */
router.post('/send-template', async (req, res) => {
  try {
    const {
      phoneNumber,
      templateName,
      variables,
      language = 'en',
      provider,
      reservationId,
      guestId
    } = req.body;

    // Get template
    const templates = CyprusSMSService.getTemplates(language);
    const template = templates[templateName];

    if (!template) {
      return res.status(404).json({
        success: false,
        message: `Template '${templateName}' not found for language '${language}'`
      });
    }

    // Render template with variables
    const message = CyprusSMSService.renderTemplate(template, variables || {});

    // Send SMS
    const formattedNumber = CyprusSMSService.formatCyprusNumber(phoneNumber);
    const result = await CyprusSMSService.sendSMS(formattedNumber, message, provider);

    // Log to database
    const smsLog = await prisma.cyprusSMSLog.create({
      data: {
        phoneNumber: formattedNumber,
        message,
        provider: result.provider as any,
        status: result.success ? 'SENT' : 'FAILED',
        providerRef: result.providerRef,
        cost: result.cost,
        reservationId,
        guestId,
        sentBy: req.user?.id,
        errorCode: result.success ? null : 'SEND_FAILED',
        errorMessage: result.errorMessage
      }
    });

    res.json({
      success: result.success,
      data: {
        smsId: smsLog.id,
        template: templateName,
        language,
        renderedMessage: message,
        provider: result.provider,
        cost: result.cost
      },
      message: result.success ? 'Template SMS sent successfully' : result.errorMessage
    });

  } catch (error) {
    console.error('Template SMS Error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Template SMS failed'
    });
  }
});

/**
 * @route GET /api/v1/cyprus/sms/templates
 * @desc Get available SMS templates
 * @access Private
 */
router.get('/templates', async (req, res) => {
  try {
    const { language = 'en' } = req.query;
    const templates = CyprusSMSService.getTemplates(language as string);

    // Add metadata about each template
    const templatesWithMeta = Object.entries(templates).map(([name, content]) => {
      const variables = content.match(/\{([^}]+)\}/g)?.map(v => v.slice(1, -1)) || [];

      return {
        name,
        content,
        variables,
        length: content.length,
        language
      };
    });

    res.json({
      success: true,
      data: {
        language,
        templates: templatesWithMeta,
        availableLanguages: ['en', 'el', 'he', 'ru']
      }
    });

  } catch (error) {
    console.error('SMS Templates Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch SMS templates'
    });
  }
});

/**
 * @route GET /api/v1/cyprus/sms/logs
 * @desc Get SMS logs with filtering
 * @access Private
 */
router.get('/logs', async (req, res) => {
  try {
    const {
      phoneNumber,
      status,
      provider,
      startDate,
      endDate,
      reservationId,
      guestId,
      page = 1,
      limit = 20
    } = req.query;

    const where: any = {};

    if (phoneNumber) {
      where.phoneNumber = { contains: phoneNumber };
    }

    if (status) {
      where.status = status;
    }

    if (provider) {
      where.provider = provider;
    }

    if (reservationId) {
      where.reservationId = reservationId;
    }

    if (guestId) {
      where.guestId = guestId;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate as string);
      }
    }

    const [logs, total] = await Promise.all([
      prisma.cyprusSMSLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.cyprusSMSLog.count({ where })
    ]);

    // Calculate total cost for the filtered period
    const totalCost = await prisma.cyprusSMSLog.aggregate({
      where: {
        ...where,
        status: 'SENT'
      },
      _sum: {
        cost: true
      }
    });

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        },
        summary: {
          totalCost: totalCost._sum.cost || 0,
          sentCount: logs.filter(log => log.status === 'SENT').length,
          failedCount: logs.filter(log => log.status === 'FAILED').length
        }
      }
    });

  } catch (error) {
    console.error('SMS Logs Query Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch SMS logs'
    });
  }
});

/**
 * @route GET /api/v1/cyprus/sms/statistics
 * @desc Get SMS usage statistics
 * @access Private
 */
router.get('/statistics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const now = new Date();
    const defaultStartDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of current month

    const where: any = {
      createdAt: {
        gte: startDate ? new Date(startDate as string) : defaultStartDate,
        lte: endDate ? new Date(endDate as string) : now
      }
    };

    const [
      totalSent,
      totalCost,
      providerStats,
      dailyStats
    ] = await Promise.all([
      // Total sent messages
      prisma.cyprusSMSLog.count({
        where: { ...where, status: 'SENT' }
      }),

      // Total cost
      prisma.cyprusSMSLog.aggregate({
        where: { ...where, status: 'SENT' },
        _sum: { cost: true }
      }),

      // Stats by provider
      prisma.cyprusSMSLog.groupBy({
        by: ['provider', 'status'],
        where,
        _count: true,
        _sum: { cost: true }
      }),

      // Daily stats for the last 30 days
      prisma.$queryRaw`
        SELECT
          DATE(created_at) as date,
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'SENT' THEN 1 END) as sent,
          SUM(CASE WHEN status = 'SENT' THEN cost ELSE 0 END) as cost
        FROM cyprus_sms_logs
        WHERE created_at >= ${new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)}
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `
    ]);

    // Process provider stats
    const providerSummary = providerStats.reduce((acc: any, stat) => {
      if (!acc[stat.provider]) {
        acc[stat.provider] = { sent: 0, failed: 0, cost: 0 };
      }
      if (stat.status === 'SENT') {
        acc[stat.provider].sent = stat._count;
        acc[stat.provider].cost = stat._sum.cost || 0;
      } else if (stat.status === 'FAILED') {
        acc[stat.provider].failed = stat._count;
      }
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        summary: {
          totalSent,
          totalCost: totalCost._sum.cost || 0,
          averageCostPerSms: totalSent > 0 ? (totalCost._sum.cost || 0) / totalSent : 0
        },
        providerSummary,
        dailyStats,
        period: {
          start: startDate || defaultStartDate,
          end: endDate || now
        }
      }
    });

  } catch (error) {
    console.error('SMS Statistics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch SMS statistics'
    });
  }
});

export default router;