import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// JCC Payment Gateway Configuration
const JCC_CONFIG = {
  baseUrl: process.env.JCC_API_URL || 'https://api.jcc.com.cy/v2',
  merchantId: process.env.JCC_MERCHANT_ID,
  apiKey: process.env.JCC_API_KEY,
  sandbox: process.env.NODE_ENV !== 'production'
};

// Validation schemas
const createPaymentSchema = z.object({
  reservationId: z.string().cuid(),
  amount: z.number().positive(),
  currency: z.enum(['EUR', 'GBP', 'USD', 'ILS']).default('EUR'),
  paymentMethod: z.enum(['VISA', 'MASTERCARD', 'MAESTRO', 'AMERICAN_EXPRESS', 'LOCAL_BANK']),
  cardToken: z.string().optional(),
  customerInfo: z.object({
    email: z.string().email(),
    phone: z.string().optional(),
    name: z.string()
  }),
  threeDSecure: z.boolean().default(true)
});

const capturePaymentSchema = z.object({
  transactionId: z.string(),
  amount: z.number().positive().optional()
});

// JCC API integration functions
class JCCPaymentService {
  private static async makeJCCRequest(endpoint: string, data: any): Promise<any> {
    const response = await fetch(`${JCC_CONFIG.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JCC_CONFIG.apiKey}`,
        'X-Merchant-ID': JCC_CONFIG.merchantId || ''
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`JCC API Error: ${error.message || response.statusText}`);
    }

    return response.json();
  }

  static async createPayment(paymentData: z.infer<typeof createPaymentSchema>): Promise<any> {
    const jccPayload = {
      merchant_id: JCC_CONFIG.merchantId,
      amount: Math.round(paymentData.amount * 100), // Convert to cents
      currency: paymentData.currency,
      order_id: paymentData.reservationId,
      customer: {
        email: paymentData.customerInfo.email,
        phone: paymentData.customerInfo.phone,
        name: paymentData.customerInfo.name
      },
      payment_method: paymentData.paymentMethod.toLowerCase(),
      card_token: paymentData.cardToken,
      three_d_secure: paymentData.threeDSecure,
      return_url: `${process.env.FRONTEND_URL}/payment/return`,
      callback_url: `${process.env.API_URL}/api/v1/cyprus/jcc/webhook`
    };

    return this.makeJCCRequest('/payments/create', jccPayload);
  }

  static async authorizePayment(transactionId: string): Promise<any> {
    return this.makeJCCRequest('/payments/authorize', {
      transaction_id: transactionId
    });
  }

  static async capturePayment(transactionId: string, amount?: number): Promise<any> {
    const payload: any = {
      transaction_id: transactionId
    };

    if (amount) {
      payload.amount = Math.round(amount * 100);
    }

    return this.makeJCCRequest('/payments/capture', payload);
  }

  static async refundPayment(transactionId: string, amount?: number): Promise<any> {
    const payload: any = {
      transaction_id: transactionId
    };

    if (amount) {
      payload.amount = Math.round(amount * 100);
    }

    return this.makeJCCRequest('/payments/refund', payload);
  }

  static async getPaymentStatus(transactionId: string): Promise<any> {
    const response = await fetch(`${JCC_CONFIG.baseUrl}/payments/${transactionId}`, {
      headers: {
        'Authorization': `Bearer ${JCC_CONFIG.apiKey}`,
        'X-Merchant-ID': JCC_CONFIG.merchantId || ''
      }
    });

    if (!response.ok) {
      throw new Error(`JCC API Error: ${response.statusText}`);
    }

    return response.json();
  }
}

// Routes

/**
 * @route POST /api/v1/cyprus/jcc/create-payment
 * @desc Create a new JCC payment
 * @access Private
 */
