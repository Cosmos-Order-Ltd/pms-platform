import { Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';

// Extend Express Request interface to include tenant information
declare global {
  namespace Express {
    interface Request {
      tenant?: {
        id: string;
        schema: string;
        tier: string;
        isActive: boolean;
        limits: {
          maxProperties: number;
          maxBookingsPerMonth: number;
          maxApiCallsPerDay: number;
        };
      };
    }
  }
}

// Database connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'pms_production',
  user: process.env.DB_USER || 'pms',
  password: process.env.DB_PASSWORD || 'S5VbL7nEJsrIgqWj2Vd91Sidq3tIvSGKnw5Fa0QBhmU=',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

/**
 * Extract tenant ID from request
 * Priority order:
 * 1. X-Tenant-ID header
 * 2. Subdomain (e.g., demo-hotel.pms.local)
 * 3. Query parameter
 * 4. JWT token (if authenticated)
 */
function extractTenantId(req: Request): string | null {
  // 1. Check header
  const headerTenantId = req.headers['x-tenant-id'] as string;
  if (headerTenantId) return headerTenantId;

  // 2. Check subdomain
  const host = req.headers.host;
  if (host) {
    const subdomain = host.split('.')[0];
    if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
      return subdomain.replace(/-/g, '_'); // Convert demo-hotel to demo_hotel
    }
  }

  // 3. Check query parameter
  const queryTenantId = req.query.tenant_id as string;
  if (queryTenantId) return queryTenantId;

  // 4. Check JWT token (if authenticated)
  // TODO: Extract from JWT when auth is implemented

  return null;
}

/**
 * Middleware to identify and validate tenant
 */
export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = extractTenantId(req);

    // For health checks and public endpoints, skip tenant validation
    if (req.path === '/health' || req.path.startsWith('/api/v1/auth/public')) {
      return next();
    }

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'TENANT_REQUIRED',
        message: 'Tenant ID is required. Please provide it via X-Tenant-ID header, subdomain, or query parameter.'
      });
    }

    // Fetch tenant information from database
    const tenantQuery = `
      SELECT
        t.tenant_id,
        t.schema_name,
        t.subscription_tier,
        t.subscription_status,
        t.is_active,
        t.trial_ends_at,
        t.current_period_end,
        st.max_properties,
        st.max_bookings_per_month,
        st.max_api_calls_per_day
      FROM tenants t
      JOIN subscription_tiers st ON t.subscription_tier = st.tier_name
      WHERE t.tenant_id = $1
    `;

    const tenantResult = await pool.query(tenantQuery, [tenantId]);

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'TENANT_NOT_FOUND',
        message: `Tenant '${tenantId}' not found.`
      });
    }

    const tenant = tenantResult.rows[0];

    // Check if tenant is active
    if (!tenant.is_active) {
      return res.status(403).json({
        success: false,
        error: 'TENANT_INACTIVE',
        message: 'Tenant account is inactive. Please contact support.'
      });
    }

    // Check subscription status
    if (tenant.subscription_status === 'canceled' || tenant.subscription_status === 'suspended') {
      return res.status(402).json({
        success: false,
        error: 'SUBSCRIPTION_REQUIRED',
        message: 'Subscription is required to access this service. Please update your billing information.'
      });
    }

    // Check if trial has expired for trial users
    if (tenant.subscription_status === 'trial' && new Date(tenant.trial_ends_at) < new Date()) {
      return res.status(402).json({
        success: false,
        error: 'TRIAL_EXPIRED',
        message: 'Trial period has expired. Please upgrade to a paid subscription.'
      });
    }

    // Attach tenant information to request
    req.tenant = {
      id: tenant.tenant_id,
      schema: tenant.schema_name,
      tier: tenant.subscription_tier,
      isActive: tenant.is_active,
      limits: {
        maxProperties: tenant.max_properties,
        maxBookingsPerMonth: tenant.max_bookings_per_month,
        maxApiCallsPerDay: tenant.max_api_calls_per_day
      }
    };

    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'TENANT_VALIDATION_ERROR',
      message: 'Failed to validate tenant information.'
    });
  }
};

/**
 * Middleware to check usage limits
 */
export const usageLimitMiddleware = (metric: 'properties' | 'bookings' | 'api_calls') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.tenant) {
        return res.status(400).json({
          success: false,
          error: 'TENANT_REQUIRED',
          message: 'Tenant information is required for usage limit checking.'
        });
      }

      // Check usage limit using the database function
      const limitCheckQuery = `SELECT check_usage_limit($1, $2) as within_limit`;
      const limitResult = await pool.query(limitCheckQuery, [req.tenant.id, metric]);

      const withinLimit = limitResult.rows[0].within_limit;

      if (!withinLimit) {
        const limitName = {
          properties: 'property',
          bookings: 'booking',
          api_calls: 'API call'
        }[metric];

        return res.status(429).json({
          success: false,
          error: 'USAGE_LIMIT_EXCEEDED',
          message: `${limitName} limit exceeded for your ${req.tenant.tier} subscription. Please upgrade your plan.`,
          limits: req.tenant.limits
        });
      }

      next();
    } catch (error) {
      console.error('Usage limit middleware error:', error);
      res.status(500).json({
        success: false,
        error: 'USAGE_LIMIT_CHECK_ERROR',
        message: 'Failed to check usage limits.'
      });
    }
  };
};

/**
 * Middleware to track usage
 */
export const trackUsageMiddleware = (metric: 'properties' | 'bookings' | 'api_calls', count: number = 1) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.tenant) {
        return next(); // Skip tracking if no tenant
      }

      // Track usage using the database function
      const trackQuery = `SELECT track_tenant_usage($1, $2, $3)`;
      await pool.query(trackQuery, [req.tenant.id, metric, count]);

      next();
    } catch (error) {
      console.error('Usage tracking error:', error);
      // Don't fail the request if tracking fails
      next();
    }
  };
};

/**
 * Utility function to set database schema for tenant-specific queries
 */
export const setTenantSchema = async (tenantSchema: string): Promise<Pool> => {
  const tenantPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'pms_production',
    user: process.env.DB_USER || 'pms',
    password: process.env.DB_PASSWORD || 'S5VbL7nEJsrIgqWj2Vd91Sidq3tIvSGKnw5Fa0QBhmU=',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  // Set search path to tenant schema
  await tenantPool.query(`SET search_path TO ${tenantSchema}, public`);
  return tenantPool;
};

/**
 * Tenant-aware database query helper
 */
export const tenantQuery = async (req: Request, query: string, params: any[] = []): Promise<any> => {
  if (!req.tenant) {
    throw new Error('Tenant information is required for tenant queries');
  }

  const client = await pool.connect();
  try {
    // Set search path to tenant schema
    await client.query(`SET search_path TO ${req.tenant.schema}, public`);
    const result = await client.query(query, params);
    return result;
  } finally {
    client.release();
  }
};

export default tenantMiddleware;