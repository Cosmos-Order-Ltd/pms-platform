export type BusinessType = 'hotel' | 'real_estate' | 'company' | 'restaurant' | 'retail';
export type InvitationTier = 'founder' | 'early_access' | 'beta' | 'standard';
export type InvitationStatus = 'created' | 'sent' | 'delivered' | 'activated' | 'trial' | 'converted' | 'expired';
export type CourierProvider = 'DHL' | 'UPS' | 'FedEx' | 'HandDelivered';
export type LocationVerificationMethod = 'gps' | 'wifi' | 'ip' | 'cell_tower' | 'hybrid';
export interface InvitationConfig {
    businessType: BusinessType;
    recipientDetails: {
        name: string;
        title: string;
        company: string;
        address: string;
        email?: string;
        mobile?: string;
        registrationNumber?: string;
    };
    activationLocation: {
        coordinates: {
            lat: number;
            lng: number;
        };
        radius: number;
        alternativeLocations?: Array<{
            lat: number;
            lng: number;
            name: string;
            radius?: number;
        }>;
        wifiNetworks?: string[];
        ipRanges?: string[];
        allowedCountries?: string[];
    };
    invitationNumber: string;
    tier: InvitationTier;
    expirationHours: number;
    trialDays: number;
    deliveryMethod: CourierProvider;
    signatureRequired: boolean;
    trackingWebhooks: boolean;
    expedited?: boolean;
    platformAccess?: {
        pmsAdmin?: boolean;
        marketplace?: boolean;
        compliance?: boolean;
        analytics?: boolean;
    };
}
export interface Invitation {
    id: number;
    invitationNumber: string;
    businessType: BusinessType;
    tier: InvitationTier;
    status: InvitationStatus;
    recipientName: string;
    recipientTitle: string;
    recipientCompany: string;
    recipientAddress: string;
    recipientEmail?: string;
    recipientMobile?: string;
    businessRegistrationNumber?: string;
    activationLat: number;
    activationLng: number;
    activationRadius: number;
    wifiNetworks?: string[];
    ipRanges?: string[];
    alternativeLocations?: Array<{
        lat: number;
        lng: number;
        name: string;
        radius?: number;
    }>;
    createdAt: Date;
    sentAt?: Date;
    deliveredAt?: Date;
    signatureReceived?: string;
    activatedAt?: Date;
    trialEndsAt?: Date;
    convertedAt?: Date;
    expiredAt?: Date;
    deliveryAttempts: number;
    activationAttempts: number;
    failedLocationAttempts: LocationVerificationAttempt[];
    deviceFingerprints: DeviceFingerprint[];
    totalPageViews: number;
    lastSeenAt?: Date;
    expirationHours: number;
    trialDays: number;
    deliveryMethod: CourierProvider;
    signatureRequired: boolean;
    trackingWebhooks: boolean;
    platformAccess: {
        pmsAdmin: boolean;
        marketplace: boolean;
        compliance: boolean;
        analytics: boolean;
    };
}
export interface LocationVerificationAttempt {
    id: number;
    invitationId: number;
    attemptedAt: Date;
    clientLat: number;
    clientLng: number;
    distanceMeters: number;
    verificationMethod: LocationVerificationMethod;
    success: boolean;
    spoofingIndicators: SpoofingIndicators;
    clientIp: string;
    userAgent: string;
    accuracyMeters?: number;
    altitude?: number;
    heading?: number;
    speed?: number;
}
export interface SpoofingIndicators {
    vpnDetected: boolean;
    proxyDetected: boolean;
    torDetected: boolean;
    datacenterIp: boolean;
    gpsSpofingLikely: boolean;
    deviceTimeInconsistent: boolean;
    suspiciousUserAgent: boolean;
    rapidLocationChanges: boolean;
    impossibleSpeed: boolean;
    consistentGpsAccuracy: boolean;
}
export interface DeviceFingerprint {
    id: number;
    invitationId: number;
    createdAt: Date;
    fingerprint: string;
    userAgent: string;
    screenResolution: string;
    timezone: string;
    language: string;
    platform: string;
    cookieEnabled: boolean;
    doNotTrack: boolean;
    plugins: string[];
    canvas?: string;
    webgl?: string;
    audioContext?: string;
}
export interface CourierEvent {
    id: number;
    invitationId: number;
    courier: CourierProvider;
    trackingNumber: string;
    eventType: CourierEventType;
    eventTimestamp: Date;
    eventLocation?: string;
    description: string;
    rawWebhookData: Record<string, any>;
    signatureData?: {
        signedBy: string;
        signatureImage?: string;
        signatureDate: Date;
    };
}
export type CourierEventType = 'created' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivery_attempted' | 'delivered' | 'exception' | 'returned';
export interface TrialSession {
    id: number;
    invitationId: number;
    startedAt: Date;
    endsAt: Date;
    lastActivityAt: Date;
    totalSessions: number;
    totalDuration: number;
    featuresUsed: string[];
    conversionCampaignsSent: string[];
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
}
export interface ConversionAnalytics {
    id: number;
    invitationId: number;
    invitationSentAt?: Date;
    courierPickupAt?: Date;
    deliveryAt?: Date;
    firstLocationAttemptAt?: Date;
    activationAt?: Date;
    trialStartAt?: Date;
    conversionAt?: Date;
    deliveryDurationHours?: number;
    activationDurationHours?: number;
    trialDurationDays?: number;
    totalPageViews: number;
    uniqueSessions: number;
    averageSessionDuration: number;
    featuresExplored: string[];
    lastTouchChannel?: string;
    conversionSource?: string;
    conversionCampaign?: string;
    subscriptionTier?: string;
    monthlyValue?: number;
    lifetimeValue?: number;
    activationCity?: string;
    activationCountry?: string;
    deviceType?: string;
    browserType?: string;
}
export interface CreateInvitationRequest {
    businessType: BusinessType;
    tier: InvitationTier;
    recipientDetails: {
        name: string;
        title: string;
        company: string;
        address: string;
        email?: string;
        mobile?: string;
        registrationNumber?: string;
    };
    activationLocation: {
        coordinates: {
            lat: number;
            lng: number;
        };
        radius?: number;
        alternativeLocations?: Array<{
            lat: number;
            lng: number;
            name: string;
            radius?: number;
        }>;
    };
    deliveryMethod: CourierProvider;
    expirationHours?: number;
    trialDays?: number;
    platformAccess?: {
        pmsAdmin?: boolean;
        marketplace?: boolean;
        compliance?: boolean;
        analytics?: boolean;
    };
}
export interface LocationValidationRequest {
    invitationNumber: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    accuracy?: number;
    altitude?: number;
    heading?: number;
    speed?: number;
    timestamp: number;
    deviceInfo: {
        userAgent: string;
        timezone: string;
        language: string;
        platform: string;
    };
}
export interface ActivationRequest {
    invitationNumber: string;
    verificationCode: string;
    deviceFingerprint: DeviceFingerprint;
    acceptTerms: boolean;
}
export interface InvitationMapData {
    invitations: Array<{
        invitationNumber: string;
        status: InvitationStatus;
        coordinates: {
            lat: number;
            lng: number;
        };
        recipientCompany: string;
        businessType: BusinessType;
        tier: InvitationTier;
        createdAt: Date;
        activatedAt?: Date;
        trialEndsAt?: Date;
    }>;
}
export interface AnalyticsDashboard {
    overview: {
        totalInvitations: number;
        totalDelivered: number;
        totalActivated: number;
        totalConverted: number;
        conversionRate: number;
        averageTrialDuration: number;
    };
    funnelData: {
        stage: string;
        count: number;
        percentage: number;
        dropoffRate: number;
    }[];
    geographicData: {
        city: string;
        invitations: number;
        activations: number;
        conversions: number;
        conversionRate: number;
    }[];
    businessTypeData: {
        businessType: BusinessType;
        invitations: number;
        activations: number;
        conversions: number;
        avgRevenuePerUser: number;
    }[];
    timeSeriesData: {
        date: string;
        invitationsSent: number;
        activations: number;
        conversions: number;
        revenue: number;
    }[];
}
export interface APIError {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: Date;
    requestId: string;
}
export interface CyprusBusinessRegistry {
    registrationNumber: string;
    companyName: string;
    registeredAddress: string;
    directors: Array<{
        name: string;
        role: string;
        appointmentDate: Date;
    }>;
    incorporationDate: Date;
    status: 'active' | 'dissolved' | 'suspended';
    businessType: string;
    authorizedCapital: number;
    vatNumber?: string;
}
export interface WebhookPayload {
    event: string;
    invitationNumber: string;
    timestamp: Date;
    data: Record<string, any>;
    signature: string;
}
export interface GeofencingConfig {
    defaultRadius: number;
    maxRadius: number;
    minRadius: number;
    verificationMethods: LocationVerificationMethod[];
    antiSpoofingEnabled: boolean;
    vpnDetectionEnabled: boolean;
    deviceFingerprintingEnabled: boolean;
}
export interface TrialConfig {
    defaultDays: number;
    warningDays: number;
    countdownUpdateInterval: number;
    urgencyThresholds: {
        high: number;
        critical: number;
    };
}
//# sourceMappingURL=index.d.ts.map