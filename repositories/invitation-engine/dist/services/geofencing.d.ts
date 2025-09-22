import { LocationVerificationMethod, SpoofingIndicators, LocationValidationRequest } from '../types';
interface LocationVerificationResult {
    success: boolean;
    method: LocationVerificationMethod;
    accuracy: number;
    distance: number;
    spoofingIndicators: SpoofingIndicators;
    confidence: number;
    details: Record<string, any>;
}
declare class GeofencingService {
    private config;
    private ipstackApiKey;
    private googleMapsApiKey;
    constructor();
    verifyLocation(invitationId: number, request: LocationValidationRequest): Promise<LocationVerificationResult>;
    private performMultiVectorVerification;
    private verifyGPSLocation;
    private verifyWiFiLocation;
    private verifyIPLocation;
    private verifyCellTowerLocation;
    private detectSpoofing;
    private selectBestVerificationResult;
    private calculateConfidenceScore;
    private getInvitationDetails;
    private checkImpossibleSpeed;
    private checkConsistentAccuracy;
    private calculateVariance;
    private isSuspiciousUserAgent;
    private checkDeviceTimeConsistency;
    private checkRapidLocationChanges;
    private logVerificationAttempt;
    private getSecurityCheckResults;
}
declare const _default: GeofencingService;
export default _default;
//# sourceMappingURL=geofencing.d.ts.map