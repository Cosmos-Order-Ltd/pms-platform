"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const connection_1 = __importStar(require("../database/connection"));
const types_1 = require("../types");
class GeofencingService {
    config;
    ipstackApiKey;
    googleMapsApiKey;
    constructor() {
        this.config = {
            defaultRadius: parseInt(process.env.DEFAULT_ACTIVATION_RADIUS || '100'),
            maxRadius: parseInt(process.env.MAX_ACTIVATION_RADIUS || '1000'),
            minRadius: parseInt(process.env.MIN_ACTIVATION_RADIUS || '50'),
            verificationMethods: ['gps', 'wifi', 'ip', 'cell_tower'],
            antiSpoofingEnabled: process.env.GPS_SPOOFING_DETECTION_ENABLED === 'true',
            vpnDetectionEnabled: process.env.VPN_DETECTION_ENABLED === 'true',
            deviceFingerprintingEnabled: process.env.DEVICE_FINGERPRINTING_ENABLED === 'true'
        };
        this.ipstackApiKey = process.env.IPSTACK_API_KEY || '';
        this.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || '';
    }
    async verifyLocation(invitationId, request) {
        try {
            const invitation = await this.getInvitationDetails(invitationId);
            if (!invitation) {
                throw new types_1.GeofencingError('Invitation not found');
            }
            const verificationResults = await this.performMultiVectorVerification(request, invitation.activationLat, invitation.activationLng, invitation.activationRadius);
            const bestResult = this.selectBestVerificationResult(verificationResults);
            const isWithinRadius = bestResult.distance <= invitation.activationRadius;
            const spoofingIndicators = await this.detectSpoofing(request, verificationResults);
            const confidence = this.calculateConfidenceScore(bestResult, spoofingIndicators);
            await this.logVerificationAttempt(invitationId, request, bestResult, spoofingIndicators);
            return {
                success: isWithinRadius && confidence > 70 && !spoofingIndicators.gpsSpofingLikely,
                method: bestResult.method,
                accuracy: bestResult.accuracy,
                distance: bestResult.distance,
                spoofingIndicators,
                confidence,
                details: {
                    requiredRadius: invitation.activationRadius,
                    cyprusLocation: (0, connection_1.isCyprusLocation)(request.coordinates.lat, request.coordinates.lng),
                    verificationMethods: verificationResults.map(r => r.method),
                    securityChecks: this.getSecurityCheckResults(spoofingIndicators)
                }
            };
        }
        catch (error) {
            throw new types_1.GeofencingError(`Location verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async performMultiVectorVerification(request, targetLat, targetLng, allowedRadius) {
        const results = [];
        if (this.config.verificationMethods.includes('gps')) {
            const gpsResult = await this.verifyGPSLocation(request, targetLat, targetLng);
            results.push(gpsResult);
        }
        if (this.config.verificationMethods.includes('wifi') && request.wifiNetworks) {
            const wifiResult = await this.verifyWiFiLocation(request.wifiNetworks, targetLat, targetLng);
            if (wifiResult)
                results.push(wifiResult);
        }
        if (this.config.verificationMethods.includes('ip')) {
            const ipResult = await this.verifyIPLocation(request.clientIp || '', targetLat, targetLng);
            if (ipResult)
                results.push(ipResult);
        }
        if (this.config.verificationMethods.includes('cell_tower') && request.cellTowers) {
            const cellResult = await this.verifyCellTowerLocation(request.cellTowers, targetLat, targetLng);
            if (cellResult)
                results.push(cellResult);
        }
        return results;
    }
    async verifyGPSLocation(request, targetLat, targetLng) {
        const distance = (0, connection_1.calculateDistance)(request.coordinates.lat, request.coordinates.lng, targetLat, targetLng);
        const accuracy = request.accuracy || 0;
        const isHighAccuracy = accuracy > 0 && accuracy < 50;
        const isReasonableAccuracy = accuracy < 200;
        const suspiciouslyAccurate = accuracy > 0 && accuracy < 1;
        const impossibleSpeed = this.checkImpossibleSpeed(request);
        const consistentAccuracy = await this.checkConsistentAccuracy(request.invitationNumber, accuracy);
        return {
            success: distance <= 100,
            method: 'gps',
            accuracy,
            distance,
            spoofingIndicators: {
                vpnDetected: false,
                proxyDetected: false,
                torDetected: false,
                datacenterIp: false,
                gpsSpofingLikely: suspiciouslyAccurate || impossibleSpeed || consistentAccuracy,
                deviceTimeInconsistent: false,
                suspiciousUserAgent: false,
                rapidLocationChanges: false,
                impossibleSpeed,
                consistentGpsAccuracy: consistentAccuracy
            },
            confidence: isHighAccuracy ? 95 : isReasonableAccuracy ? 80 : 60,
            details: {
                providedAccuracy: accuracy,
                calculatedDistance: distance,
                highAccuracy: isHighAccuracy,
                suspiciouslyAccurate,
                coordinates: request.coordinates
            }
        };
    }
    async verifyWiFiLocation(wifiNetworks, targetLat, targetLng) {
        try {
            if (!this.googleMapsApiKey || wifiNetworks.length === 0) {
                return null;
            }
            const wifiAccessPoints = wifiNetworks.map(network => ({
                macAddress: network.bssid,
                signalStrength: network.signalStrength,
                age: 0,
                channel: network.frequency ? Math.floor(network.frequency / 5) : undefined
            }));
            const response = await axios_1.default.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${this.googleMapsApiKey}`, {
                wifiAccessPoints,
                considerIp: false
            }, { timeout: 5000 });
            const { location, accuracy } = response.data;
            const distance = (0, connection_1.calculateDistance)(location.lat, location.lng, targetLat, targetLng);
            return {
                success: distance <= 200,
                method: 'wifi',
                accuracy,
                distance,
                spoofingIndicators: {
                    vpnDetected: false,
                    proxyDetected: false,
                    torDetected: false,
                    datacenterIp: false,
                    gpsSpofingLikely: false,
                    deviceTimeInconsistent: false,
                    suspiciousUserAgent: false,
                    rapidLocationChanges: false,
                    impossibleSpeed: false,
                    consistentGpsAccuracy: false
                },
                confidence: 75,
                details: {
                    wifiNetworksCount: wifiNetworks.length,
                    estimatedLocation: location,
                    wifiAccuracy: accuracy
                }
            };
        }
        catch (error) {
            return null;
        }
    }
    async verifyIPLocation(clientIp, targetLat, targetLng) {
        try {
            if (!this.ipstackApiKey || !clientIp) {
                return null;
            }
            const response = await axios_1.default.get(`http://api.ipstack.com/${clientIp}?access_key=${this.ipstackApiKey}&format=1`, { timeout: 5000 });
            const data = response.data;
            if (!data.latitude || !data.longitude) {
                return null;
            }
            const distance = (0, connection_1.calculateDistance)(data.latitude, data.longitude, targetLat, targetLng);
            const vpnDetected = data.threat?.is_proxy || data.connection_type === 'hosting';
            const datacenterIp = data.connection_type === 'corporate' || data.connection_type === 'hosting';
            return {
                success: distance <= 50000,
                method: 'ip',
                accuracy: data.accuracy_radius || 10000,
                distance,
                spoofingIndicators: {
                    vpnDetected,
                    proxyDetected: data.threat?.is_proxy || false,
                    torDetected: data.threat?.is_tor || false,
                    datacenterIp,
                    gpsSpofingLikely: false,
                    deviceTimeInconsistent: false,
                    suspiciousUserAgent: false,
                    rapidLocationChanges: false,
                    impossibleSpeed: false,
                    consistentGpsAccuracy: false
                },
                confidence: vpnDetected ? 20 : 40,
                details: {
                    ipLocation: { lat: data.latitude, lng: data.longitude },
                    country: data.country_name,
                    region: data.region_name,
                    city: data.city,
                    isp: data.isp,
                    connectionType: data.connection_type
                }
            };
        }
        catch (error) {
            return null;
        }
    }
    async verifyCellTowerLocation(cellTowers, targetLat, targetLng) {
        try {
            if (!this.googleMapsApiKey || cellTowers.length === 0) {
                return null;
            }
            const cellTowerData = cellTowers.map(tower => ({
                cellId: tower.cid,
                locationAreaCode: tower.lac,
                mobileCountryCode: tower.mcc,
                mobileNetworkCode: tower.mnc,
                age: 0,
                signalStrength: tower.signalStrength
            }));
            const response = await axios_1.default.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${this.googleMapsApiKey}`, {
                cellTowers: cellTowerData,
                considerIp: false
            }, { timeout: 5000 });
            const { location, accuracy } = response.data;
            const distance = (0, connection_1.calculateDistance)(location.lat, location.lng, targetLat, targetLng);
            return {
                success: distance <= 500,
                method: 'cell_tower',
                accuracy,
                distance,
                spoofingIndicators: {
                    vpnDetected: false,
                    proxyDetected: false,
                    torDetected: false,
                    datacenterIp: false,
                    gpsSpofingLikely: false,
                    deviceTimeInconsistent: false,
                    suspiciousUserAgent: false,
                    rapidLocationChanges: false,
                    impossibleSpeed: false,
                    consistentGpsAccuracy: false
                },
                confidence: 65,
                details: {
                    cellTowersCount: cellTowers.length,
                    estimatedLocation: location,
                    cellAccuracy: accuracy
                }
            };
        }
        catch (error) {
            return null;
        }
    }
    async detectSpoofing(request, results) {
        const indicators = {
            vpnDetected: false,
            proxyDetected: false,
            torDetected: false,
            datacenterIp: false,
            gpsSpofingLikely: false,
            deviceTimeInconsistent: false,
            suspiciousUserAgent: false,
            rapidLocationChanges: false,
            impossibleSpeed: false,
            consistentGpsAccuracy: false
        };
        for (const result of results) {
            if (result.spoofingIndicators.vpnDetected)
                indicators.vpnDetected = true;
            if (result.spoofingIndicators.proxyDetected)
                indicators.proxyDetected = true;
            if (result.spoofingIndicators.torDetected)
                indicators.torDetected = true;
            if (result.spoofingIndicators.datacenterIp)
                indicators.datacenterIp = true;
            if (result.spoofingIndicators.gpsSpofingLikely)
                indicators.gpsSpofingLikely = true;
        }
        indicators.suspiciousUserAgent = this.isSuspiciousUserAgent(request.deviceInfo.userAgent);
        indicators.deviceTimeInconsistent = this.checkDeviceTimeConsistency(request);
        indicators.rapidLocationChanges = await this.checkRapidLocationChanges(request.invitationNumber, request.coordinates);
        return indicators;
    }
    selectBestVerificationResult(results) {
        if (results.length === 0) {
            throw new types_1.GeofencingError('No verification results available');
        }
        results.sort((a, b) => {
            if (a.confidence !== b.confidence) {
                return b.confidence - a.confidence;
            }
            return a.accuracy - b.accuracy;
        });
        return results[0];
    }
    calculateConfidenceScore(result, spoofingIndicators) {
        let confidence = result.confidence;
        if (spoofingIndicators.vpnDetected)
            confidence -= 30;
        if (spoofingIndicators.gpsSpofingLikely)
            confidence -= 40;
        if (spoofingIndicators.rapidLocationChanges)
            confidence -= 20;
        if (spoofingIndicators.impossibleSpeed)
            confidence -= 25;
        if (spoofingIndicators.deviceTimeInconsistent)
            confidence -= 15;
        return Math.max(0, Math.min(100, confidence));
    }
    async getInvitationDetails(invitationId) {
        const result = await connection_1.default.query('SELECT activation_lat, activation_lng, activation_radius FROM invitations WHERE id = $1', [invitationId]);
        return result.rows[0];
    }
    checkImpossibleSpeed(request) {
        return false;
    }
    async checkConsistentAccuracy(invitationNumber, accuracy) {
        try {
            const result = await connection_1.default.query(`SELECT accuracy_meters FROM location_verifications lv
         JOIN invitations i ON i.id = lv.invitation_id
         WHERE i.invitation_number = $1 AND lv.attempted_at > NOW() - INTERVAL '1 hour'
         ORDER BY lv.attempted_at DESC LIMIT 5`, [invitationNumber]);
            if (result.rows.length < 3)
                return false;
            const accuracies = result.rows.map(row => parseFloat(row.accuracy_meters));
            const variance = this.calculateVariance(accuracies);
            return variance < 1.0;
        }
        catch (error) {
            return false;
        }
    }
    calculateVariance(numbers) {
        const mean = numbers.reduce((a, b) => a + b) / numbers.length;
        return numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numbers.length;
    }
    isSuspiciousUserAgent(userAgent) {
        const suspiciousPatterns = [
            /bot/i,
            /crawler/i,
            /spider/i,
            /curl/i,
            /wget/i,
            /python/i,
            /automated/i
        ];
        return suspiciousPatterns.some(pattern => pattern.test(userAgent));
    }
    checkDeviceTimeConsistency(request) {
        const serverTime = Date.now();
        const clientTime = request.timestamp;
        const timeDifference = Math.abs(serverTime - clientTime);
        return timeDifference > 300000;
    }
    async checkRapidLocationChanges(invitationNumber, currentCoordinates) {
        try {
            const result = await connection_1.default.query(`SELECT client_lat, client_lng, attempted_at FROM location_verifications lv
         JOIN invitations i ON i.id = lv.invitation_id
         WHERE i.invitation_number = $1 AND lv.attempted_at > NOW() - INTERVAL '10 minutes'
         ORDER BY lv.attempted_at DESC LIMIT 3`, [invitationNumber]);
            if (result.rows.length < 2)
                return false;
            for (let i = 0; i < result.rows.length - 1; i++) {
                const prev = result.rows[i];
                const current = result.rows[i + 1];
                const distance = (0, connection_1.calculateDistance)(parseFloat(prev.client_lat), parseFloat(prev.client_lng), parseFloat(current.client_lat), parseFloat(current.client_lng));
                const timeDiff = (new Date(prev.attempted_at).getTime() - new Date(current.attempted_at).getTime()) / 1000;
                const speed = distance / timeDiff;
                if (speed > 50) {
                    return true;
                }
            }
            return false;
        }
        catch (error) {
            return false;
        }
    }
    async logVerificationAttempt(invitationId, request, result, spoofingIndicators) {
        await connection_1.default.query(`INSERT INTO location_verifications (
        invitation_id, client_lat, client_lng, distance_meters,
        verification_method, success, accuracy_meters, altitude,
        heading, speed, spoofing_indicators, client_ip, user_agent,
        device_fingerprint
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`, [
            invitationId,
            request.coordinates.lat,
            request.coordinates.lng,
            result.distance,
            result.method,
            result.success,
            request.accuracy,
            request.altitude,
            request.heading,
            request.speed,
            JSON.stringify(spoofingIndicators),
            request.clientIp,
            request.deviceInfo.userAgent,
            request.deviceFingerprint
        ]);
    }
    getSecurityCheckResults(spoofingIndicators) {
        return {
            vpnCheck: !spoofingIndicators.vpnDetected,
            proxyCheck: !spoofingIndicators.proxyDetected,
            gpsIntegrityCheck: !spoofingIndicators.gpsSpofingLikely,
            deviceTimeCheck: !spoofingIndicators.deviceTimeInconsistent,
            behaviorCheck: !spoofingIndicators.rapidLocationChanges,
            speedCheck: !spoofingIndicators.impossibleSpeed
        };
    }
}
exports.default = new GeofencingService();
//# sourceMappingURL=geofencing.js.map