-- EMERGENCY FIX: Inspect and Fix Admin Permissions

-- 1. Check if user exists in profiles and has admin role
SELECT * FROM profiles WHERE email = 'kreateuptech@gmail.com';

-- 2. FORCE Admin Role (Just in case)
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'kreateuptech@gmail.com';

-- 3. NUCLEAR OPTION: Disable RLS temporarily to prove it's a permission issue
-- Run this if the Fetch still times out or fails
ALTER TABLE coupons DISABLE ROW LEVEL SECURITY;
