-- Cyprus Access Control (CAC) Database Schema
-- Geofenced Invitation Orchestration Service
-- Container #31 - Universal Access Control for Cyprus Business Empire

-- Create database (run separately if needed)
-- CREATE DATABASE invitations;

-- Use the invitations database
-- \c invitations;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For advanced geographic queries if available

-- Enum types for better data integrity
CREATE TYPE business_type AS ENUM ('hotel', 'real_estate', 'company', 'restaurant', 'retail');
CREATE TYPE invitation_tier AS ENUM ('founder', 'early_access', 'beta', 'standard');
CREATE TYPE invitation_status AS ENUM ('created', 'sent', 'delivered', 'activated', 'trial', 'converted', 'expired');
CREATE TYPE courier_provider AS ENUM ('DHL', 'UPS', 'FedEx', 'HandDelivered');
CREATE TYPE location_verification_method AS ENUM ('gps', 'wifi', 'ip', 'cell_tower', 'hybrid');
CREATE TYPE courier_event_type AS ENUM (
    'created', 'picked_up', 'in_transit', 'out_for_delivery',
    'delivery_attempted', 'delivered', 'exception', 'returned'
);
CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high', 'critical');

-- Core invitations table
CREATE TABLE invitations (
    id SERIAL PRIMARY KEY,
    invitation_number VARCHAR(20) UNIQUE NOT NULL,
    business_type business_type NOT NULL,
    tier invitation_tier NOT NULL,
    status invitation_status DEFAULT 'created',

    -- Recipient information
    recipient_name VARCHAR(255) NOT NULL,
    recipient_title VARCHAR(255) NOT NULL,
    recipient_company VARCHAR(255) NOT NULL,
    recipient_address TEXT NOT NULL,
    recipient_email VARCHAR(255),
    recipient_mobile VARCHAR(50),
    business_registration_number VARCHAR(50), -- Cyprus business registration

    -- Geofencing data
    activation_lat DECIMAL(10, 8) NOT NULL,
    activation_lng DECIMAL(11, 8) NOT NULL,
    activation_radius INTEGER DEFAULT 100, -- meters
    wifi_networks JSONB DEFAULT '[]'::jsonb,
    ip_ranges JSONB DEFAULT '[]'::jsonb,
    alternative_locations JSONB DEFAULT '[]'::jsonb,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    signature_received TEXT,
    activated_at TIMESTAMP,
    trial_ends_at TIMESTAMP,
    converted_at TIMESTAMP,
    expired_at TIMESTAMP,

    -- Analytics counters
    delivery_attempts INTEGER DEFAULT 0,
    activation_attempts INTEGER DEFAULT 0,
    total_page_views INTEGER DEFAULT 0,
    last_seen_at TIMESTAMP,

    -- Configuration
    expiration_hours INTEGER DEFAULT 168, -- 7 days
    trial_days INTEGER DEFAULT 14,
    delivery_method courier_provider DEFAULT 'DHL',
    signature_required BOOLEAN DEFAULT true,
    tracking_webhooks BOOLEAN DEFAULT true,

    -- Platform access configuration
    platform_access JSONB DEFAULT '{
        "pmsAdmin": true,
        "marketplace": true,
        "compliance": true,
        "analytics": true
    }'::jsonb,

    -- Security and tracking
    qr_code_hash VARCHAR(64), -- SHA-256 hash of QR code content
    activation_secret_hash VARCHAR(64), -- Hashed SMS verification code
    device_limit INTEGER DEFAULT 3, -- Max devices for activation

    -- Indexes for performance
    INDEX idx_invitations_number (invitation_number),
    INDEX idx_invitations_status (status),
    INDEX idx_invitations_business_type (business_type),
    INDEX idx_invitations_tier (tier),
    INDEX idx_invitations_created_at (created_at),
    INDEX idx_invitations_trial_ends_at (trial_ends_at),
    INDEX idx_invitations_location (activation_lat, activation_lng)
);

