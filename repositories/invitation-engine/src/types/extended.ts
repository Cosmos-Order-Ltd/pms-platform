/**
 * Cyprus Access Control (CAC) - Extended Type Definitions
 * Additional interfaces for geofencing and services
 */

export interface WiFiNetwork {
  ssid: string;
  bssid: string;
  signalStrength: number;
  frequency?: number;
}

export interface CellTower {
  mcc: number; // Mobile Country Code (Cyprus: 280)
  mnc: number; // Mobile Network Code
  lac: number; // Location Area Code
  cid: number; // Cell ID
  signalStrength?: number;
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
  wifiNetworks?: WiFiNetwork[];
  cellTowers?: CellTower[];
  clientIp?: string;
  deviceFingerprint?: string;
}

export interface GeofencingResult {
  success: boolean;
  method: string;
  distance: number;
  confidence: number;
  spoofingDetected: boolean;
  details: Record<string, any>;
}

export interface QRCodeData {
  invitationNumber: string;
  timestamp: number;
  checksum: string;
  encrypted: boolean;
}

export interface CourierTrackingData {
  trackingNumber: string;
  status: string;
  estimatedDelivery?: Date;
  lastUpdate: Date;
  events: Array<{
    timestamp: Date;
    location?: string;
    description: string;
  }>;
}

export interface TrialCountdownData {
  timeRemaining: number; // seconds
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  warningsSent: string[];
}

export interface BusinessRegistryData {
  registrationNumber: string;
  companyName: string;
  status: 'active' | 'dissolved' | 'suspended';
  registeredAddress: string;
  incorporationDate: Date;
  directors: Array<{
    name: string;
    role: string;
    appointmentDate: Date;
  }>;
}

export interface InvitationGenerationRequest {
  businessType: 'hotel' | 'real_estate' | 'company';
  tier: 'founder' | 'early_access' | 'beta' | 'standard';
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
  deliveryMethod: 'DHL' | 'UPS' | 'FedEx' | 'HandDelivered';
  expirationHours?: number;
  trialDays?: number;
  platformAccess?: {
    pmsAdmin?: boolean;
    marketplace?: boolean;
    compliance?: boolean;
    analytics?: boolean;
  };
}