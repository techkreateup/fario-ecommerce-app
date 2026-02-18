-- Drop old table if exists
DROP TABLE IF EXISTS coupons CASCADE;

-- Create fresh coupons table
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

-- Enable security
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to do everything
CREATE POLICY "Allow all for authenticated" ON coupons 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert test coupon
INSERT INTO coupons (code, discounttype, discountvalue, minordervalue, isactive, usedcount)
VALUES ('WELCOME10', 'percentage', 10, 500, true, 0);

-- Verify it worked
SELECT * FROM coupons;