-- Location verification attempts table
CREATE TABLE location_verifications (
    id SERIAL PRIMARY KEY,
    invitation_id INTEGER REFERENCES invitations(id) ON DELETE CASCADE,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Client location data
    client_lat DECIMAL(10, 8) NOT NULL,
    client_lng DECIMAL(11, 8) NOT NULL,
    distance_meters DECIMAL(10, 2),
    verification_method location_verification_method,
    success BOOLEAN NOT NULL,

    -- Additional location metadata
    accuracy_meters DECIMAL(8, 2),
    altitude DECIMAL(8, 2),
    heading DECIMAL(5, 2),
    speed DECIMAL(8, 2),

    -- Anti-spoofing indicators
    spoofing_indicators JSONB DEFAULT '{}'::jsonb,

    -- Request metadata
    client_ip INET,
    user_agent TEXT,
    request_headers JSONB DEFAULT '{}'::jsonb,

    -- Device fingerprinting
    device_fingerprint VARCHAR(64),

    INDEX idx_location_verifications_invitation_id (invitation_id),
    INDEX idx_location_verifications_attempted_at (attempted_at),
    INDEX idx_location_verifications_success (success),
    INDEX idx_location_verifications_client_ip (client_ip)
);

-- Courier tracking events table
CREATE TABLE courier_events (
    id SERIAL PRIMARY KEY,
    invitation_id INTEGER REFERENCES invitations(id) ON DELETE CASCADE,
    courier courier_provider NOT NULL,
    tracking_number VARCHAR(100),

    -- Event details
    event_type courier_event_type NOT NULL,
    event_timestamp TIMESTAMP NOT NULL,
    event_location TEXT,
    description TEXT,

    -- Signature data (for delivery events)
    signature_data JSONB,

    -- Raw webhook data from courier
    raw_webhook_data JSONB DEFAULT '{}'::jsonb,

    -- Processing metadata
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    webhook_verified BOOLEAN DEFAULT false,

    INDEX idx_courier_events_invitation_id (invitation_id),
    INDEX idx_courier_events_tracking_number (tracking_number),
    INDEX idx_courier_events_event_type (event_type),
    INDEX idx_courier_events_event_timestamp (event_timestamp)
);

