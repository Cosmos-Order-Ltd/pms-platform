import { QRCodeData } from '../types/extended';
export interface QRGenerationOptions {
    invitationNumber: string;
    expirationHours?: number;
    smsVerification?: boolean;
    deviceBinding?: boolean;
    locationRequired?: boolean;
}
export interface QRValidationResult {
    valid: boolean;
    invitationNumber?: string;
    expired?: boolean;
    alreadyUsed?: boolean;
    tampered?: boolean;
    error?: string;
    metadata?: any;
}
export interface ActivationResult {
    success: boolean;
    accessGranted: boolean;
    trialStarted?: boolean;
    platformAccess?: {
        pmsAdmin: boolean;
        marketplace: boolean;
        compliance: boolean;
        analytics: boolean;
    };
    error?: string;
}
export declare class QRCodeService {
    private readonly encryptionKey;
    private readonly algorithm;
    constructor();
    generateQRCode(options: QRGenerationOptions): Promise<{
        qrCodeBuffer: Buffer;
        qrCodeDataURL: string;
        activationURL: string;
        qrData: QRCodeData;
    }>;
    validateQRCode(qrToken: string): Promise<QRValidationResult>;
    activateInvitation(invitationNumber: string, activationData: {
        deviceFingerprint: string;
        locationData?: any;
        smsCode?: string;
        userDetails?: any;
    }): Promise<ActivationResult>;
    generateSMSCode(invitationNumber: string, phoneNumber: string): Promise<{
        success: boolean;
        codeId: string;
        expiresIn: number;
        error?: string;
    }>;
    verifySMSCode(codeId: string, code: string): Promise<{
        valid: boolean;
        invitationNumber?: string;
        error?: string;
    }>;
    private encryptData;
    private decryptData;
    private determinePlatformAccess;
    private getInvitationDetails;
    private markInvitationActivated;
    private startTrialPeriod;
    private storeSMSCode;
    private getSMSCode;
    private removeSMSCode;
    private sendSMS;
}
//# sourceMappingURL=qrCode.d.ts.map