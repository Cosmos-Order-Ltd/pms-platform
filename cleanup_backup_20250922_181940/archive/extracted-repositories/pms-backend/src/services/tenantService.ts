import { Pool } from 'pg';
import crypto from 'crypto';

interface CreateTenantData {
  companyName: string;
  contactEmail: string;
  contactPhone?: string;
  subscriptionTier: 'basic' | 'professional' | 'enterprise';
  cyprusVatNumber?: string;
  policeApiKey?: string;
  tfaApiKey?: string;
  bankAccountIban?: string;
}

interface TenantInfo {
  tenantId: string;
  companyName: string;
  schemaName: string;
  subscriptionTier: string;
  subscriptionStatus: string;
  contactEmail: string;
  cyprusVatNumber?: string;
  trialEndsAt: Date;
  currentPeriodEnd: Date;
  isActive: boolean;
  createdAt: Date;
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

export class TenantService {
  /**
   * Generate a unique tenant ID from company name
   */
  private static generateTenantId(companyName: string): string {
    const baseId = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_+|_+$/g, '')
      .substring(0, 20);

    // Add random suffix to ensure uniqueness
    const randomSuffix = crypto.randomBytes(4).toString('hex');
    return `${baseId}_${randomSuffix}`;
  }

  /**
   * Create a new tenant with isolated schema
   */
  static async createTenant(data: CreateTenantData): Promise<TenantInfo> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const tenantId = this.generateTenantId(data.companyName);
      const schemaName = `tenant_${tenantId}`;

      // Get subscription tier limits
      const tierQuery = `
        SELECT max_properties, max_bookings_per_month, max_api_calls_per_day
        FROM subscription_tiers
        WHERE tier_name = $1
      `;
      const tierResult = await client.query(tierQuery, [data.subscriptionTier]);

      if (tierResult.rows.length === 0) {
        throw new Error(`Invalid subscription tier: ${data.subscriptionTier}`);
      }

      const limits = tierResult.rows[0];

      // Insert tenant record
      const insertTenantQuery = `
        INSERT INTO tenants (
          tenant_id,
          company_name,
          schema_name,
          subscription_tier,
          contact_email,
          contact_phone,
          cyprus_vat_number,
          police_api_key,
          tfa_api_key,
          bank_account_iban,
          max_properties,
          max_bookings_per_month,
          max_api_calls_per_day
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
      `;

      const tenantResult = await client.query(insertTenantQuery, [
        tenantId,
        data.companyName,
        schemaName,
        data.subscriptionTier,
        data.contactEmail,
        data.contactPhone,
        data.cyprusVatNumber,
        data.policeApiKey,
        data.tfaApiKey,
        data.bankAccountIban,
        limits.max_properties,
        limits.max_bookings_per_month,
        limits.max_api_calls_per_day
      ]);

      // Create tenant schema using the database function
      await client.query('SELECT create_tenant_schema($1)', [tenantId]);

      await client.query('COMMIT');

      const tenant = tenantResult.rows[0];
      return {
        tenantId: tenant.tenant_id,
        companyName: tenant.company_name,
        schemaName: tenant.schema_name,
        subscriptionTier: tenant.subscription_tier,
        subscriptionStatus: tenant.subscription_status,
        contactEmail: tenant.contact_email,
        cyprusVatNumber: tenant.cyprus_vat_number,
        trialEndsAt: tenant.trial_ends_at,
        currentPeriodEnd: tenant.current_period_end,
        isActive: tenant.is_active,
        createdAt: tenant.created_at
      };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get tenant information by ID
   */
  static async getTenant(tenantId: string): Promise<TenantInfo | null> {
    const query = `
      SELECT *
      FROM tenants
      WHERE tenant_id = $1
    `;

    const result = await pool.query(query, [tenantId]);

    if (result.rows.length === 0) {
      return null;
    }

    const tenant = result.rows[0];
    return {
      tenantId: tenant.tenant_id,
      companyName: tenant.company_name,
      schemaName: tenant.schema_name,
      subscriptionTier: tenant.subscription_tier,
      subscriptionStatus: tenant.subscription_status,
      contactEmail: tenant.contact_email,
      cyprusVatNumber: tenant.cyprus_vat_number,
      trialEndsAt: tenant.trial_ends_at,
      currentPeriodEnd: tenant.current_period_end,
      isActive: tenant.is_active,
      createdAt: tenant.created_at
    };
  }