-- Device fingerprints table
CREATE TABLE device_fingerprints (
    id SERIAL PRIMARY KEY,
    invitation_id INTEGER REFERENCES invitations(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Core fingerprint data
    fingerprint_hash VARCHAR(64) UNIQUE NOT NULL,
    user_agent TEXT,
    screen_resolution VARCHAR(20),
    timezone VARCHAR(50),
    language VARCHAR(10),
    platform VARCHAR(50),

    -- Browser capabilities
    cookie_enabled BOOLEAN,
    do_not_track BOOLEAN,
    plugins JSONB DEFAULT '[]'::jsonb,

    -- Advanced fingerprinting
    canvas_hash VARCHAR(64),
    webgl_hash VARCHAR(64),
    audio_context_hash VARCHAR(64),

    -- Usage tracking
    first_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_sessions INTEGER DEFAULT 1,
    is_activated_device BOOLEAN DEFAULT false,

    INDEX idx_device_fingerprints_invitation_id (invitation_id),
    INDEX idx_device_fingerprints_fingerprint_hash (fingerprint_hash),
    INDEX idx_device_fingerprints_created_at (created_at)
);

-- Trial sessions table
CREATE TABLE trial_sessions (
    id SERIAL PRIMARY KEY,
    invitation_id INTEGER REFERENCES invitations(id) ON DELETE CASCADE,

    -- Trial timing
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ends_at TIMESTAMP NOT NULL,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Usage metrics
    total_sessions INTEGER DEFAULT 0,
    total_duration_seconds INTEGER DEFAULT 0,
    features_used JSONB DEFAULT '[]'::jsonb,

    -- Conversion campaigns
    conversion_campaigns_sent JSONB DEFAULT '[]'::jsonb,
    urgency_level urgency_level DEFAULT 'low',

    -- Trial outcome
    converted BOOLEAN DEFAULT false,
    conversion_date TIMESTAMP,
    cancellation_reason TEXT,

    INDEX idx_trial_sessions_invitation_id (invitation_id),
    INDEX idx_trial_sessions_ends_at (ends_at),
    INDEX idx_trial_sessions_urgency_level (urgency_level)
);

-- Conversion analytics table
CREATE TABLE conversion_analytics (
    id SERIAL PRIMARY KEY,
    invitation_id INTEGER REFERENCES invitations(id) ON DELETE CASCADE,

    -- Funnel timestamps
    invitation_sent_at TIMESTAMP,
    courier_pickup_at TIMESTAMP,
    delivery_at TIMESTAMP,
    first_location_attempt_at TIMESTAMP,
    activation_at TIMESTAMP,
    trial_start_at TIMESTAMP,
    conversion_at TIMESTAMP,

    -- Duration metrics (in hours)
    delivery_duration_hours DECIMAL(8, 2),
    activation_duration_hours DECIMAL(8, 2),
    trial_duration_days DECIMAL(6, 2),

    -- Engagement metrics
    total_page_views INTEGER DEFAULT 0,
    unique_sessions INTEGER DEFAULT 0,
    average_session_duration DECIMAL(8, 2), -- seconds
    features_explored JSONB DEFAULT '[]'::jsonb,

    -- Conversion attribution
    last_touch_channel VARCHAR(100),
    conversion_source VARCHAR(100),
    conversion_campaign VARCHAR(100),

    -- Revenue metrics
    subscription_tier VARCHAR(50),
    monthly_value DECIMAL(10, 2),
    lifetime_value DECIMAL(10, 2),

    -- Geographic and device data
    activation_city VARCHAR(100),
    activation_country VARCHAR(2) DEFAULT 'CY',
    device_type VARCHAR(50),
    browser_type VARCHAR(50),

    -- Business intelligence
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_conversion_analytics_invitation_id (invitation_id),
    INDEX idx_conversion_analytics_conversion_at (conversion_at),
    INDEX idx_conversion_analytics_subscription_tier (subscription_tier)
);

-- QR code tracking table
CREATE TABLE qr_code_scans (
    id SERIAL PRIMARY KEY,
    invitation_id INTEGER REFERENCES invitations(id) ON DELETE CASCADE,
    scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Scanner details
    client_ip INET,
    user_agent TEXT,
    device_fingerprint VARCHAR(64),

    -- Location at scan time
    scan_lat DECIMAL(10, 8),
    scan_lng DECIMAL(11, 8),
    scan_accuracy DECIMAL(8, 2),

    -- Scan outcome
    scan_successful BOOLEAN,
    failure_reason TEXT,

    -- Security checks
    spoofing_detected BOOLEAN DEFAULT false,
    suspicious_activity BOOLEAN DEFAULT false,

    INDEX idx_qr_code_scans_invitation_id (invitation_id),
    INDEX idx_qr_code_scans_scanned_at (scanned_at),
    INDEX idx_qr_code_scans_client_ip (client_ip)
);

-- SMS verification codes table
CREATE TABLE sms_verifications (
    id SERIAL PRIMARY KEY,
    invitation_id INTEGER REFERENCES invitations(id) ON DELETE CASCADE,
    mobile_number VARCHAR(50) NOT NULL,

    -- Verification details
    verification_code VARCHAR(10) NOT NULL,
    code_hash VARCHAR(64) NOT NULL, -- Hashed version for security
    expires_at TIMESTAMP NOT NULL,

    -- Status tracking
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,

    -- SMS provider details
    sms_provider VARCHAR(50),
    sms_sid VARCHAR(100),
    delivery_status VARCHAR(50),

    INDEX idx_sms_verifications_invitation_id (invitation_id),
    INDEX idx_sms_verifications_mobile_number (mobile_number),
    INDEX idx_sms_verifications_expires_at (expires_at)
);

-- Cyprus business registry cache table
CREATE TABLE cyprus_business_registry (
    id SERIAL PRIMARY KEY,
    registration_number VARCHAR(50) UNIQUE NOT NULL,

    -- Company details
    company_name VARCHAR(255) NOT NULL,
    registered_address TEXT NOT NULL,
    incorporation_date DATE,
    business_type VARCHAR(100),
    status VARCHAR(50),

    -- Financial information
    authorized_capital DECIMAL(15, 2),
    vat_number VARCHAR(50),

    -- Directors information
    directors JSONB DEFAULT '[]'::jsonb,

    -- Data freshness
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cache_expires_at TIMESTAMP,

    INDEX idx_cyprus_business_registry_registration_number (registration_number),
    INDEX idx_cyprus_business_registry_company_name (company_name),
    INDEX idx_cyprus_business_registry_vat_number (vat_number)
);

-- System configuration table
CREATE TABLE system_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,

    -- Configuration metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),

    INDEX idx_system_config_config_key (config_key)
);

