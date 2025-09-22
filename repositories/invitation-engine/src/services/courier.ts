/**
 * Cyprus Access Control (CAC) - Courier Integration Service
 * Multi-provider courier tracking for invitation deliveries
 */

import axios from 'axios';
import { CourierTrackingData } from '../types/extended';

export interface CourierCredentials {
  dhl: {
    apiKey: string;
    apiSecret: string;
    accountNumber: string;
  };
  ups: {
    clientId: string;
    clientSecret: string;
    accessToken?: string;
  };
  fedex: {
    apiKey: string;
    secretKey: string;
    accountNumber: string;
    meterNumber: string;
  };
}

export interface TrackingEvent {
  timestamp: Date;
  status: string;
  location: string;
  description: string;
  eventCode?: string;
}

export interface CourierResponse {
  success: boolean;
  trackingNumber: string;
  status: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  events: TrackingEvent[];
  carrier: 'DHL' | 'UPS' | 'FedEx';
  error?: string;
}

export interface ShipmentRequest {
  invitationNumber: string;
  recipientDetails: {
    name: string;
    company: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
    email?: string;
  };
  senderDetails: {
    name: string;
    company: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  packageDetails: {
    weight: number; // kg
    dimensions: {
      length: number; // cm
      width: number;
      height: number;
    };
    description: string;
    value: number; // EUR
  };
  serviceType: 'express' | 'standard' | 'economy';
  requireSignature: boolean;
  insuranceValue?: number;
}

export class CourierService {
  private credentials: CourierCredentials;
  private baseUrls = {
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

  /**
   * Track shipment across all supported carriers
   */
  async trackShipment(trackingNumber: string, carrier?: 'DHL' | 'UPS' | 'FedEx'): Promise<CourierResponse> {
    try {
      if (carrier) {
        return await this.trackWithCarrier(trackingNumber, carrier);
      }

      // Try to determine carrier from tracking number format
      const detectedCarrier = this.detectCarrier(trackingNumber);
      if (detectedCarrier) {
        return await this.trackWithCarrier(trackingNumber, detectedCarrier);
      }

      // Try all carriers if detection fails
      const carriers: ('DHL' | 'UPS' | 'FedEx')[] = ['DHL', 'UPS', 'FedEx'];

      for (const carrierName of carriers) {
        try {
          const result = await this.trackWithCarrier(trackingNumber, carrierName);
          if (result.success) {
            return result;
          }
        } catch (error) {
          continue; // Try next carrier
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

    } catch (error) {
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

  /**
   * Track with specific carrier
   */
  private async trackWithCarrier(trackingNumber: string, carrier: 'DHL' | 'UPS' | 'FedEx'): Promise<CourierResponse> {
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

  /**
   * DHL Tracking Integration
   */
  private async trackDHL(trackingNumber: string): Promise<CourierResponse> {
    try {
      const response = await axios.get(
        `${this.baseUrls.dhl.tracking}?trackingNumber=${trackingNumber}`,
        {
          headers: {
            'DHL-API-Key': this.credentials.dhl.apiKey,
            'Accept': 'application/json'
          },
          timeout: 10000
        }
      );

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

      const events: TrackingEvent[] = shipment.events?.map((event: any) => ({
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

    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
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

  /**
   * UPS Tracking Integration
   */
  private async trackUPS(trackingNumber: string): Promise<CourierResponse> {
    try {
      // Get access token if not available
      if (!this.credentials.ups.accessToken) {
        await this.getUPSAccessToken();
      }

      const response = await axios.get(
        `${this.baseUrls.ups.tracking}/${trackingNumber}`,
        {
          headers: {
            'Authorization': `Bearer ${this.credentials.ups.accessToken}`,
            'Accept': 'application/json'
          },
          timeout: 10000
        }
      );

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

      const events: TrackingEvent[] = packageData.activity?.map((activity: any) => ({
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

    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
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

  /**
   * FedEx Tracking Integration
   */
  private async trackFedEx(trackingNumber: string): Promise<CourierResponse> {
    try {
      const response = await axios.post(
        this.baseUrls.fedex.tracking,
        {
          trackingInfo: [
            {
              trackingNumberInfo: {
                trackingNumber: trackingNumber
              }
            }
          ],
          includeDetailedScans: true
        },
        {
          headers: {
            'X-FedEx-API-Key': this.credentials.fedex.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000
        }
      );

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
      const events: TrackingEvent[] = scanEvents.map((event: any) => ({
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

    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
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

  /**
   * Create shipment with preferred carrier
   */
  async createShipment(shipmentRequest: ShipmentRequest, preferredCarrier: 'DHL' | 'UPS' | 'FedEx'): Promise<{
    success: boolean;
    trackingNumber?: string;
    shipmentId?: string;
    estimatedDelivery?: Date;
    cost?: number;
    currency?: string;
    error?: string;
  }> {
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
    } catch (error) {
      return {
        success: false,
        error: `Shipment creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get delivery status summary for invitation dashboard
   */
  async getInvitationDeliveryStatus(invitationNumber: string): Promise<{
    trackingNumber?: string;
    carrier?: string;
    status: string;
    estimatedDelivery?: Date;
    lastUpdate: Date;
    deliveryProgress: number; // 0-100%
  }> {
    try {
      // This would typically query the database for stored tracking info
      // For now, we'll return a placeholder structure
      return {
        status: 'in_transit',
        lastUpdate: new Date(),
        deliveryProgress: 65
      };
    } catch (error) {
      return {
        status: 'unknown',
        lastUpdate: new Date(),
        deliveryProgress: 0
      };
    }
  }

  // Private helper methods

  private detectCarrier(trackingNumber: string): 'DHL' | 'UPS' | 'FedEx' | null {
    // DHL: 10-11 digits, often starts with specific patterns
    if (/^\d{10,11}$/.test(trackingNumber)) {
      return 'DHL';
    }

    // UPS: 1Z followed by 16 characters
    if (/^1Z[0-9A-Z]{16}$/.test(trackingNumber)) {
      return 'UPS';
    }

    // FedEx: 12-14 digits, often starts with specific patterns
    if (/^\d{12,14}$/.test(trackingNumber)) {
      return 'FedEx';
    }

    return null;
  }

  private async getUPSAccessToken(): Promise<void> {
    try {
      const response = await axios.post(
        'https://onlinetools.ups.com/security/v1/oauth/token',
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${this.credentials.ups.clientId}:${this.credentials.ups.clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.credentials.ups.accessToken = response.data.access_token;
    } catch (error) {
      throw new Error('Failed to get UPS access token');
    }
  }

  private async createDHLShipment(shipmentRequest: ShipmentRequest): Promise<any> {
    // DHL shipment creation implementation
    return { success: false, error: 'DHL shipment creation not yet implemented' };
  }

  private async createUPSShipment(shipmentRequest: ShipmentRequest): Promise<any> {
    // UPS shipment creation implementation
    return { success: false, error: 'UPS shipment creation not yet implemented' };
  }

  private async createFedExShipment(shipmentRequest: ShipmentRequest): Promise<any> {
    // FedEx shipment creation implementation
    return { success: false, error: 'FedEx shipment creation not yet implemented' };
  }

  private normalizeDHLStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'transit': 'in_transit',
      'delivered': 'delivered',
      'pre-transit': 'label_created',
      'failure': 'delivery_failed',
      'unknown': 'unknown'
    };
    return statusMap[status?.toLowerCase()] || 'unknown';
  }

  private normalizeUPSStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'in transit': 'in_transit',
      'delivered': 'delivered',
      'label created': 'label_created',
      'exception': 'delivery_failed',
      'unknown': 'unknown'
    };
    return statusMap[status?.toLowerCase()] || 'unknown';
  }

  private normalizeFedExStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'it': 'in_transit',
      'dl': 'delivered',
      'sh': 'label_created',
      'ex': 'delivery_failed',
      'pu': 'picked_up'
    };
    return statusMap[status?.toLowerCase()] || 'unknown';
  }
}