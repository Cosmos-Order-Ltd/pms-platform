-- PMS Platform Multi-Tenant Database Setup
-- Creates tenant isolation and subscription management

-- Create tenant template schema
CREATE SCHEMA IF NOT EXISTS tenant_template;

-- Template tables (will be copied for each tenant)
CREATE TABLE IF NOT EXISTS tenant_template.properties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    license_number VARCHAR(100),
    capacity INTEGER DEFAULT 1,
    property_type VARCHAR(50) DEFAULT 'hotel',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tenant_template.guests (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    passport_number VARCHAR(50),
    nationality VARCHAR(3),
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tenant_template.bookings (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES tenant_template.properties(id),
    guest_id INTEGER REFERENCES tenant_template.guests(id),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    room_number VARCHAR(10),
    total_amount DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'EUR',
    status VARCHAR(20) DEFAULT 'confirmed',
    police_registration_sent BOOLEAN DEFAULT FALSE,
    police_registration_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tenant_template.invoices (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES tenant_template.bookings(id),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    vat_rate DECIMAL(4,3) DEFAULT 0.090, -- Cyprus VAT 9%
    vat_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATE,
    status VARCHAR(20) DEFAULT 'pending'
);

-- Master tenants table
CREATE TABLE IF NOT EXISTS public.tenants (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    schema_name VARCHAR(50) NOT NULL,
    subscription_tier VARCHAR(50) DEFAULT 'basic',
    subscription_status VARCHAR(20) DEFAULT 'trial',

    -- Cyprus compliance details
    cyprus_vat_number VARCHAR(20),
    police_api_key VARCHAR(255),
    tfa_api_key VARCHAR(255),

    -- Business details
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20),
    bank_account_iban VARCHAR(34),

    -- Subscription management
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    trial_ends_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '14 days'),
    current_period_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    current_period_end TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1 month'),

    -- Usage limits based on tier
    max_properties INTEGER DEFAULT 1,
    max_bookings_per_month INTEGER DEFAULT 100,
    max_api_calls_per_day INTEGER DEFAULT 1000,

    -- Tracking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Subscription tiers pricing table
CREATE TABLE IF NOT EXISTS public.subscription_tiers (
    tier_name VARCHAR(50) PRIMARY KEY,
    monthly_price DECIMAL(8,2) NOT NULL,
    max_properties INTEGER NOT NULL,
    max_bookings_per_month INTEGER NOT NULL,
    max_api_calls_per_day INTEGER NOT NULL,
    features JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default pricing tiers
INSERT INTO public.subscription_tiers (tier_name, monthly_price, max_properties, max_bookings_per_month, max_api_calls_per_day, features)
VALUES
    ('basic', 199.00, 1, 100, 1000, '{"cyprus_compliance": true, "police_integration": true, "vat_reporting": true}'),
    ('professional', 499.00, 5, 1000, 10000, '{"cyprus_compliance": true, "police_integration": true, "vat_reporting": true, "channel_manager": true, "analytics": true}'),
    ('enterprise', 1299.00, 50, 10000, 100000, '{"cyprus_compliance": true, "police_integration": true, "vat_reporting": true, "channel_manager": true, "analytics": true, "white_label": true, "api_access": true}')
ON CONFLICT (tier_name) DO UPDATE SET
    monthly_price = EXCLUDED.monthly_price,
    max_properties = EXCLUDED.max_properties,
    max_bookings_per_month = EXCLUDED.max_bookings_per_month,
    max_api_calls_per_day = EXCLUDED.max_api_calls_per_day,
    features = EXCLUDED.features;

-- Usage tracking table
CREATE TABLE IF NOT EXISTS public.tenant_usage (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) REFERENCES public.tenants(tenant_id),
    usage_date DATE DEFAULT CURRENT_DATE,
    metric_name VARCHAR(50) NOT NULL, -- 'properties', 'bookings', 'api_calls'
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, usage_date, metric_name)
);

-- Function to create new tenant schema
CREATE OR REPLACE FUNCTION create_tenant_schema(p_tenant_id VARCHAR)
RETURNS void AS $$
DECLARE
    schema_name VARCHAR := 'tenant_' || p_tenant_id;