-- Audit log table for security and compliance
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER,
    action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE

    -- Change details
    old_values JSONB,
    new_values JSONB,

    -- Actor information
    user_id VARCHAR(100),
    user_ip INET,
    user_agent TEXT,

    -- Timing
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_audit_logs_table_name (table_name),
    INDEX idx_audit_logs_record_id (record_id),
    INDEX idx_audit_logs_action (action),
    INDEX idx_audit_logs_performed_at (performed_at)
);

-- Create triggers for automated functionality

-- Update last_seen_at trigger for invitations
CREATE OR REPLACE FUNCTION update_invitation_last_seen()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE invitations
    SET last_seen_at = CURRENT_TIMESTAMP
    WHERE id = NEW.invitation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_invitation_last_seen
    AFTER INSERT ON location_verifications
    FOR EACH ROW
    EXECUTE FUNCTION update_invitation_last_seen();

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (table_name, record_id, action, new_values, performed_at)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW), CURRENT_TIMESTAMP);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, performed_at)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), CURRENT_TIMESTAMP);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_values, performed_at)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD), CURRENT_TIMESTAMP);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to critical tables
CREATE TRIGGER audit_invitations
    AFTER INSERT OR UPDATE OR DELETE ON invitations
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_location_verifications
    AFTER INSERT OR UPDATE OR DELETE ON location_verifications
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

-- Insert default system configuration
INSERT INTO system_config (config_key, config_value, description) VALUES
    ('default_geofencing', '{
        "defaultRadius": 100,
        "maxRadius": 1000,
        "minRadius": 50,
        "verificationMethods": ["gps", "wifi", "ip"],
        "antiSpoofingEnabled": true,
        "vpnDetectionEnabled": true,
        "deviceFingerprintingEnabled": true
    }', 'Default geofencing configuration'),

    ('trial_config', '{
        "defaultDays": 14,
        "warningDays": 3,
        "countdownUpdateInterval": 60000,
        "urgencyThresholds": {
            "high": 3,
            "critical": 1
        }
    }', 'Trial management configuration'),

    ('invitation_sequences', '{
        "hotel": 1,
        "real_estate": 1,
        "company": 1
    }', 'Next invitation numbers for each business type'),

    ('cyprus_bounds', '{
        "north": 35.7011,
        "south": 34.5588,
        "east": 34.6049,
        "west": 32.2567
    }', 'Cyprus geographic boundaries for validation'),

    ('business_hours', '{
        "start": "09:00",
        "end": "18:00",
        "days": [1, 2, 3, 4, 5],
        "timezone": "Europe/Nicosia"
    }', 'Cyprus business hours configuration');

-- Create views for common queries

