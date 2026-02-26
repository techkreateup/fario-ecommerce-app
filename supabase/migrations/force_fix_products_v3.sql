-- =============================================
-- FARIO EMERGENCY FIX v3 - RESILIENT VERSION
-- =============================================
-- This script force-enables public access and handles publication errors
-- Run this in Supabase SQL Editor

-- 1. Ensure Table Permissions are granted to public
GRANT SELECT ON products TO anon, authenticated;
GRANT SELECT ON profiles TO anon, authenticated;
GRANT SELECT ON reviews TO anon, authenticated;
GRANT SELECT ON wishlist TO anon, authenticated;

-- 2. Reset and Open RLS on Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Products" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Allow public selection" ON products;

CREATE POLICY "Allow public selection" ON products 
FOR SELECT 
TO anon, authenticated
USING (true); 

-- 3. Reset and Open RLS on Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Profiles" ON profiles;
CREATE POLICY "Public Read Profiles" ON profiles 
FOR SELECT 
TO anon, authenticated
USING (true);

-- 4. Enable Realtime (Resilient wrapper)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
END $$;

-- Add tables to publication individually to avoid "already member" errors
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE products;
    EXCEPTION WHEN others THEN RAISE NOTICE 'Table products already in publication';
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
    EXCEPTION WHEN others THEN RAISE NOTICE 'Table profiles already in publication';
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE reviews;
    EXCEPTION WHEN others THEN RAISE NOTICE 'Table reviews already in publication';
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE wishlist;
    EXCEPTION WHEN others THEN RAISE NOTICE 'Table wishlist already in publication';
    END;
END $$;

ALTER TABLE products REPLICA IDENTITY FULL;

SELECT 'FORCE FIX v3 APPLIED - Please refresh the website now' as status;
