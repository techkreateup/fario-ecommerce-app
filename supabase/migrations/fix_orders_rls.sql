-- Check and fix RLS policies for orders table
-- Run this in Supabase SQL Editor

-- 1. Check if RLS is enabled on orders table
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'orders';

-- 2. Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'orders';

-- 3. CRITICAL FIX: Allow the RPC function to insert orders
-- Drop existing restrictive INSERT policy if it exists
DROP POLICY IF EXISTS "orders_insert_policy" ON orders;

-- Create permissive INSERT policy for authenticated users
CREATE POLICY "orders_insert_policy" 
ON orders 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = user_id  -- User can only insert their own orders
);

-- 4. Ensure SELECT policy exists for users to read their own orders
DROP POLICY IF EXISTS "orders_select_policy" ON orders;

CREATE POLICY "orders_select_policy" 
ON orders 
FOR SELECT 
TO authenticated
USING (
  auth.uid() = user_id  -- Users can only read their own orders
);

-- 5. Grant usage on orders table to authenticated role
GRANT ALL ON orders TO authenticated;

-- 6. Verify policies are active
SELECT * FROM pg_policies WHERE tablename = 'orders';
