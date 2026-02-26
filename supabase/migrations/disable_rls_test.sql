-- ==========================================
-- EMERGENCY FIX - Disable RLS Temporarily
-- ==========================================
-- This will completely disable RLS on products table to test

-- Disable RLS temporarily
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

SELECT 'RLS DISABLED - Products should be public now' as status;
