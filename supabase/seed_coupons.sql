
-- Run this in the Supabase SQL Editor to seed test data

INSERT INTO coupons (code, discounttype, discountvalue, minordervalue, isactive, usedcount)
VALUES 
    ('WELCOME20', 'percentage', 20, 1000, true, 0),
    ('SAVE50', 'fixed', 50, 500, true, 5),
    ('SUMMER30', 'percentage', 30, 2000, false, 0)
ON CONFLICT (code) DO NOTHING;

-- Verification
SELECT * FROM coupons;
