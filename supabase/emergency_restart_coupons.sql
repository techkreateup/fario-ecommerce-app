-- Drop table if exists (start fresh)
DROP TABLE IF EXISTS coupons CASCADE;

-- Create with EXACT lowercase column names
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    discounttype TEXT,
    discountvalue NUMERIC,
    minordervalue NUMERIC DEFAULT 0,
    maxdiscount NUMERIC,
    usagelimit INTEGER,
    usedcount INTEGER DEFAULT 0,
    isactive BOOLEAN DEFAULT true,
    createdat TIMESTAMPTZ DEFAULT NOW(),
    updatedat TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Simple policy - allow ALL for authenticated users (we'll restrict later)
DROP POLICY IF EXISTS "Allow all authenticated" ON coupons;
CREATE POLICY "Allow all authenticated" ON coupons 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert sample coupon for testing
INSERT INTO coupons (code, discounttype, discountvalue, minordervalue, isactive, usedcount)
VALUES ('WELCOME10', 'percentage', 10, 500, true, 0);

-- Verify
SELECT * FROM coupons;
