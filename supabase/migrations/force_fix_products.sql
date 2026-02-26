-- =============================================
-- FARIO EMERGENCY FIX v2 - PUBLIC ACCESS RECOVERY
-- =============================================
-- This script force-enables public access to products and profiles
-- Run this in Supabase SQL Editor if products are still not loading

-- 1. Ensure Table Permissions are granted to public
GRANT SELECT ON products TO anon, authenticated;
GRANT SELECT ON profiles TO anon, authenticated;
GRANT SELECT ON reviews TO anon, authenticated;

-- 2. Reset and Open RLS on Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Products" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Allow public selection" ON products;

CREATE POLICY "Allow public selection" ON products 
FOR SELECT 
TO anon, authenticated
USING (true); -- First, let's make sure they show up at all

-- 3. Reset and Open RLS on Profiles (for name/avatar display)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Profiles" ON profiles;
CREATE POLICY "Public Read Profiles" ON profiles 
FOR SELECT 
TO anon, authenticated
USING (true);

-- 4. Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE wishlist;
ALTER TABLE products REPLICA IDENTITY FULL;

SELECT 'FORCE FIX APPLIED - Please refresh the website now' as status;
