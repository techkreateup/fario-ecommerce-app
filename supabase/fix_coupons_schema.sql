-- 1. Fix missing 'isactive' column safely
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS isactive BOOLEAN DEFAULT true;

-- 2. Fix other potentially missing columns safely
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS discounttype TEXT CHECK (discounttype IN ('percentage', 'fixed'));
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS discountvalue DECIMAL(10, 2);
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS minordervalue DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS maxdiscount DECIMAL(10, 2);
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS usagelimit INTEGER;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS usedcount INTEGER DEFAULT 0;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS validfrom TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS validuntil TIMESTAMPTZ;

-- 3. Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_isactive ON coupons(isactive);

-- 4. Enable RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- 5. Re-apply Policies (Drop first to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can view active coupons" ON coupons;
CREATE POLICY "Anyone can view active coupons" ON coupons
    FOR SELECT USING (isactive = true);

DROP POLICY IF EXISTS "Admins can manage coupons" ON coupons;
CREATE POLICY "Admins can manage coupons" ON coupons
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 6. Verify it works
SELECT * FROM coupons LIMIT 5;
