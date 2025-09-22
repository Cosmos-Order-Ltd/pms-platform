"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRCodeService = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const crypto_1 = __importDefault(require("crypto"));
const util_1 = require("util");
const randomBytes = (0, util_1.promisify)(crypto_1.default.randomBytes);
class QRCodeService {
    encryptionKey;
    algorithm = 'aes-256-gcm';
    constructor() {
        const keyString = process.env.QR_ENCRYPTION_KEY || 'default-dev-key-change-in-production';
        this.encryptionKey = crypto_1.default.scryptSync(keyString, 'salt', 32);
    }
    async generateQRCode(options) {
        try {
            const timestamp = Date.now();
            const expirationTime = timestamp + (options.expirationHours || 72) * 60 * 60 * 1000;
            const qrData = {
                invitationNumber: options.invitationNumber,
                timestamp,
                encrypted: true,
                checksum: ''
            };
            const metadata = {
                exp: expirationTime,
                sms: options.smsVerification || false,
                bind: options.deviceBinding || false,
                loc: options.locationRequired || true,
                nonce: (await randomBytes(16)).toString('hex')
            };
            const payload = JSON.stringify({ ...qrData, ...metadata });
            const encryptedData = this.encryptData(payload);
            const checksum = crypto_1.default
                .createHash('sha256')
                .update(encryptedData + options.invitationNumber)
                .digest('hex')
                .substring(0, 16);
            qrData.checksum = checksum;
            const finalPayload = {
                d: encryptedData,
                c: checksum,
                v: '1.0'
            };
            const activationURL = `https://pms.cyprus.com/qr/${options.invitationNumber}?token=${Buffer.from(JSON.stringify(finalPayload)).toString('base64url')}`;
            const qrCodeDataURL = await qrcode_1.default.toDataURL(activationURL, {
                errorCorrectionLevel: 'H',
                type: 'image/png',
                quality: 0.92,
                margin: 2,
                color: {
                    dark: '#1a365d',
                    light: '#ffffff'
                },
                width: 300
            });
            const qrCodeBuffer = await qrcode_1.default.toBuffer(activationURL, {
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
        }
        catch (error) {
            throw new Error(`QR code generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async validateQRCode(qrToken) {
        try {
            const tokenData = JSON.parse(Buffer.from(qrToken, 'base64url').toString());
            if (!tokenData.d || !tokenData.c || !tokenData.v) {
                return { valid: false, error: 'Invalid QR token format' };
            }
            const expectedChecksum = tokenData.c;
            const decryptedPayload = this.decryptData(tokenData.d);
            const qrData = JSON.parse(decryptedPayload);
            const calculatedChecksum = crypto_1.default
                .createHash('sha256')
                .update(tokenData.d + qrData.invitationNumber)
                .digest('hex')
                .substring(0, 16);
            if (calculatedChecksum !== expectedChecksum) {
                return { valid: false, tampered: true, error: 'QR code tampered' };
            }
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
        }
        catch (error) {
            return {
                valid: false,
                error: `QR validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
    async activateInvitation(invitationNumber, activationData) {
        try {
            const invitation = await this.getInvitationDetails(invitationNumber);
            if (!invitation) {
                return { success: false, accessGranted: false, error: 'Invitation not found' };
            }
            if (invitation.activated) {
                return { success: false, accessGranted: false, error: 'Invitation already activated' };
            }
            const platformAccess = this.determinePlatformAccess(invitation.tier, invitation.businessType);
            await this.markInvitationActivated(invitationNumber, activationData);
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
        }
        catch (error) {
            return {
                success: false,
                accessGranted: false,
                error: `Activation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
    async generateSMSCode(invitationNumber, phoneNumber) {
        try {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const codeId = crypto_1.default.randomUUID();
            const expiresIn = 10 * 60 * 1000;
            await this.storeSMSCode(codeId, code, invitationNumber, expiresIn);
            await this.sendSMS(phoneNumber, `Your Cyprus PMS activation code: ${code}. Valid for 10 minutes.`);
            return {
                success: true,
                codeId,
                expiresIn
            };
        }
        catch (error) {
            return {
                success: false,
                codeId: '',
                expiresIn: 0,
                error: `SMS generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
    async verifySMSCode(codeId, code) {
        try {
            const storedData = await this.getSMSCode(codeId);
            if (!storedData) {
                return { valid: false, error: 'Invalid or expired code' };
            }
            if (storedData.code !== code) {
                return { valid: false, error: 'Incorrect code' };
            }
            await this.removeSMSCode(codeId);
            return {
                valid: true,
                invitationNumber: storedData.invitationNumber
            };
        }
        catch (error) {
            return {
                valid: false,
                error: `SMS verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
    encryptData(data) {
        const iv = crypto_1.default.randomBytes(16);
        const cipher = crypto_1.default.createCipher(this.algorithm, this.encryptionKey);
        cipher.setAAD(Buffer.from('cyprus-pms-qr', 'utf8'));
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();
        return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
    }
    decryptData(encryptedData) {
        const parts = encryptedData.split(':');
        if (parts.length !== 3) {
            throw new Error('Invalid encrypted data format');
        }
        const iv = Buffer.from(parts[0], 'hex');
        const authTag = Buffer.from(parts[1], 'hex');
        const encrypted = parts[2];
        const decipher = crypto_1.default.createDecipher(this.algorithm, this.encryptionKey);
        decipher.setAAD(Buffer.from('cyprus-pms-qr', 'utf8'));
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    determinePlatformAccess(tier, businessType) {
        const accessMatrix = {
            founder: { pmsAdmin: true, marketplace: true, compliance: true, analytics: true },
            early_access: { pmsAdmin: true, marketplace: true, compliance: true, analytics: false },
            beta: { pmsAdmin: true, marketplace: false, compliance: true, analytics: false },
            standard: { pmsAdmin: false, marketplace: false, compliance: true, analytics: false }
        };
        return accessMatrix[tier] || accessMatrix.standard;
    }
    async getInvitationDetails(invitationNumber) {
        return {
            id: 1,
            invitationNumber,
            activated: false,
            tier: 'founder',
            businessType: 'hotel',
            trialDays: 30
        };
    }
    async markInvitationActivated(invitationNumber, activationData) {
        console.log(`Marking invitation ${invitationNumber} as activated`);
    }
    async startTrialPeriod(invitationNumber, trialDays) {
        console.log(`Starting ${trialDays}-day trial for ${invitationNumber}`);
    }
    async storeSMSCode(codeId, code, invitationNumber, expiresIn) {
        console.log(`Storing SMS code ${code} for invitation ${invitationNumber}`);
    }
    async getSMSCode(codeId) {
        return { code: '123456', invitationNumber: 'CYH-001' };
    }
    async removeSMSCode(codeId) {
        console.log(`Removing SMS code ${codeId}`);
    }
    async sendSMS(phoneNumber, message) {
        console.log(`Sending SMS to ${phoneNumber}: ${message}`);
    }
}
exports.QRCodeService = QRCodeService;
//# sourceMappingURL=qrCode.js.map