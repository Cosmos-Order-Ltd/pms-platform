"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptiveRateLimit = exports.geofencingRateLimit = exports.cyprusBusinessRateLimit = exports.failedAttemptsRateLimit = exports.webhookRateLimit = exports.adminRateLimit = exports.smsVerificationRateLimit = exports.qrScanRateLimit = exports.locationVerificationRateLimit = exports.invitationCreationRateLimit = exports.globalRateLimit = void 0;
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const connection_1 = __importDefault(require("../database/connection"));
const errorHandler_1 = require("./errorHandler");
const rateLimiterConfigs = {
    global: {
        keyPrefix: 'global_rl',
        points: 100,
        duration: 900,
        blockDuration: 900,
    },
    invitationCreation: {
        keyPrefix: 'invitation_create_rl',
        points: 10,
        duration: 3600,
        blockDuration: 3600,
    },
    locationVerification: {
        keyPrefix: 'location_verify_rl',
        points: 50,
        duration: 900,
        blockDuration: 300,
    },
    qrScans: {
        keyPrefix: 'qr_scan_rl',
        points: 20,
        duration: 300,
        blockDuration: 300,
    },
    smsVerification: {
        keyPrefix: 'sms_verify_rl',
        points: 5,
        duration: 3600,
        blockDuration: 3600,
    },
    adminOperations: {
        keyPrefix: 'admin_rl',
        points: 500,
        duration: 900,
        blockDuration: 60,
    },
    webhooks: {
        keyPrefix: 'webhook_rl',
        points: 1000,
        duration: 60,
        blockDuration: 60,
    },
    failedAttempts: {
        keyPrefix: 'failed_attempts_rl',
        points: 10,
        duration: 3600,
        blockDuration: 3600,
    }
};
class RateLimiterManager {
    limiters = new Map();
    useRedis = true;
    constructor() {
        this.initializeLimiters();
    }
    async initializeLimiters() {
        try {
            await connection_1.default.rawRedis.ping();
            this.useRedis = true;
        }
        catch (error) {
            console.warn('Redis not available for rate limiting, falling back to memory');
            this.useRedis = false;
        }
        for (const [name, config] of Object.entries(rateLimiterConfigs)) {
            if (this.useRedis) {
                this.limiters.set(name, new rate_limiter_flexible_1.RateLimiterRedis({
                    storeClient: connection_1.default.rawRedis,
                    ...config
                }));
            }
            else {
                this.limiters.set(name, new rate_limiter_flexible_1.RateLimiterMemory(config));
            }
        }
    }
    getLimiter(name) {
        return this.limiters.get(name);
    }
    async checkLimit(limiterName, key, points = 1) {
        const limiter = this.getLimiter(limiterName);
        if (!limiter) {
            return { allowed: true, remainingPoints: 999, resetTime: new Date() };
        }
        try {
            const result = await limiter.consume(key, points);
            return {
                allowed: true,
                remainingPoints: result.remainingPoints || 0,
                resetTime: new Date(Date.now() + (result.msBeforeNext || 0))
            };
        }
        catch (rateLimiterRes) {
            return {
                allowed: false,
                remainingPoints: 0,
                resetTime: new Date(Date.now() + (rateLimiterRes.msBeforeNext || 0))
            };
        }
    }
}
const rateLimiterManager = new RateLimiterManager();
function generateRateLimitKey(req, prefix) {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    if (req.user?.id) {
        return `${prefix}:user:${req.user.id}`;
    }
    const invitationNumber = req.params.invitationNumber || req.body.invitationNumber;
    if (invitationNumber) {
        return `${prefix}:invitation:${invitationNumber}:${ip}`;
    }
    return `${prefix}:ip:${ip}`;
}
function createRateLimiter(limiterName, customPoints) {
    return async (req, res, next) => {
        try {
            const key = generateRateLimitKey(req, limiterName);
            const result = await rateLimiterManager.checkLimit(limiterName, key, customPoints);
            res.set({
                'X-RateLimit-Limit': rateLimiterConfigs[limiterName]?.points?.toString() || 'unknown',
                'X-RateLimit-Remaining': result.remainingPoints.toString(),
                'X-RateLimit-Reset': result.resetTime.toISOString(),
                'X-RateLimit-Window': rateLimiterConfigs[limiterName]?.duration?.toString() || 'unknown'
            });
            if (!result.allowed) {
                const retryAfter = Math.ceil((result.resetTime.getTime() - Date.now()) / 1000);
                res.set('Retry-After', retryAfter.toString());
                throw new errorHandler_1.RateLimitError(`Rate limit exceeded for ${limiterName}. Try again in ${retryAfter} seconds.`);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
exports.globalRateLimit = createRateLimiter('global');
exports.invitationCreationRateLimit = createRateLimiter('invitationCreation');
exports.locationVerificationRateLimit = createRateLimiter('locationVerification');
exports.qrScanRateLimit = createRateLimiter('qrScans');
exports.smsVerificationRateLimit = createRateLimiter('smsVerification');
exports.adminRateLimit = createRateLimiter('adminOperations');
exports.webhookRateLimit = createRateLimiter('webhooks');
exports.failedAttemptsRateLimit = createRateLimiter('failedAttempts');
const cyprusBusinessRateLimit = async (req, res, next) => {
    try {
        const businessType = req.body.businessType || req.params.businessType;
        let limiterName = 'global';
        let points = 1;
        switch (businessType) {
            case 'hotel':
                limiterName = 'global';
                points = 1;
                break;
            case 'real_estate':
                limiterName = 'global';
                points = 1;
                break;
            case 'company':
                limiterName = 'global';
                points = 1;
                break;
            default:
                limiterName = 'global';
                points = 1;
        }
        const key = generateRateLimitKey(req, `cyprus_business_${businessType}`);
        const result = await rateLimiterManager.checkLimit(limiterName, key, points);
        res.set({
            'X-Cyprus-RateLimit-BusinessType': businessType || 'unknown',
            'X-Cyprus-RateLimit-Remaining': result.remainingPoints.toString(),
            'X-Cyprus-RateLimit-Reset': result.resetTime.toISOString()
        });
        if (!result.allowed) {
            throw new errorHandler_1.RateLimitError(`Cyprus business rate limit exceeded for ${businessType}. Please try again later.`);
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.cyprusBusinessRateLimit = cyprusBusinessRateLimit;
const geofencingRateLimit = async (req, res, next) => {
    try {
        const coordinates = req.body.coordinates || req.query.coordinates;
        if (coordinates && coordinates.lat && coordinates.lng) {
            const { lat, lng } = coordinates;
            const cyprusBounds = {
                north: 35.7011,
                south: 34.5588,
                east: 34.6049,
                west: 32.2567
            };
            const isInCyprus = lat >= cyprusBounds.south && lat <= cyprusBounds.north &&
                lng >= cyprusBounds.west && lng <= cyprusBounds.east;
            if (!isInCyprus) {
                const key = generateRateLimitKey(req, 'non_cyprus_location');
                const result = await rateLimiterManager.checkLimit('locationVerification', key, 5);
                if (!result.allowed) {
                    throw new errorHandler_1.RateLimitError('Location verification rate limit exceeded for non-Cyprus locations');
                }
            }
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.geofencingRateLimit = geofencingRateLimit;
const adaptiveRateLimit = async (req, res, next) => {
    try {
        const ip = req.ip || 'unknown';
        const suspiciousPatterns = await checkSuspiciousPatterns(ip);
        if (suspiciousPatterns.isSuspicious) {
            const key = generateRateLimitKey(req, 'suspicious_activity');
            const result = await rateLimiterManager.checkLimit('failedAttempts', key, 3);
            if (!result.allowed) {
                throw new errorHandler_1.RateLimitError('Suspicious activity detected. Access temporarily restricted.');
            }
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.adaptiveRateLimit = adaptiveRateLimit;
async function checkSuspiciousPatterns(ip) {
    const reasons = [];
    try {
        const failedAttemptsKey = `failed_attempts:${ip}`;
        const failedAttempts = await connection_1.default.getCache(failedAttemptsKey);
        if (failedAttempts && parseInt(failedAttempts) > 5) {
            reasons.push('Multiple failed attempts');
        }
        const rapidRequestsKey = `rapid_requests:${ip}`;
        const rapidRequests = await connection_1.default.getCache(rapidRequestsKey);
        if (rapidRequests && parseInt(rapidRequests) > 10) {
            reasons.push('Rapid successive requests');
        }
        return {
            isSuspicious: reasons.length > 0,
            reasons
        };
    }
    catch (error) {
        return { isSuspicious: false, reasons: [] };
    }
}
exports.default = exports.globalRateLimit;
//# sourceMappingURL=rateLimiter.js.map