BEGIN
    -- Create schema
    EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', schema_name);

    -- Create tables from template
    EXECUTE format('CREATE TABLE %I.properties (LIKE tenant_template.properties INCLUDING ALL)', schema_name);
    EXECUTE format('CREATE TABLE %I.guests (LIKE tenant_template.guests INCLUDING ALL)', schema_name);
    EXECUTE format('CREATE TABLE %I.bookings (LIKE tenant_template.bookings INCLUDING ALL)', schema_name);
    EXECUTE format('CREATE TABLE %I.invoices (LIKE tenant_template.invoices INCLUDING ALL)', schema_name);

    -- Add foreign key constraints
    EXECUTE format('ALTER TABLE %I.bookings ADD CONSTRAINT fk_property FOREIGN KEY (property_id) REFERENCES %I.properties(id)', schema_name, schema_name);
    EXECUTE format('ALTER TABLE %I.bookings ADD CONSTRAINT fk_guest FOREIGN KEY (guest_id) REFERENCES %I.guests(id)', schema_name, schema_name);
    EXECUTE format('ALTER TABLE %I.invoices ADD CONSTRAINT fk_booking FOREIGN KEY (booking_id) REFERENCES %I.bookings(id)', schema_name, schema_name);

    -- Create indexes for performance
    EXECUTE format('CREATE INDEX idx_%s_properties_name ON %I.properties(name)', p_tenant_id, schema_name);
    EXECUTE format('CREATE INDEX idx_%s_bookings_dates ON %I.bookings(check_in, check_out)', p_tenant_id, schema_name);
    EXECUTE format('CREATE INDEX idx_%s_guests_passport ON %I.guests(passport_number)', p_tenant_id, schema_name);

    RAISE NOTICE 'Created tenant schema: %', schema_name;
END;
$$ LANGUAGE plpgsql;

-- Function to track usage
CREATE OR REPLACE FUNCTION track_tenant_usage(p_tenant_id VARCHAR, p_metric VARCHAR, p_count INTEGER DEFAULT 1)
RETURNS void AS $$
BEGIN
    INSERT INTO public.tenant_usage (tenant_id, metric_name, usage_count)
    VALUES (p_tenant_id, p_metric, p_count)
    ON CONFLICT (tenant_id, usage_date, metric_name)
    DO UPDATE SET usage_count = tenant_usage.usage_count + p_count;
END;
$$ LANGUAGE plpgsql;

-- Function to check usage limits
CREATE OR REPLACE FUNCTION check_usage_limit(p_tenant_id VARCHAR, p_metric VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    current_usage INTEGER;
    usage_limit INTEGER;
    tenant_tier VARCHAR;
BEGIN
    -- Get tenant's subscription tier
    SELECT subscription_tier INTO tenant_tier
    FROM public.tenants
    WHERE tenant_id = p_tenant_id;

    -- Get current month usage
    SELECT COALESCE(SUM(usage_count), 0) INTO current_usage
    FROM public.tenant_usage
    WHERE tenant_id = p_tenant_id
    AND metric_name = p_metric
    AND usage_date >= date_trunc('month', CURRENT_DATE);

    -- Get limit based on metric and tier
    IF p_metric = 'properties' THEN
        SELECT max_properties INTO usage_limit FROM public.subscription_tiers WHERE tier_name = tenant_tier;
    ELSIF p_metric = 'bookings' THEN
        SELECT max_bookings_per_month INTO usage_limit FROM public.subscription_tiers WHERE tier_name = tenant_tier;
    ELSIF p_metric = 'api_calls' THEN
        SELECT max_api_calls_per_day INTO usage_limit FROM public.subscription_tiers WHERE tier_name = tenant_tier;
        -- For API calls, check daily usage
        SELECT COALESCE(SUM(usage_count), 0) INTO current_usage
        FROM public.tenant_usage
        WHERE tenant_id = p_tenant_id
        AND metric_name = p_metric
        AND usage_date = CURRENT_DATE;
    END IF;

    RETURN current_usage < usage_limit;
END;
$$ LANGUAGE plpgsql;

-- Create demo tenant for testing
DO $$
BEGIN
    -- Insert demo tenant
    INSERT INTO public.tenants (
        tenant_id,
        company_name,
        schema_name,
        subscription_tier,
        contact_email,
        cyprus_vat_number,
        max_properties,
        max_bookings_per_month,
        max_api_calls_per_day
    ) VALUES (
        'demo_hotel',
        'Demo Hotel Cyprus',
        'tenant_demo_hotel',
        'professional',
        'demo@cyprushotel.com',
        'CY10259033P',
        5,
        1000,
        10000
    ) ON CONFLICT (tenant_id) DO NOTHING;

    -- Create schema for demo tenant
    PERFORM create_tenant_schema('demo_hotel');

    RAISE NOTICE 'Demo tenant created successfully';
END
$$;

-- Add row level security policies (for extra security)
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT USAGE ON SCHEMA tenant_template TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA tenant_template TO postgres;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA tenant_template TO postgres;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.tenants TO postgres;
GRANT SELECT ON public.subscription_tiers TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tenant_usage TO postgres;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON SCHEMA tenant_template IS 'Template schema for creating new tenant schemas';
COMMENT ON TABLE public.tenants IS 'Master table for managing all tenants and their subscriptions';
COMMENT ON TABLE public.subscription_tiers IS 'Pricing and feature definitions for subscription tiers';
COMMENT ON FUNCTION create_tenant_schema(VARCHAR) IS 'Creates a new isolated schema for a tenant with all required tables';
COMMENT ON FUNCTION track_tenant_usage(VARCHAR, VARCHAR, INTEGER) IS 'Tracks usage metrics for billing and limit enforcement';
COMMENT ON FUNCTION check_usage_limit(VARCHAR, VARCHAR) IS 'Checks if tenant has exceeded their subscription limits';