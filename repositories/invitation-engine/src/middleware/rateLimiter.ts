/**
 * Cyprus Access Control (CAC) - Rate Limiting Middleware
 * Intelligent rate limiting for invitation orchestration service
 */

import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis, RateLimiterMemory } from 'rate-limiter-flexible';
import databaseManager from '../database/connection';
import { RateLimitError } from './errorHandler';

// Rate limiter configurations
const rateLimiterConfigs = {
  // Global API rate limiting
  global: {
    keyPrefix: 'global_rl',
    points: 100, // Number of requests
    duration: 900, // Per 15 minutes
    blockDuration: 900, // Block for 15 minutes
  },

  // Invitation creation (more restrictive)
  invitationCreation: {
    keyPrefix: 'invitation_create_rl',
    points: 10, // 10 invitations
    duration: 3600, // Per hour
    blockDuration: 3600, // Block for 1 hour
  },

  // Location verification attempts
  locationVerification: {
    keyPrefix: 'location_verify_rl',
    points: 50, // 50 attempts
    duration: 900, // Per 15 minutes
    blockDuration: 300, // Block for 5 minutes
  },

  // QR code scans
  qrScans: {
    keyPrefix: 'qr_scan_rl',
    points: 20, // 20 scans
    duration: 300, // Per 5 minutes
    blockDuration: 300, // Block for 5 minutes
  },

  // SMS verification
  smsVerification: {
    keyPrefix: 'sms_verify_rl',
    points: 5, // 5 SMS requests
    duration: 3600, // Per hour
    blockDuration: 3600, // Block for 1 hour
  },

  // Admin operations
  adminOperations: {
    keyPrefix: 'admin_rl',
    points: 500, // 500 requests
    duration: 900, // Per 15 minutes
    blockDuration: 60, // Block for 1 minute
  },

  // Webhook endpoints
  webhooks: {
    keyPrefix: 'webhook_rl',
    points: 1000, // 1000 webhook calls
    duration: 60, // Per minute
    blockDuration: 60, // Block for 1 minute
  },

  // Failed attempts (security)
  failedAttempts: {
    keyPrefix: 'failed_attempts_rl',
    points: 10, // 10 failed attempts
    duration: 3600, // Per hour
    blockDuration: 3600, // Block for 1 hour
  }
};

class RateLimiterManager {
  private limiters: Map<string, RateLimiterRedis | RateLimiterMemory> = new Map();
  private useRedis: boolean = true;

  constructor() {
    this.initializeLimiters();
  }

  private async initializeLimiters(): Promise<void> {
    try {
      // Test Redis connectivity
      await databaseManager.rawRedis.ping();
      this.useRedis = true;
    } catch (error) {
      console.warn('Redis not available for rate limiting, falling back to memory');
      this.useRedis = false;
    }

    // Initialize all rate limiters
    for (const [name, config] of Object.entries(rateLimiterConfigs)) {
      if (this.useRedis) {
        this.limiters.set(name, new RateLimiterRedis({
          storeClient: databaseManager.rawRedis,
          ...config
        }));
      } else {
        this.limiters.set(name, new RateLimiterMemory(config));
      }
    }
  }

  public getLimiter(name: string): RateLimiterRedis | RateLimiterMemory | undefined {
    return this.limiters.get(name);
  }

  public async checkLimit(
    limiterName: string,
    key: string,
    points: number = 1
  ): Promise<{ allowed: boolean; remainingPoints: number; resetTime: Date }> {
    const limiter = this.getLimiter(limiterName);
    if (!limiter) {
      // If limiter not found, allow the request
      return { allowed: true, remainingPoints: 999, resetTime: new Date() };
    }

    try {
      const result = await limiter.consume(key, points);
      return {
        allowed: true,
        remainingPoints: result.remainingPoints || 0,
        resetTime: new Date(Date.now() + (result.msBeforeNext || 0))
      };
    } catch (rateLimiterRes) {
      // Rate limit exceeded
      return {
        allowed: false,
        remainingPoints: 0,
        resetTime: new Date(Date.now() + (rateLimiterRes.msBeforeNext || 0))
      };
    }
  }
}

const rateLimiterManager = new RateLimiterManager();

/**
 * Generate rate limiting key based on IP and user context
 */
function generateRateLimitKey(req: Request, prefix: string): string {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.get('User-Agent') || 'unknown';

  // For authenticated requests, use user ID if available
  if (req.user?.id) {
    return `${prefix}:user:${req.user.id}`;
  }

  // For invitation-specific operations, include invitation number
  const invitationNumber = req.params.invitationNumber || req.body.invitationNumber;
  if (invitationNumber) {
    return `${prefix}:invitation:${invitationNumber}:${ip}`;
  }

  // Default to IP-based limiting
  return `${prefix}:ip:${ip}`;
}

/**
 * Generic rate limiting middleware factory
 */
