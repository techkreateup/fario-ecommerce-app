-- Check if coupons table exists
SELECT * FROM coupons LIMIT 5;

-- If table doesn't exist, create it:

CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    discounttype TEXT CHECK (discounttype IN ('percentage', 'fixed')),
    discountvalue DECIMAL(10, 2) NOT NULL,
    minordervalue DECIMAL(10, 2) DEFAULT 0,
    maxdiscount DECIMAL(10, 2),
    usagelimit INTEGER,
    usedcount INTEGER DEFAULT 0,
    validfrom TIMESTAMPTZ DEFAULT NOW(),
    validuntil TIMESTAMPTZ,
    isactive BOOLEAN DEFAULT true,
    createdat TIMESTAMPTZ DEFAULT NOW(),
    updatedat TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_isactive ON coupons(isactive);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view active coupons
DROP POLICY IF EXISTS "Anyone can view active coupons" ON coupons;
CREATE POLICY "Anyone can view active coupons" ON coupons
    FOR SELECT USING (isactive = true);

-- Only admins can manage coupons
DROP POLICY IF EXISTS "Admins can manage coupons" ON coupons;
CREATE POLICY "Admins can manage coupons" ON coupons
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
