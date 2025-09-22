/**
 * Cyprus Access Control (CAC) - QR Code Intelligence System
 * Advanced QR code generation with embedded security and one-time activation
 */

import QRCode from 'qrcode';
import crypto from 'crypto';
import { promisify } from 'util';
import { QRCodeData } from '../types/extended';

const randomBytes = promisify(crypto.randomBytes);

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

export class QRCodeService {
  private readonly encryptionKey: Buffer;
  private readonly algorithm = 'aes-256-gcm';

  constructor() {
    // Use environment key or generate one for development
    const keyString = process.env.QR_ENCRYPTION_KEY || 'default-dev-key-change-in-production';
    this.encryptionKey = crypto.scryptSync(keyString, 'salt', 32);
  }

  /**
   * Generate secure QR code with embedded invitation data
   */
  async generateQRCode(options: QRGenerationOptions): Promise<{
    qrCodeBuffer: Buffer;
    qrCodeDataURL: string;
    activationURL: string;
    qrData: QRCodeData;
  }> {
    try {
      // Create QR data payload
      const timestamp = Date.now();
      const expirationTime = timestamp + (options.expirationHours || 72) * 60 * 60 * 1000;

      const qrData: QRCodeData = {
        invitationNumber: options.invitationNumber,
        timestamp,
        encrypted: true,
        checksum: ''
      };

      // Add expiration and security metadata
      const metadata = {
        exp: expirationTime,
        sms: options.smsVerification || false,
        bind: options.deviceBinding || false,
        loc: options.locationRequired || true,
        nonce: (await randomBytes(16)).toString('hex')
      };

      // Encrypt the payload
      const payload = JSON.stringify({ ...qrData, ...metadata });
      const encryptedData = this.encryptData(payload);

      // Generate checksum for tamper detection
      const checksum = crypto
        .createHash('sha256')
        .update(encryptedData + options.invitationNumber)
        .digest('hex')
        .substring(0, 16);

      qrData.checksum = checksum;

      // Create final QR payload
      const finalPayload = {
        d: encryptedData,
        c: checksum,
        v: '1.0' // version
      };

      // Generate activation URL
      const activationURL = `https://pms.cyprus.com/qr/${options.invitationNumber}?token=${Buffer.from(JSON.stringify(finalPayload)).toString('base64url')}`;

      // Generate QR code
      const qrCodeDataURL = await QRCode.toDataURL(activationURL, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.92,
        margin: 2,
        color: {
          dark: '#1a365d',  // Cyprus blue
          light: '#ffffff'
        },
        width: 300
      });

      const qrCodeBuffer = await QRCode.toBuffer(activationURL, {
        errorCorrectionLevel: 'H',
        type: 'png',
        quality: 0.92,
        margin: 2,
        color: {
          dark: '#1a365d',
          light: '#ffffff'
        },
        width: 300
      });

      return {
        qrCodeBuffer,
        qrCodeDataURL,
        activationURL,
        qrData
      };

    } catch (error) {
      throw new Error(`QR code generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate QR code data and extract invitation information
   */
  async validateQRCode(qrToken: string): Promise<QRValidationResult> {
    try {
      // Decode base64url token
      const tokenData = JSON.parse(Buffer.from(qrToken, 'base64url').toString());

      if (!tokenData.d || !tokenData.c || !tokenData.v) {
        return { valid: false, error: 'Invalid QR token format' };
      }

      // Verify checksum first
      const expectedChecksum = tokenData.c;

      // Decrypt data
      const decryptedPayload = this.decryptData(tokenData.d);
      const qrData = JSON.parse(decryptedPayload);

      // Verify checksum matches
      const calculatedChecksum = crypto
        .createHash('sha256')
        .update(tokenData.d + qrData.invitationNumber)
        .digest('hex')
        .substring(0, 16);

      if (calculatedChecksum !== expectedChecksum) {
        return { valid: false, tampered: true, error: 'QR code tampered' };
      }

      // Check expiration
      if (qrData.exp && Date.now() > qrData.exp) {
        return {
          valid: false,
          expired: true,
          invitationNumber: qrData.invitationNumber,
          error: 'QR code expired'
        };
      }

      return {
        valid: true,
        invitationNumber: qrData.invitationNumber,
        metadata: {
          smsRequired: qrData.sms,
          deviceBinding: qrData.bind,
          locationRequired: qrData.loc,
          generated: new Date(qrData.timestamp),
          expires: qrData.exp ? new Date(qrData.exp) : null
        }
      };

    } catch (error) {
      return {
        valid: false,
        error: `QR validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Activate invitation and grant platform access
   */
  async activateInvitation(
    invitationNumber: string,
    activationData: {
      deviceFingerprint: string;
      locationData?: any;
      smsCode?: string;
      userDetails?: any;
    }
  ): Promise<ActivationResult> {
    try {
      // This would integrate with the main invitation database
      // For now, we'll simulate the activation logic

      // Verify invitation exists and is not already activated
      const invitation = await this.getInvitationDetails(invitationNumber);

      if (!invitation) {
        return { success: false, accessGranted: false, error: 'Invitation not found' };
      }

      if (invitation.activated) {
        return { success: false, accessGranted: false, error: 'Invitation already activated' };
      }

      // Determine platform access based on invitation tier
      const platformAccess = this.determinePlatformAccess(invitation.tier, invitation.businessType);

      // Mark invitation as activated
      await this.markInvitationActivated(invitationNumber, activationData);

      // Start trial period if applicable
      const trialStarted = invitation.trialDays > 0;
      if (trialStarted) {
        await this.startTrialPeriod(invitationNumber, invitation.trialDays);
      }

      return {
        success: true,
        accessGranted: true,
        trialStarted,
        platformAccess
      };

    } catch (error) {
      return {
        success: false,
        accessGranted: false,
        error: `Activation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Generate SMS verification code for two-factor activation
   */
  async generateSMSCode(invitationNumber: string, phoneNumber: string): Promise<{
    success: boolean;
    codeId: string;
    expiresIn: number;
    error?: string;
  }> {
    try {
      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const codeId = crypto.randomUUID();
      const expiresIn = 10 * 60 * 1000; // 10 minutes

      // Store code temporarily (would use Redis in production)
      await this.storeSMSCode(codeId, code, invitationNumber, expiresIn);

      // Send SMS (would integrate with SMS provider)
      await this.sendSMS(phoneNumber, `Your Cyprus PMS activation code: ${code}. Valid for 10 minutes.`);

      return {
        success: true,
        codeId,
        expiresIn
      };

    } catch (error) {
      return {
        success: false,
        codeId: '',
        expiresIn: 0,
        error: `SMS generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Verify SMS code during activation
   */
  async verifySMSCode(codeId: string, code: string): Promise<{
    valid: boolean;
    invitationNumber?: string;
    error?: string;
  }> {
    try {
      const storedData = await this.getSMSCode(codeId);

      if (!storedData) {
        return { valid: false, error: 'Invalid or expired code' };
      }

      if (storedData.code !== code) {
        return { valid: false, error: 'Incorrect code' };
      }

      // Remove used code
      await this.removeSMSCode(codeId);

      return {
        valid: true,
        invitationNumber: storedData.invitationNumber
      };

    } catch (error) {
      return {
        valid: false,
        error: `SMS verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Private helper methods
  private encryptData(data: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.encryptionKey);
    cipher.setAAD(Buffer.from('cyprus-pms-qr', 'utf8'));

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  }

  private decryptData(encryptedData: string): string {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];

    const decipher = crypto.createDecipher(this.algorithm, this.encryptionKey);
    decipher.setAAD(Buffer.from('cyprus-pms-qr', 'utf8'));
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  private determinePlatformAccess(tier: string, businessType: string) {
    // Access matrix based on invitation tier and business type
    const accessMatrix = {
      founder: { pmsAdmin: true, marketplace: true, compliance: true, analytics: true },
      early_access: { pmsAdmin: true, marketplace: true, compliance: true, analytics: false },
      beta: { pmsAdmin: true, marketplace: false, compliance: true, analytics: false },
      standard: { pmsAdmin: false, marketplace: false, compliance: true, analytics: false }
    };

    return accessMatrix[tier as keyof typeof accessMatrix] || accessMatrix.standard;
  }

  // Placeholder methods for database integration
  private async getInvitationDetails(invitationNumber: string) {
    // Would query the invitations table
    return {
      id: 1,
      invitationNumber,
      activated: false,
      tier: 'founder',
      businessType: 'hotel',
      trialDays: 30
    };
  }

  private async markInvitationActivated(invitationNumber: string, activationData: any) {
    // Would update the invitations table
    console.log(`Marking invitation ${invitationNumber} as activated`);
  }

  private async startTrialPeriod(invitationNumber: string, trialDays: number) {
    // Would create trial record
    console.log(`Starting ${trialDays}-day trial for ${invitationNumber}`);
  }

  private async storeSMSCode(codeId: string, code: string, invitationNumber: string, expiresIn: number) {
    // Would store in Redis with TTL
    console.log(`Storing SMS code ${code} for invitation ${invitationNumber}`);
  }

  private async getSMSCode(codeId: string) {
    // Would retrieve from Redis
    return { code: '123456', invitationNumber: 'CYH-001' };
  }

  private async removeSMSCode(codeId: string) {
    // Would delete from Redis
    console.log(`Removing SMS code ${codeId}`);
  }

  private async sendSMS(phoneNumber: string, message: string) {
    // Would integrate with SMS provider (Twilio, etc.)
    console.log(`Sending SMS to ${phoneNumber}: ${message}`);
  }
}