router.post('/create-payment', async (req, res) => {
  try {
    const validatedData = createPaymentSchema.parse(req.body);

    // Verify reservation exists
    const reservation = await prisma.reservation.findUnique({
      where: { id: validatedData.reservationId },
      include: { guest: true, property: true }
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Create JCC payment
    const jccResponse = await JCCPaymentService.createPayment(validatedData);

    // Store transaction in database
    const jccTransaction = await prisma.jCCTransaction.create({
      data: {
        reservationId: validatedData.reservationId,
        jccTransactionId: jccResponse.transaction_id,
        merchantReference: `RES-${reservation.reservationNumber}`,
        amount: validatedData.amount,
        currency: validatedData.currency,
        paymentMethod: validatedData.paymentMethod,
        cardLast4: jccResponse.card_last4,
        cardBrand: jccResponse.card_brand,
        threeDSAuth: validatedData.threeDSecure,
        status: 'PENDING',
        initiatedBy: req.user?.id,
        ipAddress: req.ip
      }
    });

    // Update reservation with JCC reference
    await prisma.reservation.update({
      where: { id: validatedData.reservationId },
      data: {
        jccReference: jccResponse.transaction_id,
        paymentStatus: 'PROCESSING'
      }
    });

    res.json({
      success: true,
      data: {
        transactionId: jccTransaction.id,
        jccTransactionId: jccResponse.transaction_id,
        paymentUrl: jccResponse.payment_url,
        threeDSecureUrl: jccResponse.three_d_secure_url,
        status: jccResponse.status
      }
    });

  } catch (error) {
    console.error('JCC Payment Creation Error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create payment'
    });
  }
});

/**
 * @route POST /api/v1/cyprus/jcc/capture/:transactionId
 * @desc Capture an authorized JCC payment
 * @access Private
 */
router.post('/capture/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const validatedData = capturePaymentSchema.parse(req.body);

    // Find transaction in database
    const transaction = await prisma.jCCTransaction.findUnique({
      where: { id: transactionId },
      include: { reservation: true }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    if (transaction.status !== 'AUTHORIZED') {
      return res.status(400).json({
        success: false,
        message: 'Transaction cannot be captured in current status'
      });
    }

    // Capture payment via JCC API
    const jccResponse = await JCCPaymentService.capturePayment(
      transaction.jccTransactionId,
      validatedData.amount
    );

    // Update transaction status
    await prisma.jCCTransaction.update({
      where: { id: transactionId },
      data: {
        status: 'CAPTURED',
        authCode: jccResponse.authorization_code,
        settlementDate: jccResponse.settlement_date ? new Date(jccResponse.settlement_date) : null
      }
    });

    // Update reservation payment status
    await prisma.reservation.update({
      where: { id: transaction.reservationId },
      data: {
        paymentStatus: 'PAID'
      }
    });

    res.json({
      success: true,
      data: {
        transactionId: transaction.id,
        authCode: jccResponse.authorization_code,
        settlementDate: jccResponse.settlement_date,
        status: 'CAPTURED'
      }
    });

  } catch (error) {
    console.error('JCC Payment Capture Error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to capture payment'
    });
  }
});

/**
 * @route POST /api/v1/cyprus/jcc/refund/:transactionId
 * @desc Refund a JCC payment
 * @access Private
 */
router.post('/refund/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { amount } = req.body;

    // Find transaction in database
    const transaction = await prisma.jCCTransaction.findUnique({
      where: { id: transactionId },
      include: { reservation: true }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    if (!['CAPTURED', 'SETTLED'].includes(transaction.status)) {
      return res.status(400).json({
        success: false,
        message: 'Transaction cannot be refunded in current status'
      });
    }

    // Process refund via JCC API
    const jccResponse = await JCCPaymentService.refundPayment(
      transaction.jccTransactionId,
      amount
    );

    // Update transaction status
    await prisma.jCCTransaction.update({
      where: { id: transactionId },
      data: {
        status: 'REFUNDED'
      }
    });

    // Update reservation payment status
    await prisma.reservation.update({
      where: { id: transaction.reservationId },
      data: {
        paymentStatus: 'REFUNDED'
      }
    });

    res.json({
      success: true,
      data: {
        refundId: jccResponse.refund_id,
        amount: jccResponse.amount / 100, // Convert back from cents
        status: 'REFUNDED'
      }
    });

  } catch (error) {
    console.error('JCC Payment Refund Error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to process refund'
    });
  }
});

