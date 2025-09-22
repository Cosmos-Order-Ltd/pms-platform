-- PostgreSQL Performance Optimization for Multi-Tenant SaaS
-- Optimized for 100GB RAM system with 90GB available
-- Target: 1000+ concurrent users across multiple tenants

-- Memory Configuration (using 25GB of the available 90GB)
ALTER SYSTEM SET shared_buffers = '25GB';                    -- 25% of available RAM
ALTER SYSTEM SET effective_cache_size = '60GB';              -- 60% of available RAM (OS + PostgreSQL cache)
ALTER SYSTEM SET work_mem = '256MB';                         -- Per-query memory for sorting/hashing
ALTER SYSTEM SET maintenance_work_mem = '4GB';               -- Memory for maintenance operations
ALTER SYSTEM SET autovacuum_work_mem = '2GB';                -- Memory for autovacuum

-- Connection and Concurrency Settings
ALTER SYSTEM SET max_connections = 2000;                     -- Support for high concurrent load
ALTER SYSTEM SET superuser_reserved_connections = 10;        -- Reserve connections for admins
ALTER SYSTEM SET max_worker_processes = 32;                  -- Parallel processing workers
ALTER SYSTEM SET max_parallel_workers = 24;                  -- Max parallel workers across all queries
ALTER SYSTEM SET max_parallel_workers_per_gather = 8;        -- Max parallel workers per query
ALTER SYSTEM SET max_parallel_maintenance_workers = 8;       -- Parallel workers for maintenance

-- Query Planning and Performance
ALTER SYSTEM SET random_page_cost = 1.1;                     -- SSD-optimized (assuming SSD storage)
ALTER SYSTEM SET seq_page_cost = 1.0;                        -- Base cost for sequential reads
ALTER SYSTEM SET cpu_tuple_cost = 0.01;                      -- CPU cost per tuple
ALTER SYSTEM SET cpu_index_tuple_cost = 0.005;               -- CPU cost per index tuple
ALTER SYSTEM SET cpu_operator_cost = 0.0025;                 -- CPU cost per operator
ALTER SYSTEM SET effective_io_concurrency = 200;             -- Concurrent I/O operations (SSD)

-- Checkpoint and WAL Configuration
ALTER SYSTEM SET checkpoint_completion_target = 0.9;         -- Spread checkpoints over 90% of interval
ALTER SYSTEM SET checkpoint_timeout = '15min';               -- Checkpoint every 15 minutes
ALTER SYSTEM SET max_wal_size = '16GB';                      -- Large WAL for write-heavy workloads
ALTER SYSTEM SET min_wal_size = '4GB';                       -- Minimum WAL size
ALTER SYSTEM SET wal_buffers = '64MB';                       -- WAL buffer size
ALTER SYSTEM SET wal_writer_delay = '100ms';                 -- WAL writer frequency

-- Autovacuum Settings for Multi-Tenant
ALTER SYSTEM SET autovacuum = on;                            -- Enable autovacuum
ALTER SYSTEM SET autovacuum_max_workers = 8;                 -- More workers for multi-tenant
ALTER SYSTEM SET autovacuum_naptime = '30s';                 -- Check for vacuum every 30 seconds
ALTER SYSTEM SET autovacuum_vacuum_threshold = 50;           -- Vacuum after 50 dead tuples
ALTER SYSTEM SET autovacuum_vacuum_scale_factor = 0.1;       -- Vacuum after 10% of table is dead
ALTER SYSTEM SET autovacuum_analyze_threshold = 50;          -- Analyze after 50 changed tuples
ALTER SYSTEM SET autovacuum_analyze_scale_factor = 0.05;     -- Analyze after 5% of table changes

-- Logging and Monitoring
ALTER SYSTEM SET log_destination = 'stderr';
ALTER SYSTEM SET logging_collector = on;
ALTER SYSTEM SET log_min_duration_statement = '1000ms';      -- Log slow queries (1 second+)
ALTER SYSTEM SET log_statement = 'none';                     -- Don't log all statements
ALTER SYSTEM SET log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h ';
ALTER SYSTEM SET log_checkpoints = on;                       -- Log checkpoint activity
ALTER SYSTEM SET log_connections = on;                       -- Log connections
ALTER SYSTEM SET log_disconnections = on;                    -- Log disconnections
ALTER SYSTEM SET log_lock_waits = on;                        -- Log lock waits

-- Statistics and Query Planning
ALTER SYSTEM SET track_activities = on;                      -- Track running queries
ALTER SYSTEM SET track_counts = on;                          -- Track table/index usage
ALTER SYSTEM SET track_io_timing = on;                       -- Track I/O timing
ALTER SYSTEM SET track_functions = 'all';                    -- Track function calls
ALTER SYSTEM SET default_statistics_target = 100;           -- Default statistics target

-- Multi-Tenant Specific Settings
ALTER SYSTEM SET temp_file_limit = '10GB';                   -- Temporary file size limit
ALTER SYSTEM SET lock_timeout = '30s';                       -- Lock timeout
ALTER SYSTEM SET statement_timeout = '300s';                 -- Statement timeout (5 minutes)
ALTER SYSTEM SET idle_in_transaction_session_timeout = '60s'; -- Idle transaction timeout

-- Network and Security
ALTER SYSTEM SET listen_addresses = '*';                     -- Listen on all addresses
ALTER SYSTEM SET ssl = off;                                  -- SSL disabled for internal network
ALTER SYSTEM SET max_pred_locks_per_transaction = 128;       -- Serializable transaction locks

-- Reload configuration
SELECT pg_reload_conf();

