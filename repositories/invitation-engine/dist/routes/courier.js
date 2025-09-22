"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courier_1 = require("../services/courier");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const crypto_1 = __importDefault(require("crypto"));
const router = (0, express_1.Router)();
const courierService = new courier_1.CourierService();
const courierRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000,
    max: 50,
    message: { error: 'Too many courier requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
const webhookRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: { error: 'Webhook rate limit exceeded' },
    standardHeaders: true,
    legacyHeaders: false,
});
router.get('/track/:trackingNumber', courierRateLimit, async (req, res) => {
    try {
        const { trackingNumber } = req.params;
        const { carrier } = req.query;
        if (!trackingNumber) {
            return res.status(400).json({
                success: false,
                error: 'Tracking number is required'
            });
        }
        const result = await courierService.trackShipment(trackingNumber, carrier);
        res.json(result);
    }
    catch (error) {
        console.error('Tracking error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to track shipment'
        });
    }
});
router.get('/invitation/:invitationNumber', courierRateLimit, async (req, res) => {
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
    }
    catch (error) {
        console.error('Invitation delivery status error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get delivery status'
        });
    }
});
router.post('/ship', courierRateLimit, async (req, res) => {
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
    }
    catch (error) {
        console.error('Shipment creation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create shipment'
        });
    }
});
router.post('/dhl', webhookRateLimit, async (req, res) => {
    try {
        const signature = req.headers['x-dhl-signature'];
        const webhookSecret = process.env.DHL_WEBHOOK_SECRET;
        if (webhookSecret && signature) {
            const expectedSignature = crypto_1.default
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
        await processCourierWebhook({
            carrier: 'DHL',
            trackingNumber,
            status,
            timestamp: new Date(timestamp),
            location,
            rawData: req.body
        });
        res.json({ success: true, message: 'DHL webhook processed' });
    }
    catch (error) {
        console.error('DHL webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});
router.post('/ups', webhookRateLimit, async (req, res) => {
    try {
        const signature = req.headers['x-ups-signature'];
        const webhookSecret = process.env.UPS_WEBHOOK_SECRET;
        if (webhookSecret && signature) {
            const expectedSignature = crypto_1.default
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
        await processCourierWebhook({
            carrier: 'UPS',
            trackingNumber: TrackingNumber,
            status: StatusType,
            timestamp: new Date(DateTime),
            location: Location,
            rawData: req.body
        });
        res.json({ success: true, message: 'UPS webhook processed' });
    }
    catch (error) {
        console.error('UPS webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});
router.post('/fedex', webhookRateLimit, async (req, res) => {
    try {
        const signature = req.headers['x-fedex-signature'];
        const webhookSecret = process.env.FEDEX_WEBHOOK_SECRET;
        if (webhookSecret && signature) {
            const expectedSignature = crypto_1.default
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
        await processCourierWebhook({
            carrier: 'FedEx',
            trackingNumber,
            status: scanEvent,
            timestamp: new Date(eventDateTime),
            location: locationId,
            rawData: req.body
        });
        res.json({ success: true, message: 'FedEx webhook processed' });
    }
    catch (error) {
        console.error('FedEx webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});
router.get('/status', async (req, res) => {
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
    }
    catch (error) {
        console.error('Courier status error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get courier status'
        });
    }
});
async function processCourierWebhook(webhookData) {
    try {
        console.log('Processing courier webhook:', {
            carrier: webhookData.carrier,
            trackingNumber: webhookData.trackingNumber,
            status: webhookData.status,
            timestamp: webhookData.timestamp,
            location: webhookData.location
        });
        if (webhookData.status.toLowerCase().includes('delivered')) {
            console.log(`🎉 Invitation delivered! Tracking: ${webhookData.trackingNumber}`);
        }
    }
    catch (error) {
        console.error('Error processing courier webhook:', error);
        throw error;
    }
}
exports.default = router;
//# sourceMappingURL=courier.js.map