-- Active invitations view
CREATE VIEW active_invitations AS
SELECT
    i.*,
    CASE
        WHEN i.trial_ends_at IS NOT NULL AND i.trial_ends_at > CURRENT_TIMESTAMP
        THEN EXTRACT(EPOCH FROM (i.trial_ends_at - CURRENT_TIMESTAMP)) / 86400
        ELSE NULL
    END as days_remaining,

    CASE
        WHEN i.trial_ends_at IS NOT NULL AND i.trial_ends_at <= CURRENT_TIMESTAMP + INTERVAL '1 day'
        THEN 'critical'
        WHEN i.trial_ends_at IS NOT NULL AND i.trial_ends_at <= CURRENT_TIMESTAMP + INTERVAL '3 days'
        THEN 'high'
        WHEN i.trial_ends_at IS NOT NULL AND i.trial_ends_at <= CURRENT_TIMESTAMP + INTERVAL '7 days'
        THEN 'medium'
        ELSE 'low'
    END as urgency_level
FROM invitations i
WHERE i.status IN ('sent', 'delivered', 'activated', 'trial')
AND (i.expired_at IS NULL OR i.expired_at > CURRENT_TIMESTAMP);

-- Conversion funnel view
CREATE VIEW conversion_funnel AS
SELECT
    business_type,
    tier,
    COUNT(*) as total_invitations,
    COUNT(sent_at) as sent,
    COUNT(delivered_at) as delivered,
    COUNT(activated_at) as activated,
    COUNT(CASE WHEN status = 'trial' THEN 1 END) as in_trial,
    COUNT(converted_at) as converted,

    -- Conversion rates
    ROUND(COUNT(delivered_at)::decimal / NULLIF(COUNT(sent_at), 0) * 100, 2) as delivery_rate,
    ROUND(COUNT(activated_at)::decimal / NULLIF(COUNT(delivered_at), 0) * 100, 2) as activation_rate,
    ROUND(COUNT(converted_at)::decimal / NULLIF(COUNT(activated_at), 0) * 100, 2) as conversion_rate,
    ROUND(COUNT(converted_at)::decimal / NULLIF(COUNT(*), 0) * 100, 2) as overall_conversion_rate
FROM invitations
GROUP BY business_type, tier
ORDER BY business_type, tier;

-- Geographic performance view
CREATE VIEW geographic_performance AS
SELECT
    SUBSTRING(recipient_address FROM '([^,]+)$') as city,
    business_type,
    COUNT(*) as total_invitations,
    COUNT(activated_at) as activations,
    COUNT(converted_at) as conversions,
    ROUND(AVG(EXTRACT(EPOCH FROM (activated_at - delivered_at)) / 3600), 2) as avg_activation_hours,
    ROUND(COUNT(converted_at)::decimal / NULLIF(COUNT(activated_at), 0) * 100, 2) as conversion_rate
FROM invitations
WHERE delivered_at IS NOT NULL
GROUP BY city, business_type
HAVING COUNT(*) >= 3  -- Only show cities with meaningful data
ORDER BY conversion_rate DESC;

-- Performance optimization: Create additional indexes
CREATE INDEX CONCURRENTLY idx_invitations_compound_status_type
ON invitations (status, business_type, created_at);

CREATE INDEX CONCURRENTLY idx_location_verifications_compound
ON location_verifications (invitation_id, attempted_at, success);

CREATE INDEX CONCURRENTLY idx_courier_events_compound
ON courier_events (invitation_id, event_type, event_timestamp);

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO invitation_app;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO invitation_app;

-- Database setup complete
-- This schema supports:
-- 1. Universal invitation management across all business types
-- 2. Multi-vector geofencing with anti-spoofing
-- 3. Real-time courier tracking integration
-- 4. Comprehensive analytics and conversion tracking
-- 5. Device fingerprinting and security
-- 6. Trial management with countdown functionality
-- 7. Cyprus business registry integration
-- 8. Audit logging for compliance
-- 9. Performance optimization with indexes and views
-- 10. Scalable architecture for Container #31