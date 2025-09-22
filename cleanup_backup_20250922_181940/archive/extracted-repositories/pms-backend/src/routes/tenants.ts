import express, { Request, Response } from 'express';
import { TenantService } from '../services/tenantService';
import { tenantMiddleware, usageLimitMiddleware, trackUsageMiddleware } from '../middleware/tenant';

const router = express.Router();

/**
 * POST /api/v1/tenants
 * Create a new tenant (admin only or self-signup)
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      companyName,
      contactEmail,
      contactPhone,
      subscriptionTier = 'basic',
      cyprusVatNumber,
      policeApiKey,
      tfaApiKey,
      bankAccountIban
    } = req.body;

    // Validate required fields
    if (!companyName || !contactEmail) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_REQUIRED_FIELDS',
        message: 'Company name and contact email are required.'
      });
    }

    // Validate subscription tier
    const validTiers = ['basic', 'professional', 'enterprise'];
    if (!validTiers.includes(subscriptionTier)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_SUBSCRIPTION_TIER',
        message: `Subscription tier must be one of: ${validTiers.join(', ')}`
      });
    }

    // Create tenant
    const tenant = await TenantService.createTenant({
      companyName,
      contactEmail,
      contactPhone,
      subscriptionTier,
      cyprusVatNumber,
      policeApiKey,
      tfaApiKey,
      bankAccountIban
    });

    res.status(201).json({
      success: true,
      message: 'Tenant created successfully',
      data: {
        tenant,
        setupInstructions: {
          apiUrl: `${req.protocol}://${req.headers.host}/api/v1`,
          tenantId: tenant.tenantId,
          headers: {
            'X-Tenant-ID': tenant.tenantId
          },
          subdomainUrl: `${req.protocol}://${tenant.tenantId.replace('_', '-')}.${req.headers.host?.split('.').slice(1).join('.')}`
        }
      }
    });

  } catch (error) {
    console.error('Create tenant error:', error);
    res.status(500).json({
      success: false,
      error: 'TENANT_CREATION_ERROR',
      message: 'Failed to create tenant. Please try again.'
    });
  }
});

/**
 * GET /api/v1/tenants/:tenantId
 * Get tenant information (with tenant middleware)
 */
router.get('/:tenantId', tenantMiddleware, async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;

    // Ensure user can only access their own tenant (or admin access)
    if (req.tenant?.id !== tenantId) {
      return res.status(403).json({
        success: false,
        error: 'ACCESS_DENIED',
        message: 'You can only access your own tenant information.'
      });
    }

    const tenant = await TenantService.getTenant(tenantId);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        error: 'TENANT_NOT_FOUND',
        message: 'Tenant not found.'
      });
    }

    res.json({
      success: true,
      data: tenant
    });

  } catch (error) {
    console.error('Get tenant error:', error);
    res.status(500).json({
      success: false,
      error: 'TENANT_FETCH_ERROR',
      message: 'Failed to fetch tenant information.'
    });
  }
});

/**
 * GET /api/v1/tenants/:tenantId/usage
 * Get tenant usage statistics
 */
router.get('/:tenantId/usage', tenantMiddleware, trackUsageMiddleware('api_calls'), async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;

    // Ensure user can only access their own tenant usage
    if (req.tenant?.id !== tenantId) {
      return res.status(403).json({
        success: false,
        error: 'ACCESS_DENIED',
        message: 'You can only access your own usage information.'
      });
    }

    const usage = await TenantService.getTenantUsage(tenantId);

    res.json({
      success: true,
      data: {
        currentUsage: usage,
        limits: req.tenant.limits,
        subscriptionTier: req.tenant.tier,
        withinLimits: {
          properties: usage.properties < req.tenant.limits.maxProperties,
          bookings: usage.bookings < req.tenant.limits.maxBookingsPerMonth,
          apiCalls: usage.api_calls < req.tenant.limits.maxApiCallsPerDay
        }
      }
    });

  } catch (error) {
    console.error('Get tenant usage error:', error);
    res.status(500).json({
      success: false,
      error: 'USAGE_FETCH_ERROR',
      message: 'Failed to fetch usage information.'
    });
  }
});

/**
 * PUT /api/v1/tenants/:tenantId/subscription
 * Update tenant subscription tier
 */
router.put('/:tenantId/subscription', tenantMiddleware, async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;
    const { subscriptionTier } = req.body;

    // Ensure user can only update their own tenant
    if (req.tenant?.id !== tenantId) {
      return res.status(403).json({
        success: false,
        error: 'ACCESS_DENIED',
        message: 'You can only update your own subscription.'
      });
    }

    // Validate subscription tier
    const validTiers = ['basic', 'professional', 'enterprise'];
    if (!validTiers.includes(subscriptionTier)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_SUBSCRIPTION_TIER',
        message: `Subscription tier must be one of: ${validTiers.join(', ')}`
      });
    }

    await TenantService.updateSubscriptionTier(tenantId, subscriptionTier);

    res.json({
      success: true,
      message: 'Subscription tier updated successfully',
      data: {
        tenantId,
        newTier: subscriptionTier
      }
    });

  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'SUBSCRIPTION_UPDATE_ERROR',
      message: 'Failed to update subscription tier.'
    });
  }
});

/**
 * GET /api/v1/tenants
 * List all tenants (admin only)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    // TODO: Add admin authentication check here
    // For now, this is open for testing

    const tenants = await TenantService.listTenants(limit, offset);

    res.json({
      success: true,
      data: {
        tenants,
        pagination: {
          limit,
          offset,
          total: tenants.length
        }
      }
    });

  } catch (error) {
    console.error('List tenants error:', error);
    res.status(500).json({
      success: false,
      error: 'TENANTS_FETCH_ERROR',
      message: 'Failed to fetch tenants list.'
    });
  }
});

/**
 * DELETE /api/v1/tenants/:tenantId
 * Delete tenant (admin only - DANGEROUS!)
 */
router.delete('/:tenantId', async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;
    const { confirm } = req.body;

    // TODO: Add admin authentication check here
    // For now, require explicit confirmation

    if (confirm !== 'DELETE_ALL_DATA') {
      return res.status(400).json({
        success: false,
        error: 'CONFIRMATION_REQUIRED',
        message: 'To delete a tenant, send { "confirm": "DELETE_ALL_DATA" } in the request body.'
      });
    }

    await TenantService.deleteTenant(tenantId);

    res.json({
      success: true,
      message: 'Tenant and all associated data deleted successfully',
      warning: 'This action cannot be undone'
    });

  } catch (error) {
    console.error('Delete tenant error:', error);
    res.status(500).json({
      success: false,
      error: 'TENANT_DELETE_ERROR',
      message: 'Failed to delete tenant.'
    });
  }
});

/**
 * POST /api/v1/tenants/:tenantId/test-limits
 * Test endpoint to validate usage limits
 */
router.post('/:tenantId/test-limits',
  tenantMiddleware,
  usageLimitMiddleware('api_calls'),
  trackUsageMiddleware('api_calls'),
  async (req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'API call within limits',
      tenant: req.tenant
    });
  }
);

export default router;