  /**
   * Update tenant subscription tier
   */
  static async updateSubscriptionTier(tenantId: string, newTier: string): Promise<void> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Get new tier limits
      const tierQuery = `
        SELECT max_properties, max_bookings_per_month, max_api_calls_per_day
        FROM subscription_tiers
        WHERE tier_name = $1
      `;
      const tierResult = await client.query(tierQuery, [newTier]);

      if (tierResult.rows.length === 0) {
        throw new Error(`Invalid subscription tier: ${newTier}`);
      }

      const limits = tierResult.rows[0];

      // Update tenant with new tier and limits
      const updateQuery = `
        UPDATE tenants
        SET
          subscription_tier = $1,
          max_properties = $2,
          max_bookings_per_month = $3,
          max_api_calls_per_day = $4,
          updated_at = CURRENT_TIMESTAMP
        WHERE tenant_id = $5
      `;

      await client.query(updateQuery, [
        newTier,
        limits.max_properties,
        limits.max_bookings_per_month,
        limits.max_api_calls_per_day,
        tenantId
      ]);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get tenant usage statistics
   */
  static async getTenantUsage(tenantId: string): Promise<any> {
    const query = `
      SELECT
        metric_name,
        SUM(usage_count) as total_usage
      FROM tenant_usage
      WHERE tenant_id = $1
      AND usage_date >= date_trunc('month', CURRENT_DATE)
      GROUP BY metric_name
    `;

    const result = await pool.query(query, [tenantId]);

    const usage: { [key: string]: number } = {};
    result.rows.forEach(row => {
      usage[row.metric_name] = parseInt(row.total_usage);
    });

    return {
      properties: usage.properties || 0,
      bookings: usage.bookings || 0,
      api_calls: usage.api_calls || 0
    };
  }

  /**
   * List all tenants (admin function)
   */
  static async listTenants(limit: number = 50, offset: number = 0): Promise<TenantInfo[]> {
    const query = `
      SELECT *
      FROM tenants
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await pool.query(query, [limit, offset]);

    return result.rows.map(tenant => ({
      tenantId: tenant.tenant_id,
      companyName: tenant.company_name,
      schemaName: tenant.schema_name,
      subscriptionTier: tenant.subscription_tier,
      subscriptionStatus: tenant.subscription_status,
      contactEmail: tenant.contact_email,
      cyprusVatNumber: tenant.cyprus_vat_number,
      trialEndsAt: tenant.trial_ends_at,
      currentPeriodEnd: tenant.current_period_end,
      isActive: tenant.is_active,
      createdAt: tenant.created_at
    }));
  }

  /**
   * Update tenant Stripe information
   */
  static async updateStripeInfo(
    tenantId: string,
    stripeCustomerId: string,
    stripeSubscriptionId?: string
  ): Promise<void> {
    const query = `
      UPDATE tenants
      SET
        stripe_customer_id = $1,
        stripe_subscription_id = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE tenant_id = $3
    `;

    await pool.query(query, [stripeCustomerId, stripeSubscriptionId, tenantId]);
  }

  /**
   * Update subscription status
   */
  static async updateSubscriptionStatus(
    tenantId: string,
    status: string,
    currentPeriodEnd?: Date
  ): Promise<void> {
    const query = `
      UPDATE tenants
      SET
        subscription_status = $1,
        current_period_end = COALESCE($2, current_period_end),
        updated_at = CURRENT_TIMESTAMP
      WHERE tenant_id = $3
    `;

    await pool.query(query, [status, currentPeriodEnd, tenantId]);
  }

  /**
   * Delete tenant and all associated data (DANGEROUS!)
   */
  static async deleteTenant(tenantId: string): Promise<void> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Get tenant schema name
      const tenantQuery = `SELECT schema_name FROM tenants WHERE tenant_id = $1`;
      const tenantResult = await client.query(tenantQuery, [tenantId]);

      if (tenantResult.rows.length === 0) {
        throw new Error(`Tenant ${tenantId} not found`);
      }

      const schemaName = tenantResult.rows[0].schema_name;

      // Drop the tenant schema (this removes all tenant data)
      await client.query(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`);

      // Delete tenant record
      await client.query(`DELETE FROM tenants WHERE tenant_id = $1`, [tenantId]);

      // Delete usage records
      await client.query(`DELETE FROM tenant_usage WHERE tenant_id = $1`, [tenantId]);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

export default TenantService;