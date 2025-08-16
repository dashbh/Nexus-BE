-- Initialize Nexus database
-- This script runs when the PostgreSQL container starts for the first time

-- Create additional databases if needed
CREATE DATABASE nexus_test;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE nexus_dev TO nexus;
GRANT ALL PRIVILEGES ON DATABASE nexus_test TO nexus;

-- Create schemas
\c nexus_dev;
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS metrics;

-- Grant schema permissions
GRANT ALL ON SCHEMA auth TO nexus;
GRANT ALL ON SCHEMA audit TO nexus;
GRANT ALL ON SCHEMA metrics TO nexus;

-- Create audit table for tracking changes
CREATE TABLE IF NOT EXISTS audit.audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(255) NOT NULL,
    operation VARCHAR(10) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    user_id UUID,
    correlation_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create metrics table for application metrics
CREATE TABLE IF NOT EXISTS metrics.application_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(255) NOT NULL,
    metric_value NUMERIC NOT NULL,
    labels JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON audit.audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit.audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_correlation_id ON audit.audit_log(correlation_id);
CREATE INDEX IF NOT EXISTS idx_metrics_name_timestamp ON metrics.application_metrics(metric_name, timestamp);

-- Switch to test database and create similar structure
\c nexus_test;
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS metrics;

GRANT ALL ON SCHEMA auth TO nexus;
GRANT ALL ON SCHEMA audit TO nexus;
GRANT ALL ON SCHEMA metrics TO nexus;