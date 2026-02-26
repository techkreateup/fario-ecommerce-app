
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 🎯 PHASE 1: SUPABASE DATABASE SETUP (A TO Z)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- STEP 1.2: DROP OLD TABLE IF EXISTS (CLEAN SLATE)
DROP TABLE IF EXISTS coupons CASCADE;

-- STEP 1.3: CREATE COUPONS TABLE (PERFECT SCHEMA)
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    discounttype TEXT NOT NULL CHECK (discounttype IN ('percentage', 'fixed')),
    discountvalue NUMERIC NOT NULL CHECK (discountvalue > 0),
    minordervalue NUMERIC DEFAULT 0 CHECK (minordervalue >= 0),
    maxdiscount NUMERIC CHECK (maxdiscount >= 0),
    usagelimit INTEGER CHECK (usagelimit > 0),
    usedcount INTEGER DEFAULT 0 CHECK (usedcount >= 0),
    isactive BOOLEAN DEFAULT true NOT NULL,
    validfrom TIMESTAMPTZ DEFAULT NOW(),
    validuntil TIMESTAMPTZ,
    createdat TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updatedat TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Documentation
COMMENT ON TABLE coupons IS 'Stores discount coupons for e-commerce';
COMMENT ON COLUMN coupons.code IS 'Unique coupon code (e.g., SAVE20)';
COMMENT ON COLUMN coupons.discounttype IS 'Type: percentage or fixed';
COMMENT ON COLUMN coupons.discountvalue IS 'Discount amount (% or rupees)';
COMMENT ON COLUMN coupons.minordervalue IS 'Minimum order value to apply coupon';
COMMENT ON COLUMN coupons.maxdiscount IS 'Maximum discount cap for percentage coupons';
COMMENT ON COLUMN coupons.usagelimit IS 'Total usage limit (null = unlimited)';
COMMENT ON COLUMN coupons.usedcount IS 'Times coupon has been used';

-- STEP 1.4: CREATE INDEXES FOR PERFORMANCE
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_isactive ON coupons(isactive);
CREATE INDEX idx_coupons_validuntil ON coupons(validuntil);
CREATE INDEX idx_coupons_createdat ON coupons(createdat DESC);

-- STEP 1.5: ENABLE ROW LEVEL SECURITY
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- STEP 1.6: CREATE RLS POLICIES (SECURITY)
-- Policy 1: Anyone can view ACTIVE coupons (for cart usage)
DROP POLICY IF EXISTS "allow_view_active_coupons" ON coupons;
CREATE POLICY "allow_view_active_coupons" ON coupons
    FOR SELECT
    USING (isactive = true);

-- Policy 2: Authenticated users can view all coupons (for admin)
DROP POLICY IF EXISTS "allow_authenticated_view_all" ON coupons;
CREATE POLICY "allow_authenticated_view_all" ON coupons
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy 3: Only admins can INSERT coupons
DROP POLICY IF EXISTS "allow_admin_insert" ON coupons;
CREATE POLICY "allow_admin_insert" ON coupons
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy 4: Only admins can UPDATE coupons
DROP POLICY IF EXISTS "allow_admin_update" ON coupons;
CREATE POLICY "allow_admin_update" ON coupons
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy 5: Only admins can DELETE coupons
DROP POLICY IF EXISTS "allow_admin_delete" ON coupons;
CREATE POLICY "allow_admin_delete" ON coupons
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- STEP 1.7: CREATE TRIGGER FOR AUTO-UPDATE TIMESTAMP
CREATE OR REPLACE FUNCTION update_coupons_updatedat()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedat = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_coupons_updatedat ON coupons;
CREATE TRIGGER trigger_update_coupons_updatedat
    BEFORE UPDATE ON coupons
    FOR EACH ROW
    EXECUTE FUNCTION update_coupons_updatedat();

-- STEP 1.8: INSERT TEST DATA
INSERT INTO coupons (code, discounttype, discountvalue, minordervalue, maxdiscount, usagelimit, isactive)
VALUES 
    ('WELCOME10', 'percentage', 10, 500, 100, 100, true),
    ('FLAT200', 'fixed', 200, 1000, NULL, 50, true),
    ('SAVE50', 'percentage', 50, 2000, 1000, 10, true);

-- STEP 3.2: CREATE RPC FUNCTION FOR INCREMENTING USAGE (Included here for efficiency)
CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE coupons 
    SET usedcount = usedcount + 1
    WHERE id = coupon_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Final Verification
SELECT * FROM coupons;
