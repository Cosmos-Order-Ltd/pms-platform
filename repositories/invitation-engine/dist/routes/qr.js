"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const qrCode_1 = require("../services/qrCode");
const geofencing_1 = require("../services/geofencing");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = (0, express_1.Router)();
const qrService = new qrCode_1.QRCodeService();
const geofencingService = new geofencing_1.GeofencingService();
const qrRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Too many QR operations. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
const activationRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: { error: 'Too many activation attempts. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
router.post('/generate', qrRateLimit, async (req, res) => {
    try {
        const { invitationNumber, expirationHours = 72, smsVerification = true, deviceBinding = true, locationRequired = true } = req.body;
        if (!invitationNumber) {
            return res.status(400).json({
                success: false,
                error: 'Invitation number is required'
            });
        }
        const invitationPattern = /^CY[HRC]-\d{3}$/;
        if (!invitationPattern.test(invitationNumber)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid invitation number format. Expected: CYH-001, CYR-002, or CYC-003'
            });
        }
        const result = await qrService.generateQRCode({
            invitationNumber,
            expirationHours,
            smsVerification,
            deviceBinding,
            locationRequired
        });
        res.json({
            success: true,
            data: {
                activationURL: result.activationURL,
                qrCodeDataURL: result.qrCodeDataURL,
                metadata: {
                    invitationNumber: result.qrData.invitationNumber,
                    generated: new Date(result.qrData.timestamp),
                    expires: new Date(Date.now() + expirationHours * 60 * 60 * 1000),
                    encrypted: result.qrData.encrypted,
                    checksum: result.qrData.checksum
                }
            }
        });
    }
    catch (error) {
        console.error('QR generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate QR code'
        });
    }
});
router.get('/:invitationNumber', async (req, res) => {
    try {
        const { invitationNumber } = req.params;
        const { token } = req.query;
        if (!token) {
            return res.status(400).send(`
        <html>
          <head><title>Invalid QR Code</title></head>
          <body>
            <h1>❌ Invalid QR Code</h1>
            <p>This QR code appears to be invalid or corrupted.</p>
          </body>
        </html>
      `);
        }
        const validation = await qrService.validateQRCode(token);
        if (!validation.valid) {
            return res.status(400).send(`
        <html>
          <head>
            <title>QR Code Error</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
              .error { color: #e53e3e; }
              .container { max-width: 400px; margin: 0 auto; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1 class="error">❌ QR Code Error</h1>
              <p><strong>Error:</strong> ${validation.error}</p>
              ${validation.expired ? '<p>This invitation has expired.</p>' : ''}
              ${validation.tampered ? '<p>This QR code appears to have been tampered with.</p>' : ''}
              ${validation.alreadyUsed ? '<p>This invitation has already been activated.</p>' : ''}
            </div>
          </body>
        </html>
      `);
        }
        const activationHTML = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cyprus PMS - Activate Invitation ${invitationNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .container {
              background: white;
              border-radius: 20px;
              padding: 40px 30px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              max-width: 420px;
              width: 100%;
              text-align: center;
            }
            .logo {
              font-size: 2em;
              margin-bottom: 10px;
              color: #1a365d;
            }
            h1 {
              color: #2d3748;
              margin-bottom: 10px;
              font-size: 1.5em;
            }
            .invitation-number {
              background: #f7fafc;
              padding: 10px 20px;
              border-radius: 10px;
              font-family: monospace;
              font-size: 1.2em;
              font-weight: bold;
              color: #1a365d;
              margin: 20px 0;
            }
            .step {
              margin: 25px 0;
              text-align: left;
            }
            .step-title {
              font-weight: bold;
              color: #2d3748;
              margin-bottom: 10px;
              display: flex;
              align-items: center;
            }
            .step-number {
              background: #667eea;
              color: white;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 0.8em;
              margin-right: 10px;
            }
            button {
              background: #667eea;
              color: white;
              border: none;
              padding: 15px 30px;
              border-radius: 10px;
              font-size: 1em;
              cursor: pointer;
              transition: all 0.3s;
              width: 100%;
              margin: 10px 0;
            }
            button:hover { background: #5a67d8; transform: translateY(-2px); }
            button:disabled { background: #a0aec0; cursor: not-allowed; transform: none; }
            .status {
              padding: 15px;
              border-radius: 10px;
              margin: 15px 0;
              display: none;
            }
            .status.success { background: #f0fff4; color: #22543d; border: 1px solid #9ae6b4; }
            .status.error { background: #fed7d7; color: #742a2a; border: 1px solid #fc8181; }
            .status.info { background: #ebf8ff; color: #2c5282; border: 1px solid #90cdf4; }
            input {
              width: 100%;
              padding: 12px;
              border: 2px solid #e2e8f0;
              border-radius: 8px;
              font-size: 1em;
              margin: 8px 0;
            }
            input:focus { outline: none; border-color: #667eea; }
            .metadata {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 10px;
              margin: 20px 0;
              font-size: 0.9em;
              text-align: left;
            }
            .requirement {
              display: flex;
              align-items: center;
              margin: 8px 0;
              font-size: 0.9em;
            }
            .requirement-icon {
              margin-right: 8px;
              width: 16px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🏛️</div>
            <h1>Cyprus PMS Platform</h1>
            <p style="color: #718096; margin-bottom: 20px;">Exclusive Business Invitation</p>

            <div class="invitation-number">${invitationNumber}</div>

            <div class="metadata">
              <div class="requirement">
                <span class="requirement-icon">${validation.metadata?.smsRequired ? '📱' : '✅'}</span>
                SMS Verification: ${validation.metadata?.smsRequired ? 'Required' : 'Optional'}
              </div>
              <div class="requirement">
                <span class="requirement-icon">${validation.metadata?.locationRequired ? '📍' : '✅'}</span>
                Location Verification: ${validation.metadata?.locationRequired ? 'Required' : 'Optional'}
              </div>
              <div class="requirement">
                <span class="requirement-icon">${validation.metadata?.deviceBinding ? '🔒' : '✅'}</span>
                Device Binding: ${validation.metadata?.deviceBinding ? 'Enabled' : 'Disabled'}
              </div>
              ${validation.metadata?.expires ? `
                <div class="requirement">
                  <span class="requirement-icon">⏰</span>
                  Expires: ${new Date(validation.metadata.expires).toLocaleString()}
                </div>
              ` : ''}
            </div>

            <div class="step">
              <div class="step-title">
                <span class="step-number">1</span>
                Enable Location Services
              </div>
              <p style="color: #718096; font-size: 0.9em;">
                Allow this page to access your location to verify you're at the authorized business location.
              </p>
              <button onclick="requestLocation()" id="locationBtn">
                📍 Enable Location Access
              </button>
            </div>

            ${validation.metadata?.smsRequired ? `
              <div class="step">
                <div class="step-title">
                  <span class="step-number">2</span>
                  Phone Verification
                </div>
                <input type="tel" id="phoneNumber" placeholder="Enter your phone number" />
                <button onclick="sendSMSCode()" id="smsBtn" disabled>
                  📱 Send Verification Code
                </button>
                <input type="text" id="smsCode" placeholder="Enter 6-digit code" style="display: none;" />
                <button onclick="verifySMSCode()" id="verifyBtn" style="display: none;">
                  ✅ Verify Code
                </button>
              </div>
            ` : ''}

            <div class="step">
              <div class="step-title">
                <span class="step-number">${validation.metadata?.smsRequired ? '3' : '2'}</span>
                Activate Invitation
              </div>
              <button onclick="activateInvitation()" id="activateBtn" disabled>
                🚀 Activate Cyprus PMS Access
              </button>
            </div>

            <div class="status" id="statusDiv"></div>
          </div>

          <script>
            let locationGranted = false;
            let smsVerified = ${!validation.metadata?.smsRequired};
            let userLocation = null;
            let smsCodeId = null;

            function showStatus(message, type) {
              const statusDiv = document.getElementById('statusDiv');
              statusDiv.textContent = message;
              statusDiv.className = 'status ' + type;
              statusDiv.style.display = 'block';
            }

            function requestLocation() {
              const btn = document.getElementById('locationBtn');
              btn.disabled = true;
              btn.textContent = '📍 Getting location...';

              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    userLocation = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                      accuracy: position.coords.accuracy
                    };
                    locationGranted = true;
                    btn.textContent = '✅ Location Enabled';
                    btn.style.background = '#38a169';
                    showStatus('Location access granted successfully!', 'success');
                    checkActivationReady();
                  },
                  (error) => {
                    btn.disabled = false;
                    btn.textContent = '📍 Enable Location Access';
                    showStatus('Location access is required for activation. Please enable location services.', 'error');
                  },
                  { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
                );
              } else {
                btn.disabled = false;
                btn.textContent = '📍 Enable Location Access';
                showStatus('Geolocation is not supported by this browser.', 'error');
              }
            }

            async function sendSMSCode() {
              const phoneNumber = document.getElementById('phoneNumber').value;
              if (!phoneNumber) {
                showStatus('Please enter your phone number.', 'error');
                return;
              }

              const btn = document.getElementById('smsBtn');
              btn.disabled = true;
              btn.textContent = '📱 Sending...';

              try {
                const response = await fetch('/api/qr/sms/send', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    invitationNumber: '${invitationNumber}',
                    phoneNumber: phoneNumber
                  })
                });

                const result = await response.json();

                if (result.success) {
                  smsCodeId = result.codeId;
                  btn.style.display = 'none';
                  document.getElementById('smsCode').style.display = 'block';
                  document.getElementById('verifyBtn').style.display = 'block';
                  showStatus('Verification code sent! Please check your phone.', 'success');
                } else {
                  btn.disabled = false;
                  btn.textContent = '📱 Send Verification Code';
                  showStatus(result.error || 'Failed to send SMS code.', 'error');
                }
              } catch (error) {
                btn.disabled = false;
                btn.textContent = '📱 Send Verification Code';
                showStatus('Network error. Please try again.', 'error');
              }
            }

            async function verifySMSCode() {
              const smsCode = document.getElementById('smsCode').value;
              if (!smsCode || smsCode.length !== 6) {
                showStatus('Please enter the 6-digit verification code.', 'error');
                return;
              }

              const btn = document.getElementById('verifyBtn');
              btn.disabled = true;
              btn.textContent = '✅ Verifying...';

              try {
                const response = await fetch('/api/qr/sms/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    codeId: smsCodeId,
                    code: smsCode
                  })
                });

                const result = await response.json();

                if (result.valid) {
                  smsVerified = true;
                  btn.textContent = '✅ Verified';
                  btn.style.background = '#38a169';
                  showStatus('Phone number verified successfully!', 'success');
                  checkActivationReady();
                } else {
                  btn.disabled = false;
                  btn.textContent = '✅ Verify Code';
                  showStatus(result.error || 'Invalid verification code.', 'error');
                }
              } catch (error) {
                btn.disabled = false;
                btn.textContent = '✅ Verify Code';
                showStatus('Network error. Please try again.', 'error');
              }
            }

            async function activateInvitation() {
              const btn = document.getElementById('activateBtn');
              btn.disabled = true;
              btn.textContent = '🚀 Activating...';

              try {
                const response = await fetch('/api/qr/activate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    invitationNumber: '${invitationNumber}',
                    token: '${token}',
                    deviceFingerprint: generateDeviceFingerprint(),
                    locationData: userLocation,
                    activationTime: Date.now()
                  })
                });

                const result = await response.json();

                if (result.success && result.accessGranted) {
                  btn.textContent = '🎉 Activated Successfully!';
                  btn.style.background = '#38a169';

                  showStatus(\`
                    🎊 Welcome to Cyprus PMS Platform!
                    \${result.trialStarted ? 'Your trial period has started.' : ''}
                    You now have access to: \${Object.keys(result.platformAccess || {}).filter(k => result.platformAccess[k]).join(', ')}.
                  \`, 'success');

                  // Redirect to platform after 3 seconds
                  setTimeout(() => {
                    window.location.href = 'https://pms.cyprus.com/dashboard';
                  }, 3000);
                } else {
                  btn.disabled = false;
                  btn.textContent = '🚀 Activate Cyprus PMS Access';
                  showStatus(result.error || 'Activation failed. Please try again.', 'error');
                }
              } catch (error) {
                btn.disabled = false;
                btn.textContent = '🚀 Activate Cyprus PMS Access';
                showStatus('Network error. Please try again.', 'error');
              }
            }

            function checkActivationReady() {
              const activateBtn = document.getElementById('activateBtn');
              if (locationGranted && smsVerified) {
                activateBtn.disabled = false;
                document.getElementById('smsBtn').disabled = false;
              }
            }

            function generateDeviceFingerprint() {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              ctx.textBaseline = 'top';
              ctx.font = '14px Arial';
              ctx.fillText('Device fingerprint', 2, 2);

              return btoa(JSON.stringify({
                userAgent: navigator.userAgent,
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                screen: \`\${screen.width}x\${screen.height}\`,
                canvas: canvas.toDataURL(),
                timestamp: Date.now()
              }));
            }

            // Enable phone input when location is granted
            document.getElementById('phoneNumber').addEventListener('input', function() {
              if (this.value && locationGranted) {
                document.getElementById('smsBtn').disabled = false;
              }
            });
          </script>
        </body>
      </html>
    `;
        res.send(activationHTML);
    }
    catch (error) {
        console.error('QR landing page error:', error);
        res.status(500).send('<h1>Server Error</h1><p>Please try again later.</p>');
    }
});
router.post('/sms/send', qrRateLimit, async (req, res) => {
    try {
        const { invitationNumber, phoneNumber } = req.body;
        if (!invitationNumber || !phoneNumber) {
            return res.status(400).json({
                success: false,
                error: 'Invitation number and phone number are required'
            });
        }
        const result = await qrService.generateSMSCode(invitationNumber, phoneNumber);
        res.json(result);
    }
    catch (error) {
        console.error('SMS send error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send SMS code'
        });
    }
});
router.post('/sms/verify', qrRateLimit, async (req, res) => {
    try {
        const { codeId, code } = req.body;
        if (!codeId || !code) {
            return res.status(400).json({
                valid: false,
                error: 'Code ID and verification code are required'
            });
        }
        const result = await qrService.verifySMSCode(codeId, code);
        res.json(result);
    }
    catch (error) {
        console.error('SMS verify error:', error);
        res.status(500).json({
            valid: false,
            error: 'Failed to verify SMS code'
        });
    }
});
router.post('/activate', activationRateLimit, async (req, res) => {
    try {
        const { invitationNumber, token, deviceFingerprint, locationData, activationTime } = req.body;
        if (!invitationNumber || !token || !deviceFingerprint) {
            return res.status(400).json({
                success: false,
                accessGranted: false,
                error: 'Missing required activation data'
            });
        }
        const qrValidation = await qrService.validateQRCode(token);
        if (!qrValidation.valid) {
            return res.status(400).json({
                success: false,
                accessGranted: false,
                error: qrValidation.error || 'Invalid QR token'
            });
        }
        if (qrValidation.metadata?.locationRequired && locationData) {
            const locationRequest = {
                invitationNumber,
                coordinates: locationData,
                timestamp: activationTime || Date.now(),
                deviceInfo: {
                    userAgent: req.headers['user-agent'] || '',
                    timezone: 'UTC',
                    language: req.headers['accept-language'] || '',
                    platform: 'web'
                },
                clientIp: req.ip || req.connection.remoteAddress,
                deviceFingerprint
            };
            const locationResult = await geofencingService.verifyLocation(1, locationRequest);
            if (!locationResult.success) {
                return res.status(403).json({
                    success: false,
                    accessGranted: false,
                    error: 'Location verification failed. Please ensure you are at the authorized business location.'
                });
            }
        }
        const activationResult = await qrService.activateInvitation(invitationNumber, {
            deviceFingerprint,
            locationData,
            userDetails: {
                ip: req.ip,
                userAgent: req.headers['user-agent'],
                activationTime
            }
        });
        res.json(activationResult);
    }
    catch (error) {
        console.error('Activation error:', error);
        res.status(500).json({
            success: false,
            accessGranted: false,
            error: 'Activation failed due to server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=qr.js.map