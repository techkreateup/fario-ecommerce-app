-- Step 1 & 7: Check table and try select
SELECT * FROM coupons LIMIT 5;

-- Step 7 Test 2: Insert Test Coupon
INSERT INTO coupons (code, discounttype, discountvalue, minordervalue, isactive)
VALUES ('DEBUG_SQL_TEST', 'percentage', 10, 500, true)
ON CONFLICT (code) DO NOTHING;

-- Step 7 Test 3: Check RLS Policies
SELECT * FROM pg_policies WHERE tablename = 'coupons';

-- Step 9: Check Admin Role
SELECT email, role FROM profiles WHERE email = 'kreateuptech@gmail.com';
SELECT email, role FROM profiles WHERE email = 'reachkreateup@gmail.com';
