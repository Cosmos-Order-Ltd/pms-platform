/**
 * Cyprus Access Control (CAC) - Core Type Definitions
 * Geofenced Invitation Orchestration Service
 */

// Business Types
export type BusinessType = 'hotel' | 'real_estate' | 'company' | 'restaurant' | 'retail';
export type InvitationTier = 'founder' | 'early_access' | 'beta' | 'standard';
export type InvitationStatus = 'created' | 'sent' | 'delivered' | 'activated' | 'trial' | 'converted' | 'expired';
export type CourierProvider = 'DHL' | 'UPS' | 'FedEx' | 'HandDelivered';
export type LocationVerificationMethod = 'gps' | 'wifi' | 'ip' | 'cell_tower' | 'hybrid';

// Core Invitation Interface
export interface InvitationConfig {
  businessType: BusinessType;
  recipientDetails: {
    name: string;
    title: string;
    company: string;
    address: string;
    email?: string;
    mobile?: string;
    registrationNumber?: string; // Cyprus business registration
  };

  // Geofencing configuration
  activationLocation: {
    coordinates: { lat: number; lng: number };
    radius: number; // meters
    alternativeLocations?: Array<{
      lat: number;
      lng: number;
      name: string;
      radius?: number;
    }>;
    wifiNetworks?: string[];
    ipRanges?: string[];
    allowedCountries?: string[]; // Default: ['CY']
  };

  // Access configuration
  invitationNumber: string; // Format: CYH-001, CYR-001, CYC-001
  tier: InvitationTier;
  expirationHours: number; // From signature
  trialDays: number; // After activation

  // Courier configuration
  deliveryMethod: CourierProvider;
  signatureRequired: boolean;
  trackingWebhooks: boolean;
  expedited?: boolean;

  // Business-specific configuration
  platformAccess?: {
    pmsAdmin?: boolean;
    marketplace?: boolean;
    compliance?: boolean;
    analytics?: boolean;
  };
}

// Database Models
export interface Invitation {
  id: number;
  invitationNumber: string;
  businessType: BusinessType;
  tier: InvitationTier;
  status: InvitationStatus;

  // Recipient information
  recipientName: string;
  recipientTitle: string;
  recipientCompany: string;
  recipientAddress: string;
  recipientEmail?: string;
  recipientMobile?: string;
  businessRegistrationNumber?: string;

  // Geofencing data
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

  // Timestamps
  createdAt: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  signatureReceived?: string;
  activatedAt?: Date;
  trialEndsAt?: Date;
  convertedAt?: Date;
  expiredAt?: Date;

  // Analytics
  deliveryAttempts: number;
  activationAttempts: number;
  failedLocationAttempts: LocationVerificationAttempt[];
  deviceFingerprints: DeviceFingerprint[];
  totalPageViews: number;
  lastSeenAt?: Date;

  // Configuration
  expirationHours: number;
  trialDays: number;
  deliveryMethod: CourierProvider;
  signatureRequired: boolean;
  trackingWebhooks: boolean;

  // Platform access
  platformAccess: {
    pmsAdmin: boolean;
    marketplace: boolean;
    compliance: boolean;
    analytics: boolean;
  };
}

// Location Verification
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

// Anti-Spoofing Detection
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
  consistentGpsAccuracy: boolean; // Too consistent = spoofed
}

// Device Fingerprinting
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

// Courier Tracking
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

export type CourierEventType =
  | 'created'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivery_attempted'
  | 'delivered'
  | 'exception'
  | 'returned';

// Trial Management
export interface TrialSession {
  id: number;
  invitationId: number;
  startedAt: Date;
  endsAt: Date;
  lastActivityAt: Date;
  totalSessions: number;
  totalDuration: number; // seconds
  featuresUsed: string[];
  conversionCampaignsSent: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

// Analytics and Conversion
export interface ConversionAnalytics {
  id: number;
  invitationId: number;

  // Funnel metrics
  invitationSentAt?: Date;
  courierPickupAt?: Date;
  deliveryAt?: Date;
  firstLocationAttemptAt?: Date;
  activationAt?: Date;
  trialStartAt?: Date;
  conversionAt?: Date;

  // Performance metrics
  deliveryDurationHours?: number;
  activationDurationHours?: number;
  trialDurationDays?: number;

  // Engagement metrics
  totalPageViews: number;
  uniqueSessions: number;
  averageSessionDuration: number;
  featuresExplored: string[];

  // Conversion attribution
  lastTouchChannel?: string;
  conversionSource?: string;
  conversionCampaign?: string;

  // Revenue metrics
  subscriptionTier?: string;
  monthlyValue?: number;
  lifetimeValue?: number;

  // Geographic data
  activationCity?: string;
  activationCountry?: string;
  deviceType?: string;
  browserType?: string;
}

// API Request/Response Types
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
    coordinates: { lat: number; lng: number };
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
  coordinates: { lat: number; lng: number };
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

// Admin Dashboard Types
export interface InvitationMapData {
  invitations: Array<{
    invitationNumber: string;
    status: InvitationStatus;
    coordinates: { lat: number; lng: number };
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

// Error Types
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  requestId: string;
}

// Cyprus-Specific Types
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

// Webhook Types
export interface WebhookPayload {
  event: string;
  invitationNumber: string;
  timestamp: Date;
  data: Record<string, any>;
  signature: string;
}

// Configuration Types
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
    high: number; // days
    critical: number; // days
  };
}