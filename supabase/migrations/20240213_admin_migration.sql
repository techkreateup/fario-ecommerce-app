-- =============================================
-- FARIO: Admin Settings & Customer Stats Migration
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. SETTINGS TABLE (Singleton Row Pattern)
-- Drop old table if it exists with wrong schema
DROP TRIGGER IF EXISTS settings_updated_at ON settings;
DROP FUNCTION IF EXISTS update_settings_timestamp();
DROP POLICY IF EXISTS "Admins can read settings" ON settings;
DROP POLICY IF EXISTS "Admins can update settings" ON settings;
DROP TABLE IF EXISTS settings;

CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name TEXT NOT NULL DEFAULT 'Fario India',
    support_email TEXT NOT NULL DEFAULT 'support@fario.in',
    store_address TEXT NOT NULL DEFAULT '123 Commerce St, Mumbai, MH',
    time_zone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    logo_url TEXT DEFAULT '',

    -- Payment
    stripe_enabled BOOLEAN DEFAULT true,
    stripe_key TEXT DEFAULT '',
    paypal_enabled BOOLEAN DEFAULT false,
    paypal_client_id TEXT DEFAULT '',
    test_mode BOOLEAN DEFAULT false,

    -- Shipping & Tax
    flat_rate_shipping NUMERIC DEFAULT 150,
    free_shipping_threshold NUMERIC DEFAULT 2000,
    tax_rate NUMERIC DEFAULT 18,
    tax_included BOOLEAN DEFAULT true,

    -- Notifications
    notify_order_email BOOLEAN DEFAULT true,
    notify_low_stock_email BOOLEAN DEFAULT true,
    notify_order_sms BOOLEAN DEFAULT false,

    -- Security
    master_key TEXT DEFAULT '',

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default row if table is empty
INSERT INTO settings (store_name)
SELECT 'Fario India'
WHERE NOT EXISTS (SELECT 1 FROM settings);

-- RLS: Only admins can read/write settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read settings"
    ON settings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can update settings"
    ON settings FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Auto-update updated_at on change
CREATE OR REPLACE FUNCTION update_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_settings_timestamp();


-- 2. CUSTOMER STATS VIEW
-- Aggregates order data per user for the Admin Customers page.
-- This replaces the heavy client-side JS aggregation.
CREATE OR REPLACE VIEW customer_stats_view AS
SELECT
    p.id,
    p.name,
    p.email,
    p.phone,
    p.createdat AS joined,
    COALESCE(SUM(o.total), 0) AS total_spent,
    COUNT(o.id) AS order_count
FROM profiles p
LEFT JOIN orders o ON o.user_id = p.id
GROUP BY p.id, p.name, p.email, p.phone, p.createdat;

-- Grant access to the view via RLS on underlying tables
-- (Views inherit RLS from the tables they query)
