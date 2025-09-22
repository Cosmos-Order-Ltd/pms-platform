"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourierService = void 0;
const axios_1 = __importDefault(require("axios"));
class CourierService {
    credentials;
    baseUrls = {
        dhl: {
            tracking: 'https://api-eu.dhl.com/track/shipments',
            shipping: 'https://api-eu.dhl.com/mydhlapi/shipments'
        },
        ups: {
            tracking: 'https://onlinetools.ups.com/api/track/v1/details',
            shipping: 'https://onlinetools.ups.com/api/shipments/v1/ship'
        },
        fedex: {
            tracking: 'https://apis.fedex.com/track/v1/trackingnumbers',
            shipping: 'https://apis.fedex.com/ship/v1/shipments'
        }
    };
    constructor() {
        this.credentials = {
            dhl: {
                apiKey: process.env.DHL_API_KEY || '',
                apiSecret: process.env.DHL_API_SECRET || '',
                accountNumber: process.env.DHL_ACCOUNT_NUMBER || ''
            },
            ups: {
                clientId: process.env.UPS_CLIENT_ID || '',
                clientSecret: process.env.UPS_CLIENT_SECRET || ''
            },
            fedex: {
                apiKey: process.env.FEDEX_API_KEY || '',
                secretKey: process.env.FEDEX_SECRET_KEY || '',
                accountNumber: process.env.FEDEX_ACCOUNT_NUMBER || '',
                meterNumber: process.env.FEDEX_METER_NUMBER || ''
            }
        };
    }
    async trackShipment(trackingNumber, carrier) {
        try {
            if (carrier) {
                return await this.trackWithCarrier(trackingNumber, carrier);
            }
            const detectedCarrier = this.detectCarrier(trackingNumber);
            if (detectedCarrier) {
                return await this.trackWithCarrier(trackingNumber, detectedCarrier);
            }
            const carriers = ['DHL', 'UPS', 'FedEx'];
            for (const carrierName of carriers) {
                try {
                    const result = await this.trackWithCarrier(trackingNumber, carrierName);
                    if (result.success) {
                        return result;
                    }
                }
                catch (error) {
                    continue;
                }
            }
            return {
                success: false,
                trackingNumber,
                status: 'unknown',
                events: [],
                carrier: 'DHL',
                error: 'Tracking number not found with any supported carrier'
            };
        }
        catch (error) {
            return {
                success: false,
                trackingNumber,
                status: 'error',
                events: [],
                carrier: 'DHL',
                error: `Tracking failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
    async trackWithCarrier(trackingNumber, carrier) {
        switch (carrier) {
            case 'DHL':
                return await this.trackDHL(trackingNumber);
            case 'UPS':
                return await this.trackUPS(trackingNumber);
            case 'FedEx':
                return await this.trackFedEx(trackingNumber);
            default:
                throw new Error(`Unsupported carrier: ${carrier}`);
        }
    }
    async trackDHL(trackingNumber) {
        try {
            const response = await axios_1.default.get(`${this.baseUrls.dhl.tracking}?trackingNumber=${trackingNumber}`, {
                headers: {
                    'DHL-API-Key': this.credentials.dhl.apiKey,
                    'Accept': 'application/json'
                },
                timeout: 10000
            });
            const shipment = response.data.shipments?.[0];
            if (!shipment) {
                return {
                    success: false,
                    trackingNumber,
                    status: 'not_found',
                    events: [],
                    carrier: 'DHL',
                    error: 'Shipment not found'
                };
            }
            const events = shipment.events?.map((event) => ({
                timestamp: new Date(event.timestamp),
                status: event.status,
                location: event.location?.address?.addressLocality || 'Unknown',
                description: event.description,
                eventCode: event.statusCode
            })) || [];
            return {
                success: true,
                trackingNumber,
                status: this.normalizeDHLStatus(shipment.status),
                estimatedDelivery: shipment.estimatedTimeOfDelivery ? new Date(shipment.estimatedTimeOfDelivery) : undefined,
                actualDelivery: shipment.proofOfDelivery?.timestamp ? new Date(shipment.proofOfDelivery.timestamp) : undefined,
                events: events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
                carrier: 'DHL'
            };
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response?.status === 404) {
                return {
                    success: false,
                    trackingNumber,
                    status: 'not_found',
                    events: [],
                    carrier: 'DHL',
                    error: 'Tracking number not found'
                };
            }
            throw error;
        }
    }
    async trackUPS(trackingNumber) {
        try {
            if (!this.credentials.ups.accessToken) {
                await this.getUPSAccessToken();
            }
            const response = await axios_1.default.get(`${this.baseUrls.ups.tracking}/${trackingNumber}`, {
                headers: {
                    'Authorization': `Bearer ${this.credentials.ups.accessToken}`,
                    'Accept': 'application/json'
                },
                timeout: 10000
            });
            const packageData = response.data.trackResponse?.shipment?.[0]?.package?.[0];
            if (!packageData) {
                return {
                    success: false,
                    trackingNumber,
                    status: 'not_found',
                    events: [],
                    carrier: 'UPS',
                    error: 'Package not found'
                };
            }
            const events = packageData.activity?.map((activity) => ({
                timestamp: new Date(`${activity.date} ${activity.time}`),
                status: activity.status.type,
                location: `${activity.location?.address?.city || ''} ${activity.location?.address?.country || ''}`.trim(),
                description: activity.status.description,
                eventCode: activity.status.code
            })) || [];
            return {
                success: true,
                trackingNumber,
                status: this.normalizeUPSStatus(packageData.currentStatus),
                estimatedDelivery: packageData.deliveryDate ? new Date(packageData.deliveryDate) : undefined,
                actualDelivery: packageData.deliveryInformation?.deliveryDate ? new Date(packageData.deliveryInformation.deliveryDate) : undefined,
                events: events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
                carrier: 'UPS'
            };
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response?.status === 404) {
                return {
                    success: false,
                    trackingNumber,
                    status: 'not_found',
                    events: [],
                    carrier: 'UPS',
                    error: 'Tracking number not found'
                };
            }
            throw error;
        }
    }
    async trackFedEx(trackingNumber) {
        try {
            const response = await axios_1.default.post(this.baseUrls.fedex.tracking, {
                trackingInfo: [
                    {
                        trackingNumberInfo: {
                            trackingNumber: trackingNumber
                        }
                    }
                ],
                includeDetailedScans: true
            }, {
                headers: {
                    'X-FedEx-API-Key': this.credentials.fedex.apiKey,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                timeout: 10000
            });
            const trackingInfo = response.data.output?.completeTrackResults?.[0];
            if (!trackingInfo || trackingInfo.trackingNumber !== trackingNumber) {
                return {
                    success: false,
                    trackingNumber,
                    status: 'not_found',
                    events: [],
                    carrier: 'FedEx',
                    error: 'Tracking number not found'
                };
            }
            const scanEvents = trackingInfo.trackResults?.[0]?.scanEvents || [];
            const events = scanEvents.map((event) => ({
                timestamp: new Date(event.date),
                status: event.eventType,
                location: `${event.scanLocation?.city || ''} ${event.scanLocation?.countryCode || ''}`.trim(),
                description: event.eventDescription,
                eventCode: event.derivedStatusCode
            }));
            const latestStatus = trackingInfo.trackResults?.[0]?.latestStatusDetail;
            return {
                success: true,
                trackingNumber,
                status: this.normalizeFedExStatus(latestStatus?.code),
                estimatedDelivery: trackingInfo.trackResults?.[0]?.estimatedDeliveryTimeWindow?.window?.begins ?
                    new Date(trackingInfo.trackResults[0].estimatedDeliveryTimeWindow.window.begins) : undefined,
                actualDelivery: trackingInfo.trackResults?.[0]?.deliveryDetails?.actualDeliveryTimestamp ?
                    new Date(trackingInfo.trackResults[0].deliveryDetails.actualDeliveryTimestamp) : undefined,
                events: events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
                carrier: 'FedEx'
            };
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response?.status === 404) {
                return {
                    success: false,
                    trackingNumber,
                    status: 'not_found',
                    events: [],
                    carrier: 'FedEx',
                    error: 'Tracking number not found'
                };
            }
            throw error;
        }
    }
    async createShipment(shipmentRequest, preferredCarrier) {
        try {
            switch (preferredCarrier) {
                case 'DHL':
                    return await this.createDHLShipment(shipmentRequest);
                case 'UPS':
                    return await this.createUPSShipment(shipmentRequest);
                case 'FedEx':
                    return await this.createFedExShipment(shipmentRequest);
                default:
                    return {
                        success: false,
                        error: `Unsupported carrier: ${preferredCarrier}`
                    };
            }
        }
        catch (error) {
            return {
                success: false,
                error: `Shipment creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
    async getInvitationDeliveryStatus(invitationNumber) {
        try {
            return {
                status: 'in_transit',
                lastUpdate: new Date(),
                deliveryProgress: 65
            };
        }
        catch (error) {
            return {
                status: 'unknown',
                lastUpdate: new Date(),
                deliveryProgress: 0
            };
        }
    }
    detectCarrier(trackingNumber) {
        if (/^\d{10,11}$/.test(trackingNumber)) {
            return 'DHL';
        }
        if (/^1Z[0-9A-Z]{16}$/.test(trackingNumber)) {
            return 'UPS';
        }
        if (/^\d{12,14}$/.test(trackingNumber)) {
            return 'FedEx';
        }
        return null;
    }
    async getUPSAccessToken() {
        try {
            const response = await axios_1.default.post('https://onlinetools.ups.com/security/v1/oauth/token', 'grant_type=client_credentials', {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${this.credentials.ups.clientId}:${this.credentials.ups.clientSecret}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            this.credentials.ups.accessToken = response.data.access_token;
        }
        catch (error) {
            throw new Error('Failed to get UPS access token');
        }
    }
    async createDHLShipment(shipmentRequest) {
        return { success: false, error: 'DHL shipment creation not yet implemented' };
    }
    async createUPSShipment(shipmentRequest) {
        return { success: false, error: 'UPS shipment creation not yet implemented' };
    }
    async createFedExShipment(shipmentRequest) {
        return { success: false, error: 'FedEx shipment creation not yet implemented' };
    }
    normalizeDHLStatus(status) {
        const statusMap = {
            'transit': 'in_transit',
            'delivered': 'delivered',
            'pre-transit': 'label_created',
            'failure': 'delivery_failed',
            'unknown': 'unknown'
        };
        return statusMap[status?.toLowerCase()] || 'unknown';
    }
    normalizeUPSStatus(status) {
        const statusMap = {
            'in transit': 'in_transit',
            'delivered': 'delivered',
            'label created': 'label_created',
            'exception': 'delivery_failed',
            'unknown': 'unknown'
        };
        return statusMap[status?.toLowerCase()] || 'unknown';
    }
    normalizeFedExStatus(status) {
        const statusMap = {
            'it': 'in_transit',
            'dl': 'delivered',
            'sh': 'label_created',
            'ex': 'delivery_failed',
            'pu': 'picked_up'
        };
        return statusMap[status?.toLowerCase()] || 'unknown';
    }
}
exports.CourierService = CourierService;
//# sourceMappingURL=courier.js.map