/**
 * @route GET /api/v1/cyprus/jcc/status/:transactionId
 * @desc Get JCC payment status
 * @access Private
 */
router.get('/status/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;

    // Find transaction in database
    const transaction = await prisma.jCCTransaction.findUnique({
      where: { id: transactionId },
      include: {
        reservation: {
          select: {
            reservationNumber: true,
            totalAmount: true,
            currency: true
          }
        }
      }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Get latest status from JCC
    const jccStatus = await JCCPaymentService.getPaymentStatus(transaction.jccTransactionId);

    // Update local status if different
    if (jccStatus.status !== transaction.status) {
      await prisma.jCCTransaction.update({
        where: { id: transactionId },
        data: {
          status: jccStatus.status.toUpperCase(),
          settlementDate: jccStatus.settlement_date ? new Date(jccStatus.settlement_date) : null
        }
      });
    }

    res.json({
      success: true,
      data: {
        transactionId: transaction.id,
        jccTransactionId: transaction.jccTransactionId,
        status: jccStatus.status,
        amount: transaction.amount,
        currency: transaction.currency,
        paymentMethod: transaction.paymentMethod,
        cardLast4: transaction.cardLast4,
        authCode: transaction.authCode,
        settlementDate: transaction.settlementDate,
        reservation: transaction.reservation,
        createdAt: transaction.createdAt
      }
    });

  } catch (error) {
    console.error('JCC Status Check Error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to check payment status'
    });
  }
});

/**
 * @route POST /api/v1/cyprus/jcc/webhook
 * @desc Handle JCC payment webhooks
 * @access Public (but verified)
 */
router.post('/webhook', async (req, res) => {
  try {
    const { transaction_id, status, authorization_code, settlement_date, error_code, error_message } = req.body;

    // Find transaction in database
    const transaction = await prisma.jCCTransaction.findFirst({
      where: { jccTransactionId: transaction_id },
      include: { reservation: true }
    });

    if (!transaction) {
      console.error(`JCC Webhook: Transaction not found: ${transaction_id}`);
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Update transaction status
    const updateData: any = {
      status: status.toUpperCase()
    };

    if (authorization_code) {
      updateData.authCode = authorization_code;
    }

    if (settlement_date) {
      updateData.settlementDate = new Date(settlement_date);
    }

    if (error_code) {
      updateData.errorCode = error_code;
      updateData.errorMessage = error_message;
    }

    await prisma.jCCTransaction.update({
      where: { id: transaction.id },
      data: updateData
    });

    // Update reservation payment status based on transaction status
    let paymentStatus = 'PENDING';
    switch (status.toUpperCase()) {
      case 'AUTHORIZED':
        paymentStatus = 'AUTHORIZED';
        break;
      case 'CAPTURED':
      case 'SETTLED':
        paymentStatus = 'PAID';
        break;
      case 'FAILED':
      case 'CANCELLED':
        paymentStatus = 'FAILED';
        break;
      case 'REFUNDED':
        paymentStatus = 'REFUNDED';
        break;
    }

    await prisma.reservation.update({
      where: { id: transaction.reservationId },
      data: { paymentStatus }
    });

    console.log(`JCC Webhook processed: ${transaction_id} -> ${status}`);
    res.json({ success: true });

  } catch (error) {
    console.error('JCC Webhook Error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * @route GET /api/v1/cyprus/jcc/transactions
 * @desc Get JCC transactions for a reservation or date range
 * @access Private
 */
router.get('/transactions', async (req, res) => {
  try {
    const {
      reservationId,
      startDate,
      endDate,
      status,
      page = 1,
      limit = 20
    } = req.query;

    const where: any = {};

    if (reservationId) {
      where.reservationId = reservationId;
    }

    if (status) {
      where.status = status;
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

    const [transactions, total] = await Promise.all([
      prisma.jCCTransaction.findMany({
        where,
        include: {
          reservation: {
            select: {
              reservationNumber: true,
              guest: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.jCCTransaction.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });

  } catch (error) {
    console.error('JCC Transactions Query Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions'
    });
  }
});

export default router;