/**
 * Cyprus Access Control (CAC) - Courier Integration Routes
 * Tracking, webhooks, and shipment management for DHL, UPS, FedEx
 */

import { Router, Request, Response } from 'express';
import { CourierService } from '../services/courier';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';

const router = Router();
const courierService = new CourierService();

// Rate limiting for courier operations
const courierRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // 50 requests per window
  message: { error: 'Too many courier requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const webhookRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 webhooks per minute
  message: { error: 'Webhook rate limit exceeded' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Track shipment by tracking number
 * GET /api/courier/track/:trackingNumber
 */
router.get('/track/:trackingNumber', courierRateLimit, async (req: Request, res: Response) => {
  try {
    const { trackingNumber } = req.params;
    const { carrier } = req.query;

    if (!trackingNumber) {
      return res.status(400).json({
        success: false,
        error: 'Tracking number is required'
      });
    }

    const result = await courierService.trackShipment(
      trackingNumber,
      carrier as 'DHL' | 'UPS' | 'FedEx' | undefined
    );

    res.json(result);

  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track shipment'
    });
  }
});

/**
 * Get delivery status for specific invitation
 * GET /api/courier/invitation/:invitationNumber
 */
router.get('/invitation/:invitationNumber', courierRateLimit, async (req: Request, res: Response) => {
  try {
    const { invitationNumber } = req.params;

    if (!invitationNumber) {
      return res.status(400).json({
        success: false,
        error: 'Invitation number is required'
      });
    }

    const result = await courierService.getInvitationDeliveryStatus(invitationNumber);

    res.json({
      success: true,
      invitationNumber,
      delivery: result
    });

  } catch (error) {
    console.error('Invitation delivery status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get delivery status'
    });
  }
});

/**
 * Create new shipment
 * POST /api/courier/ship
 */
router.post('/ship', courierRateLimit, async (req: Request, res: Response) => {
  try {
    const { shipmentRequest, carrier = 'DHL' } = req.body;

    if (!shipmentRequest || !shipmentRequest.invitationNumber) {
      return res.status(400).json({
        success: false,
        error: 'Shipment request with invitation number is required'
      });
    }

    const result = await courierService.createShipment(shipmentRequest, carrier);

    res.json(result);

  } catch (error) {
    console.error('Shipment creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create shipment'
    });
  }
});

/**
 * DHL webhook handler
 * POST /webhook/courier/dhl
 */