-- Create indexes for multi-tenant performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tenants_tenant_id ON tenants(tenant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tenants_subscription_status ON tenants(subscription_status) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tenants_trial_end ON tenants(trial_ends_at) WHERE subscription_status = 'trial';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tenant_usage_date_tenant ON tenant_usage(usage_date, tenant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tenant_usage_metric_tenant ON tenant_usage(metric_name, tenant_id);

-- Create connection pooling function for tenants
CREATE OR REPLACE FUNCTION get_tenant_connection_limit(p_tier TEXT)
RETURNS INTEGER AS $$
BEGIN
    RETURN CASE
        WHEN p_tier = 'basic' THEN 50
        WHEN p_tier = 'professional' THEN 200
        WHEN p_tier = 'enterprise' THEN 500
        ELSE 20
    END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create performance monitoring view
CREATE OR REPLACE VIEW tenant_performance_stats AS
SELECT
    t.tenant_id,
    t.company_name,
    t.subscription_tier,
    COALESCE(connections.active_connections, 0) as active_connections,
    COALESCE(usage.daily_queries, 0) as daily_queries,
    COALESCE(usage.avg_query_time, 0) as avg_query_time_ms
FROM tenants t
LEFT JOIN (
    SELECT
        application_name as tenant_id,
        COUNT(*) as active_connections
    FROM pg_stat_activity
    WHERE state = 'active'
    GROUP BY application_name
) connections ON connections.tenant_id = t.tenant_id
LEFT JOIN (
    SELECT
        tenant_id,
        SUM(usage_count) as daily_queries,
        AVG(usage_count::numeric) as avg_query_time
    FROM tenant_usage
    WHERE usage_date = CURRENT_DATE
    AND metric_name = 'api_calls'
    GROUP BY tenant_id
) usage ON usage.tenant_id = t.tenant_id;

-- Performance monitoring queries
CREATE OR REPLACE VIEW slow_queries AS
SELECT
    query,
    calls,
    total_time,
    mean_time,
    rows,
    100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements
WHERE mean_time > 1000  -- Queries taking more than 1 second
ORDER BY mean_time DESC;

-- Database size monitoring
CREATE OR REPLACE VIEW tenant_schema_sizes AS
SELECT
    schema_name,
    pg_size_pretty(pg_total_relation_size(quote_ident(schema_name)||'.properties')) as properties_size,
    pg_size_pretty(pg_total_relation_size(quote_ident(schema_name)||'.bookings')) as bookings_size,
    pg_size_pretty(pg_total_relation_size(quote_ident(schema_name)||'.guests')) as guests_size,
    pg_size_pretty(pg_total_relation_size(quote_ident(schema_name)||'.invoices')) as invoices_size
FROM tenants
WHERE schema_name LIKE 'tenant_%';

-- Trigger to automatically update tenant limits when tier changes
CREATE OR REPLACE FUNCTION update_tenant_limits()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.subscription_tier != OLD.subscription_tier THEN
        UPDATE tenants
        SET
            max_properties = (SELECT max_properties FROM subscription_tiers WHERE tier_name = NEW.subscription_tier),
            max_bookings_per_month = (SELECT max_bookings_per_month FROM subscription_tiers WHERE tier_name = NEW.subscription_tier),
            max_api_calls_per_day = (SELECT max_api_calls_per_day FROM subscription_tiers WHERE tier_name = NEW.subscription_tier)
        WHERE tenant_id = NEW.tenant_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tenant_limits
    AFTER UPDATE OF subscription_tier ON tenants
    FOR EACH ROW
    EXECUTE FUNCTION update_tenant_limits();

-- Connection pool management
CREATE OR REPLACE FUNCTION manage_tenant_connections()
RETURNS void AS $$
DECLARE
    tenant_record RECORD;
    connection_limit INTEGER;
    current_connections INTEGER;
BEGIN
    FOR tenant_record IN
        SELECT tenant_id, subscription_tier
        FROM tenants
        WHERE is_active = true
    LOOP
        connection_limit := get_tenant_connection_limit(tenant_record.subscription_tier);

        SELECT COUNT(*)
        INTO current_connections
        FROM pg_stat_activity
        WHERE application_name = tenant_record.tenant_id;

        -- Log if tenant is approaching connection limit
        IF current_connections > (connection_limit * 0.8) THEN
            INSERT INTO tenant_usage (tenant_id, metric_name, usage_count)
            VALUES (tenant_record.tenant_id, 'connection_limit_warning', 1)
            ON CONFLICT (tenant_id, usage_date, metric_name)
            DO UPDATE SET usage_count = tenant_usage.usage_count + 1;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create background job to run connection management
-- This would be called by a cron job or scheduled task
COMMENT ON FUNCTION manage_tenant_connections() IS 'Run this function every 5 minutes to monitor tenant connections';

-- Grant permissions for application users
GRANT SELECT ON tenant_performance_stats TO pms;
GRANT SELECT ON slow_queries TO pms;
GRANT SELECT ON tenant_schema_sizes TO pms;

-- Analyze all tables to update statistics
ANALYZE;

-- Show current configuration
SELECT
    name,
    setting,
    unit,
    context
FROM pg_settings
WHERE name IN (
    'shared_buffers',
    'effective_cache_size',
    'work_mem',
    'maintenance_work_mem',
    'max_connections',
    'random_page_cost',
    'effective_io_concurrency'
)
ORDER BY name;

COMMENT ON DATABASE pms_production IS 'Multi-tenant PMS platform optimized for 1000+ concurrent users with 25GB shared buffers and 60GB effective cache';

-- Create performance baseline for monitoring
INSERT INTO tenant_usage (tenant_id, metric_name, usage_count)
SELECT
    'system',
    'optimization_timestamp',
    EXTRACT(epoch FROM CURRENT_TIMESTAMP)::INTEGER
ON CONFLICT DO NOTHING;