function createRateLimiter(limiterName: string, customPoints?: number) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const key = generateRateLimitKey(req, limiterName);
      const result = await rateLimiterManager.checkLimit(limiterName, key, customPoints);

      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': rateLimiterConfigs[limiterName]?.points?.toString() || 'unknown',
        'X-RateLimit-Remaining': result.remainingPoints.toString(),
        'X-RateLimit-Reset': result.resetTime.toISOString(),
        'X-RateLimit-Window': rateLimiterConfigs[limiterName]?.duration?.toString() || 'unknown'
      });

      if (!result.allowed) {
        const retryAfter = Math.ceil((result.resetTime.getTime() - Date.now()) / 1000);
        res.set('Retry-After', retryAfter.toString());

        throw new RateLimitError(
          `Rate limit exceeded for ${limiterName}. Try again in ${retryAfter} seconds.`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Global rate limiter for all API endpoints
 */
export const globalRateLimit = createRateLimiter('global');

/**
 * Invitation creation rate limiter
 */
export const invitationCreationRateLimit = createRateLimiter('invitationCreation');

/**
 * Location verification rate limiter
 */
export const locationVerificationRateLimit = createRateLimiter('locationVerification');

/**
 * QR code scanning rate limiter
 */
export const qrScanRateLimit = createRateLimiter('qrScans');

/**
 * SMS verification rate limiter
 */
export const smsVerificationRateLimit = createRateLimiter('smsVerification');

/**
 * Admin operations rate limiter
 */
export const adminRateLimit = createRateLimiter('adminOperations');

/**
 * Webhook rate limiter
 */
export const webhookRateLimit = createRateLimiter('webhooks');

/**
 * Failed attempts rate limiter for security
 */
export const failedAttemptsRateLimit = createRateLimiter('failedAttempts');

/**
 * Cyprus-specific rate limiting based on business rules
 */
export const cyprusBusinessRateLimit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const businessType = req.body.businessType || req.params.businessType;

    // Different limits for different business types
    let limiterName = 'global';
    let points = 1;

    switch (businessType) {
      case 'hotel':
        // Hotels get higher limits (more valuable customers)
        limiterName = 'global';
        points = 1;
        break;
      case 'real_estate':
        // Real estate gets moderate limits
        limiterName = 'global';
        points = 1;
        break;
      case 'company':
        // Companies get standard limits
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
      throw new RateLimitError(
        `Cyprus business rate limit exceeded for ${businessType}. Please try again later.`
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Geofencing-specific rate limiting
 */
export const geofencingRateLimit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const coordinates = req.body.coordinates || req.query.coordinates;

    // Check if coordinates are within Cyprus bounds
    if (coordinates && coordinates.lat && coordinates.lng) {
      const { lat, lng } = coordinates;

      // Cyprus bounds
      const cyprusBounds = {
        north: 35.7011,
        south: 34.5588,
        east: 34.6049,
        west: 32.2567
      };

      const isInCyprus = lat >= cyprusBounds.south && lat <= cyprusBounds.north &&
                        lng >= cyprusBounds.west && lng <= cyprusBounds.east;

      if (!isInCyprus) {
        // Higher rate limiting for locations outside Cyprus
        const key = generateRateLimitKey(req, 'non_cyprus_location');
        const result = await rateLimiterManager.checkLimit('locationVerification', key, 5); // Use more points

        if (!result.allowed) {
          throw new RateLimitError(
            'Location verification rate limit exceeded for non-Cyprus locations'
          );
        }
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Dynamic rate limiting based on user behavior
 */
export const adaptiveRateLimit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ip = req.ip || 'unknown';

    // Check for suspicious patterns
    const suspiciousPatterns = await checkSuspiciousPatterns(ip);

    if (suspiciousPatterns.isSuspicious) {
      // Apply stricter rate limiting for suspicious IPs
      const key = generateRateLimitKey(req, 'suspicious_activity');
      const result = await rateLimiterManager.checkLimit('failedAttempts', key, 3);

      if (!result.allowed) {
        throw new RateLimitError(
          'Suspicious activity detected. Access temporarily restricted.'
        );
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Check for suspicious patterns
 */
async function checkSuspiciousPatterns(ip: string): Promise<{ isSuspicious: boolean; reasons: string[] }> {
  const reasons: string[] = [];

  try {
    // Check recent failed attempts
    const failedAttemptsKey = `failed_attempts:${ip}`;
    const failedAttempts = await databaseManager.getCache(failedAttemptsKey);

    if (failedAttempts && parseInt(failedAttempts) > 5) {
      reasons.push('Multiple failed attempts');
    }

    // Check for rapid requests (basic implementation)
    const rapidRequestsKey = `rapid_requests:${ip}`;
    const rapidRequests = await databaseManager.getCache(rapidRequestsKey);

    if (rapidRequests && parseInt(rapidRequests) > 10) {
      reasons.push('Rapid successive requests');
    }

    // Add more sophisticated pattern detection here

    return {
      isSuspicious: reasons.length > 0,
      reasons
    };
  } catch (error) {
    // If pattern check fails, don't block the user
    return { isSuspicious: false, reasons: [] };
  }
}

// Default export is the global rate limiter
export default globalRateLimit;