router.post('/dhl', webhookRateLimit, async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-dhl-signature'] as string;
    const webhookSecret = process.env.DHL_WEBHOOK_SECRET;

    // Verify webhook signature
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (signature !== expectedSignature) {
        return res.status(401).json({ error: 'Invalid webhook signature' });
      }
    }

    const { trackingNumber, status, timestamp, location } = req.body;

    console.log('DHL Webhook received:', {
      trackingNumber,
      status,
      timestamp,
      location
    });

    // Process DHL webhook data
    await processCourierWebhook({
      carrier: 'DHL',
      trackingNumber,
      status,
      timestamp: new Date(timestamp),
      location,
      rawData: req.body
    });

    res.json({ success: true, message: 'DHL webhook processed' });

  } catch (error) {
    console.error('DHL webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * UPS webhook handler
 * POST /webhook/courier/ups
 */
router.post('/ups', webhookRateLimit, async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-ups-signature'] as string;
    const webhookSecret = process.env.UPS_WEBHOOK_SECRET;

    // Verify webhook signature
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (signature !== expectedSignature) {
        return res.status(401).json({ error: 'Invalid webhook signature' });
      }
    }

    const { TrackingNumber, StatusType, DateTime, Location } = req.body;

    console.log('UPS Webhook received:', {
      trackingNumber: TrackingNumber,
      status: StatusType,
      timestamp: DateTime,
      location: Location
    });

    // Process UPS webhook data
    await processCourierWebhook({
      carrier: 'UPS',
      trackingNumber: TrackingNumber,
      status: StatusType,
      timestamp: new Date(DateTime),
      location: Location,
      rawData: req.body
    });

    res.json({ success: true, message: 'UPS webhook processed' });

  } catch (error) {
    console.error('UPS webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * FedEx webhook handler
 * POST /webhook/courier/fedex
 */
router.post('/fedex', webhookRateLimit, async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-fedex-signature'] as string;
    const webhookSecret = process.env.FEDEX_WEBHOOK_SECRET;

    // Verify webhook signature
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (signature !== expectedSignature) {
        return res.status(401).json({ error: 'Invalid webhook signature' });
      }
    }

    const { trackingNumber, scanEvent, eventDateTime, locationId } = req.body;

    console.log('FedEx Webhook received:', {
      trackingNumber,
      event: scanEvent,
      timestamp: eventDateTime,
      location: locationId
    });

    // Process FedEx webhook data
    await processCourierWebhook({
      carrier: 'FedEx',
      trackingNumber,
      status: scanEvent,
      timestamp: new Date(eventDateTime),
      location: locationId,
      rawData: req.body
    });

    res.json({ success: true, message: 'FedEx webhook processed' });

  } catch (error) {
    console.error('FedEx webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * Get courier service status and capabilities
 * GET /api/courier/status
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const status = {
      service: 'Courier Integration Service',
      version: '1.0.0',
      capabilities: {
        tracking: {
          DHL: !!process.env.DHL_API_KEY,
          UPS: !!process.env.UPS_CLIENT_ID,
          FedEx: !!process.env.FEDEX_API_KEY
        },
        shipping: {
          DHL: !!process.env.DHL_API_KEY,
          UPS: !!process.env.UPS_CLIENT_ID,
          FedEx: !!process.env.FEDEX_API_KEY
        },
        webhooks: {
          DHL: !!process.env.DHL_WEBHOOK_SECRET,
          UPS: !!process.env.UPS_WEBHOOK_SECRET,
          FedEx: !!process.env.FEDEX_WEBHOOK_SECRET
        }
      },
      endpoints: {
        track: '/api/courier/track/:trackingNumber',
        invitation: '/api/courier/invitation/:invitationNumber',
        ship: '/api/courier/ship',
        webhooks: {
          DHL: '/webhook/courier/dhl',
          UPS: '/webhook/courier/ups',
          FedEx: '/webhook/courier/fedex'
        }
      },
      supportedRegions: ['Cyprus', 'EU', 'International'],
      lastUpdate: new Date().toISOString()
    };

    res.json(status);

  } catch (error) {
    console.error('Courier status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get courier status'
    });
  }
});

/**
 * Process courier webhook data and update invitation status
 */
async function processCourierWebhook(webhookData: {
  carrier: 'DHL' | 'UPS' | 'FedEx';
  trackingNumber: string;
  status: string;
  timestamp: Date;
  location: string;
  rawData: any;
}) {
  try {
    // This would typically:
    // 1. Find the invitation associated with this tracking number
    // 2. Update the delivery status in the database
    // 3. Send real-time updates via WebSocket
    // 4. Trigger notification workflows if delivered
    // 5. Update analytics and metrics

    console.log('Processing courier webhook:', {
      carrier: webhookData.carrier,
      trackingNumber: webhookData.trackingNumber,
      status: webhookData.status,
      timestamp: webhookData.timestamp,
      location: webhookData.location
    });

    // Placeholder for database operations
    // await updateInvitationDeliveryStatus(webhookData);

    // Placeholder for WebSocket notifications
    // await notifyAdminDashboard(webhookData);

    // Placeholder for delivery completion workflows
    if (webhookData.status.toLowerCase().includes('delivered')) {
      console.log(`🎉 Invitation delivered! Tracking: ${webhookData.trackingNumber}`);
      // await triggerDeliveryCompletionWorkflow(webhookData.trackingNumber);
    }

  } catch (error) {
    console.error('Error processing courier webhook:', error);
    throw error;
  }
}

export default router;