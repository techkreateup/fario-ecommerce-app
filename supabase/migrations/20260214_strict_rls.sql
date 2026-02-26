-- Migration: Strict Row Level Security (RLS)
-- Date: 2026-02-14
-- Description: Enables RLS and defines policies for all tables.
-- IMPORTANT: Uses is_admin() SECURITY DEFINER function to avoid recursion.

-- ============================================================================
-- 1. HELPER FUNCTION (MUST BE FIRST - bypasses RLS for admin checks)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ============================================================================
-- 2. ENABLE RLS ON ALL TABLES
-- ============================================================================
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. GRANT PERMISSIONS
-- ============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT ON public.reviews TO anon, authenticated;

-- ============================================================================
-- 4. POLICIES
-- ============================================================================

-- A. PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR ALL USING (public.is_admin());

-- B. PRODUCTS
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products
FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admins can modify products" ON public.products;
CREATE POLICY "Admins can modify products" ON public.products
FOR ALL USING (public.is_admin());

-- C. CART ITEMS
DROP POLICY IF EXISTS "Users can manage own cart" ON public.cart_items;
CREATE POLICY "Users can manage own cart" ON public.cart_items
FOR ALL USING (auth.uid() = user_id);

-- D. SAVED ITEMS (Wishlist)
DROP POLICY IF EXISTS "Users can manage own wishlist" ON public.saved_items;
CREATE POLICY "Users can manage own wishlist" ON public.saved_items
FOR ALL USING (auth.uid() = user_id);

-- E. ORDERS
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
CREATE POLICY "Users can create orders" ON public.orders
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
CREATE POLICY "Admins can manage all orders" ON public.orders
FOR ALL USING (public.is_admin());

-- F. REVIEWS
DROP POLICY IF EXISTS "Public can read reviews" ON public.reviews;
CREATE POLICY "Public can read reviews" ON public.reviews
FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Users can manage own reviews" ON public.reviews;
CREATE POLICY "Users can manage own reviews" ON public.reviews
FOR ALL USING (auth.uid() = user_id);

-- G. RETURNS
DROP POLICY IF EXISTS "Users can view own returns" ON public.returns;
CREATE POLICY "Users can view own returns" ON public.returns
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create returns" ON public.returns;
CREATE POLICY "Users can create returns" ON public.returns
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all returns" ON public.returns;
CREATE POLICY "Admins can manage all returns" ON public.returns
FOR ALL USING (public.is_admin());

-- H. SETTINGS & LOGS
DROP POLICY IF EXISTS "Admins can manage settings" ON public.settings;
CREATE POLICY "Admins can manage settings" ON public.settings
FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view logs" ON public.logs;
CREATE POLICY "Admins can view logs" ON public.logs
FOR SELECT USING (public.is_admin());
