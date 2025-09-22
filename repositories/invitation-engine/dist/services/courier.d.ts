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
        weight: number;
        dimensions: {
            length: number;
            width: number;
            height: number;
        };
        description: string;
        value: number;
    };
    serviceType: 'express' | 'standard' | 'economy';
    requireSignature: boolean;
    insuranceValue?: number;
}
export declare class CourierService {
    private credentials;
    private baseUrls;
    constructor();
    trackShipment(trackingNumber: string, carrier?: 'DHL' | 'UPS' | 'FedEx'): Promise<CourierResponse>;
    private trackWithCarrier;
    private trackDHL;
    private trackUPS;
    private trackFedEx;
    createShipment(shipmentRequest: ShipmentRequest, preferredCarrier: 'DHL' | 'UPS' | 'FedEx'): Promise<{
        success: boolean;
        trackingNumber?: string;
        shipmentId?: string;
        estimatedDelivery?: Date;
        cost?: number;
        currency?: string;
        error?: string;
    }>;
    getInvitationDeliveryStatus(invitationNumber: string): Promise<{
        trackingNumber?: string;
        carrier?: string;
        status: string;
        estimatedDelivery?: Date;
        lastUpdate: Date;
        deliveryProgress: number;
    }>;
    private detectCarrier;
    private getUPSAccessToken;
    private createDHLShipment;
    private createUPSShipment;
    private createFedExShipment;
    private normalizeDHLStatus;
    private normalizeUPSStatus;
    private normalizeFedExStatus;
}
//# sourceMappingURL=courier.d.ts.map