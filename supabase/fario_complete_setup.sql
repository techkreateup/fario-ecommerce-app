-- ===========================================================================
-- FARIO: COMPLETE SUPABASE SETUP (Single File)
-- ===========================================================================
-- Run this in a FRESH Supabase project's SQL Editor.
-- This creates ALL tables, RLS policies, functions, realtime, and seed data.
-- Date: 2026-02-14
-- ===========================================================================

-- ===========================================================================
-- PHASE 1: TABLES
-- ===========================================================================

-- 1A. PROFILES (User data, linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'user',
    wallet_balance NUMERIC DEFAULT 0,
    loyalty_points INTEGER DEFAULT 0,
    addresses JSONB DEFAULT '[]'::jsonb,
    createdat TIMESTAMPTZ DEFAULT NOW(),
    updatedat TIMESTAMPTZ DEFAULT NOW()
);

-- 1B. PRODUCTS (Catalog)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT,
    category TEXT,
    price NUMERIC NOT NULL,
    originalprice NUMERIC,
    image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    rating NUMERIC DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    instock BOOLEAN DEFAULT true,
    stockquantity INTEGER DEFAULT 0,
    sizes JSONB DEFAULT '[]'::jsonb,
    colors JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    specs JSONB DEFAULT '{}'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,
    gender TEXT DEFAULT 'Unisex',
    isdeleted BOOLEAN DEFAULT false
);

-- 1C. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    useremail TEXT,
    items JSONB NOT NULL,
    total NUMERIC NOT NULL,
    status TEXT DEFAULT 'Processing',
    shippingaddress TEXT,
    shippingmethod TEXT,
    paymentmethod TEXT DEFAULT 'wallet',
    timeline JSONB DEFAULT '[]'::jsonb,
    rating INTEGER,
    reviewtext TEXT,
    isarchived BOOLEAN DEFAULT false,
    returns_info JSONB,
    createdat TIMESTAMPTZ DEFAULT NOW(),
    updatedat TIMESTAMPTZ DEFAULT NOW()
);

-- 1D. REVIEWS (FK to orders and products)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    orderid TEXT NOT NULL REFERENCES public.orders(id),
    productid TEXT NOT NULL REFERENCES public.products(id),
    user_id UUID REFERENCES auth.users(id),
    useremail TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    helpful INTEGER DEFAULT 0,
    createdat TIMESTAMPTZ DEFAULT NOW(),
    updatedat TIMESTAMPTZ DEFAULT NOW()
);

-- 1E. RETURNS
CREATE TABLE IF NOT EXISTS public.returns (
    id TEXT PRIMARY KEY DEFAULT 'RET-' || LPAD(floor(random() * 999999)::text, 6, '0'),
    user_id UUID REFERENCES auth.users(id),
    orderid TEXT REFERENCES public.orders(id),
    items JSONB NOT NULL,
    reason TEXT,
    method TEXT,
    status TEXT DEFAULT 'Pending',
    refund_amount NUMERIC,
    tracking_number TEXT,
    admin_notes TEXT,
    auto_decision BOOLEAN DEFAULT false,
    decision_reason TEXT,
    decided_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1F. SAVED ITEMS (Wishlist)
CREATE TABLE IF NOT EXISTS public.saved_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    useremail TEXT,
    productid TEXT REFERENCES public.products(id),
    productdata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, productid)
);

-- 1G. CART ITEMS
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    product_id TEXT REFERENCES public.products(id) NOT NULL,
    quantity INTEGER DEFAULT 1,
    size TEXT,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id, size, color)
);

-- 1H. LOGS
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    userid UUID REFERENCES auth.users(id),
    level TEXT DEFAULT 'info',
    message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    createdat TIMESTAMPTZ DEFAULT NOW()
);

-- 1I. SETTINGS (Singleton Pattern)
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name TEXT NOT NULL DEFAULT 'Fario India',
    support_email TEXT NOT NULL DEFAULT 'support@fario.in',
    store_address TEXT NOT NULL DEFAULT '123 Commerce St, Mumbai, MH',
    time_zone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    logo_url TEXT DEFAULT '',
    stripe_enabled BOOLEAN DEFAULT true,
    stripe_key TEXT DEFAULT '',
    paypal_enabled BOOLEAN DEFAULT false,
    paypal_client_id TEXT DEFAULT '',
    test_mode BOOLEAN DEFAULT false,
    flat_rate_shipping NUMERIC DEFAULT 150,
    free_shipping_threshold NUMERIC DEFAULT 2000,
    tax_rate NUMERIC DEFAULT 18,
    tax_included BOOLEAN DEFAULT true,
    notify_order_email BOOLEAN DEFAULT true,
    notify_low_stock_email BOOLEAN DEFAULT true,
    notify_order_sms BOOLEAN DEFAULT false,
    master_key TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings row
INSERT INTO settings (store_name) 
SELECT 'Fario India' WHERE NOT EXISTS (SELECT 1 FROM settings);


-- ===========================================================================
-- PHASE 2: HELPER FUNCTIONS
-- ===========================================================================

-- is_admin() - SECURITY DEFINER bypasses RLS for admin checks
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

-- Auto-update settings timestamp
CREATE OR REPLACE FUNCTION update_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_settings_timestamp();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, createdat)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    CASE WHEN NEW.email = 'reachkreateup@gmail.com' THEN 'admin' ELSE 'user' END,
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Process return refund
CREATE OR REPLACE FUNCTION process_return_refund(return_id TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.returns
    SET status = 'Refunded', updated_at = now()
    WHERE id = return_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ===========================================================================
-- PHASE 3: ROW LEVEL SECURITY (RLS)
-- ===========================================================================

-- Enable RLS on ALL tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Grant schema access
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT ON public.reviews TO anon, authenticated;

-- A. PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR ALL USING (public.is_admin());

-- B. PRODUCTS (Public read, admin write)
CREATE POLICY "Public can view products" ON public.products
FOR SELECT TO public USING (true);

CREATE POLICY "Admins can modify products" ON public.products
FOR ALL USING (public.is_admin());

-- C. ORDERS
CREATE POLICY "Users can view own orders" ON public.orders
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON public.orders
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all orders" ON public.orders
FOR ALL USING (public.is_admin());

-- D. REVIEWS (Public read, user write)
CREATE POLICY "Public can read reviews" ON public.reviews
FOR SELECT TO public USING (true);

CREATE POLICY "Users can manage own reviews" ON public.reviews
FOR ALL USING (auth.uid() = user_id);

-- E. RETURNS
CREATE POLICY "Users can view own returns" ON public.returns
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create returns" ON public.returns
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all returns" ON public.returns
FOR ALL USING (public.is_admin());

-- F. CART ITEMS
CREATE POLICY "Users can manage own cart" ON public.cart_items
FOR ALL USING (auth.uid() = user_id);

-- G. SAVED ITEMS (Wishlist)
CREATE POLICY "Users can manage own wishlist" ON public.saved_items
FOR ALL USING (auth.uid() = user_id);

-- H. SETTINGS (Public read, admin write)
CREATE POLICY "Admins can manage settings" ON public.settings
FOR ALL USING (public.is_admin());

CREATE POLICY "Public can read settings" ON public.settings
FOR SELECT TO public USING (true);

-- I. LOGS (Admin read, authenticated write)
CREATE POLICY "Admins can view logs" ON public.logs
FOR SELECT USING (public.is_admin());

CREATE POLICY "Authenticated can insert logs" ON public.logs
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);


-- ===========================================================================
-- PHASE 4: SECURE RPCs (Server-Side Functions)
-- ===========================================================================

-- 4A. PLACE ORDER WITH STOCK VALIDATION
CREATE OR REPLACE FUNCTION place_order_with_stock(
  p_items JSONB,
  p_total NUMERIC,
  p_shipping_address TEXT,
  p_payment_method TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  new_order_id TEXT;
  v_item JSONB;
  v_product_id TEXT;
  v_quantity INT;
  v_stock INT;
  v_useremail TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT email INTO v_useremail FROM auth.users WHERE id = v_user_id;
  new_order_id := 'FR-' || floor(random() * 900000 + 100000)::TEXT;

  -- Validate stock
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := v_item->>'id';
    v_quantity := (v_item->>'quantity')::INT;
    SELECT stockquantity INTO v_stock FROM products WHERE id = v_product_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Product % not found', v_product_id; END IF;
    IF v_stock < v_quantity THEN RAISE EXCEPTION 'Insufficient stock for product %', v_product_id; END IF;
  END LOOP;

  -- Deduct stock
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := v_item->>'id';
    v_quantity := (v_item->>'quantity')::INT;
    UPDATE products SET stockquantity = stockquantity - v_quantity WHERE id = v_product_id;
  END LOOP;

  -- Create order
  INSERT INTO orders (id, user_id, useremail, items, total, status, shippingaddress, paymentmethod, createdat, timeline, isarchived)
  VALUES (new_order_id, v_user_id, COALESCE(v_useremail, 'unknown@email.com'), p_items, p_total, 'Processing', p_shipping_address, p_payment_method, NOW(),
    jsonb_build_array(jsonb_build_object('status', 'Processing', 'time', NOW(), 'message', 'Order placed successfully')), false);

  RETURN jsonb_build_object('success', true, 'order_id', new_order_id, 'message', 'Order placed successfully');
EXCEPTION
  WHEN OTHERS THEN RAISE;
END;
$$;

-- 4B. GET MY ORDERS
CREATE OR REPLACE FUNCTION get_my_orders()
RETURNS TABLE (
    id text, useremail text, items jsonb, total numeric, status text,
    shippingaddress text, shippingmethod text, paymentmethod text,
    timeline jsonb, rating integer, reviewtext text, isarchived boolean,
    createdat timestamptz, updatedat timestamptz, user_id uuid
)
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT o.id, o.useremail, o.items, o.total, o.status, o.shippingaddress, o.shippingmethod,
           o.paymentmethod, o.timeline, o.rating, o.reviewtext, o.isarchived, o.createdat, o.updatedat, o.user_id
    FROM orders o WHERE o.user_id = auth.uid() ORDER BY o.createdat DESC;
END;
$$;

-- 4C. ARCHIVE ORDER
CREATE OR REPLACE FUNCTION archive_order(p_order_id text)
RETURNS jsonb SECURITY DEFINER LANGUAGE plpgsql AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM orders WHERE id = p_order_id AND user_id = auth.uid()) THEN
        RETURN jsonb_build_object('success', false, 'message', 'Order not found or access denied');
    END IF;
    UPDATE orders SET isarchived = true, updatedat = NOW() WHERE id = p_order_id;
    RETURN jsonb_build_object('success', true, 'message', 'Order archived successfully');
END;
$$;

-- 4D. ADD ORDER REVIEW
CREATE OR REPLACE FUNCTION add_order_review(p_order_id text, p_rating integer, p_review_text text)
RETURNS jsonb SECURITY DEFINER LANGUAGE plpgsql AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM orders WHERE id = p_order_id AND user_id = auth.uid()) THEN
        RETURN jsonb_build_object('success', false, 'message', 'Order not found or access denied');
    END IF;
    IF p_rating < 1 OR p_rating > 5 THEN
        RETURN jsonb_build_object('success', false, 'message', 'Rating must be between 1 and 5');
    END IF;
    UPDATE orders SET rating = p_rating, reviewtext = p_review_text, updatedat = NOW() WHERE id = p_order_id;
    RETURN jsonb_build_object('success', true, 'message', 'Review added successfully');
END;
$$;

-- 4E. CREATE RETURN REQUEST
CREATE OR REPLACE FUNCTION create_return_request(p_order_id text, p_items jsonb, p_reason text)
RETURNS jsonb SECURITY DEFINER LANGUAGE plpgsql AS $$
DECLARE v_return_id text;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM orders WHERE id = p_order_id AND user_id = auth.uid()) THEN
        RETURN jsonb_build_object('success', false, 'message', 'Order not found or access denied');
    END IF;
    v_return_id := 'RET-' || LPAD(floor(random() * 999999)::text, 6, '0');
    UPDATE orders SET returns_info = jsonb_build_object('return_id', v_return_id, 'items', p_items, 'reason', p_reason, 'status', 'Pending', 'requested_at', NOW()), updatedat = NOW() WHERE id = p_order_id;
    RETURN jsonb_build_object('success', true, 'message', 'Return request created', 'return_id', v_return_id);
END;
$$;

-- 4F. UPDATE ORDER TIMELINE (Admin Only)
CREATE OR REPLACE FUNCTION update_order_timeline(p_order_id text, p_status text, p_message text)
RETURNS jsonb SECURITY DEFINER LANGUAGE plpgsql AS $$
DECLARE
    v_current_timeline jsonb;
    v_new_event jsonb;
    v_updated_timeline jsonb;
    v_caller_role text;
BEGIN
    SELECT role INTO v_caller_role FROM profiles WHERE id = auth.uid();
    IF v_caller_role IS NULL OR v_caller_role != 'admin' THEN
       RETURN jsonb_build_object('success', false, 'message', 'Access Denied: Admins Only');
    END IF;
    SELECT timeline INTO v_current_timeline FROM orders WHERE id = p_order_id;
    IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'message', 'Order not found'); END IF;
    v_new_event := jsonb_build_object('status', p_status, 'time', NOW(), 'message', p_message);
    IF v_current_timeline IS NULL THEN v_updated_timeline := jsonb_build_array(v_new_event);
    ELSE v_updated_timeline := v_current_timeline || v_new_event; END IF;
    UPDATE orders SET status = p_status, timeline = v_updated_timeline, updatedat = NOW() WHERE id = p_order_id;
    RETURN jsonb_build_object('success', true, 'message', 'Timeline updated', 'timeline', v_updated_timeline);
END;
$$;

-- Grant RPC access to authenticated users
GRANT EXECUTE ON FUNCTION place_order_with_stock(jsonb,numeric,text,text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_my_orders() TO authenticated;
GRANT EXECUTE ON FUNCTION archive_order(text) TO authenticated;
GRANT EXECUTE ON FUNCTION add_order_review(text, integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION create_return_request(text, jsonb, text) TO authenticated;
GRANT EXECUTE ON FUNCTION update_order_timeline(text, text, text) TO authenticated;


-- ===========================================================================
-- PHASE 5: PERFORMANCE INDEXES
-- ===========================================================================
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(createdat DESC);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_items_user_id ON saved_items(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_productid ON reviews(productid);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);


-- ===========================================================================
-- PHASE 6: CUSTOMER STATS VIEW (Admin Dashboard)
-- ===========================================================================
CREATE OR REPLACE VIEW customer_stats_view AS
SELECT
    p.id,
    p.name,
    p.email,
    p.phone,
    p.createdat AS joined,
    COALESCE(SUM(o.total), 0) AS total_spent,
    COUNT(o.id) AS order_count
FROM profiles p
LEFT JOIN orders o ON o.user_id = p.id
GROUP BY p.id, p.name, p.email, p.phone, p.createdat;


-- ===========================================================================
-- PHASE 7: SUPABASE REALTIME
-- ===========================================================================
DROP PUBLICATION IF EXISTS supabase_realtime;

CREATE PUBLICATION supabase_realtime FOR TABLE
  public.products,
  public.orders,
  public.cart_items,
  public.saved_items,
  public.reviews,
  public.returns,
  public.profiles,
  public.logs,
  public.settings;

ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.cart_items REPLICA IDENTITY FULL;
ALTER TABLE public.saved_items REPLICA IDENTITY FULL;
ALTER TABLE public.reviews REPLICA IDENTITY FULL;
ALTER TABLE public.returns REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.logs REPLICA IDENTITY FULL;
ALTER TABLE public.settings REPLICA IDENTITY FULL;


-- ===========================================================================
-- PHASE 8: SEED DATA (Products)
-- ===========================================================================

-- Seed 7 Products
INSERT INTO products (id, name, tagline, category, price, originalprice, image, description, features, colors, sizes, instock, rating, stockquantity, gender, isdeleted) VALUES
('p_v2_001', 'AeroStride Pro', 'Performance Redefined', 'Shoes', 12999, 15999,
 'https://drive.google.com/uc?export=view&id=1tEuedCwZYRWL-aYCOXY46bXCBcnyVuU-',
 'Engineered for elite runners, the AeroStride Pro combines lightweight materials with responsive cushioning.',
 to_jsonb(ARRAY['Carbon Fiber Plate', 'Breathable Mesh', 'High-Traction Sole']),
 to_jsonb(ARRAY['Black', 'Volt Green']), to_jsonb(ARRAY['UK 7', 'UK 8', 'UK 9', 'UK 10']), true, 4.8, 45, 'Men', false),

('p_v2_002', 'Urban Glide', 'City Comfort', 'Shoes', 8499, 10999,
 'https://drive.google.com/uc?export=view&id=1pc6UNVFR889igs7LbnQml_DpWpVd5AP2',
 'The perfect companion for urban exploration, featuring all-day comfort and sleek design.',
 to_jsonb(ARRAY['Memory Foam Insole', 'Slip-Resistant', 'Easy-Clean Upper']),
 to_jsonb(ARRAY['Grey', 'Navy']), to_jsonb(ARRAY['UK 6', 'UK 7', 'UK 8', 'UK 9']), true, 4.6, 60, 'Unisex', false),

('p_v2_003', 'Midnight Force', 'Stealth & Power', 'Shoes', 14499, 18999,
 'https://drive.google.com/uc?export=view&id=1JAkZKl652biLyzUdO5X05Y4s7a1AsqPU',
 'Dominate the court or the street with the Midnight Force. Unmatched stability and style.',
 to_jsonb(ARRAY['Ankle Support', 'Durable Rubber Outsole', 'Reflective Details']),
 to_jsonb(ARRAY['Black/Red', 'Triple Black']), to_jsonb(ARRAY['UK 8', 'UK 9', 'UK 10', 'UK 11']), true, 4.9, 30, 'Men', false),

('p_v2_004', 'Velocity Elite', 'Speed Unleashed', 'Shoes', 11999, 14999,
 'https://drive.google.com/uc?export=view&id=19UKGRbcIZHffq1xs56MekmVpgF90H2kr',
 'Built for speed training and race day. Minimalist design for maximum output.',
 to_jsonb(ARRAY['Ultra-Lightweight', 'Responsive Foam', 'Seamless Knit']),
 to_jsonb(ARRAY['White/Blue', 'Orange']), to_jsonb(ARRAY['UK 7', 'UK 8', 'UK 9']), true, 4.7, 25, 'Unisex', false),

('p_v2_005', 'Stealth Commuter', 'Organized Efficiency', 'Bags', 5999, 7999,
 'https://drive.google.com/uc?export=view&id=1fm0yzmL6IQktGcvEZ34X3hF3YaVqcYoC',
 'A sleek backpack designed for the modern professional. Water-resistant and packed with smart storage.',
 to_jsonb(ARRAY['Water Resistant', 'Laptop Compartment', 'Hidden Pockets']),
 to_jsonb(ARRAY['Black', 'Charcoal']), to_jsonb(ARRAY['One Size']), true, 4.8, 100, 'Unisex', false),

('p_v2_006', 'Modular Tote', 'Versatile Utility', 'Bags', 4499, 5999,
 'https://drive.google.com/uc?export=view&id=1P2Rdo8iTmbVCLJ7bKG8SRiYdjoiEl5TZ',
 'From gym to office, this tote adapts to your needs. Durable and stylish.',
 to_jsonb(ARRAY['Expandable Volume', 'Detachable Strap', 'Reinforced Base']),
 to_jsonb(ARRAY['Olive', 'Black']), to_jsonb(ARRAY['One Size']), true, 4.5, 80, 'Women', false),

('p_v2_007', 'Tech Sling', 'Essential Carry', 'Accessories', 2999, 3999,
 'https://drive.google.com/uc?export=view&id=1BB5uMVdb66bRJLUgle-vUkLaKyK1gC-i',
 'Keep your essentials close and secure. Perfect for travel or daily errands.',
 to_jsonb(ARRAY['RFID Blocking', 'Quick-Access pocket', 'Adjustable Strap']),
 to_jsonb(ARRAY['Black', 'Camo']), to_jsonb(ARRAY['One Size']), true, 4.6, 150, 'Unisex', false)

ON CONFLICT (id) DO NOTHING;


-- ===========================================================================
-- PHASE 9: SEED DATA (Orders, Reviews, Saved Items, Logs)
-- These depend on a user existing in auth.users (login first, then run Phase 9)
-- ===========================================================================

-- NOTE: Run this AFTER you have at least one user signed up.
-- If you run it before any user exists, it will safely skip with notices.

DO $$
DECLARE
    user_rec RECORD;
    prod1 RECORD;
    prod2 RECORD;
    prod3 RECORD;
    order_id1 TEXT;
    order_id2 TEXT;
    order_id3 TEXT;
BEGIN
    SELECT id, email INTO user_rec FROM auth.users LIMIT 1;
    IF user_rec IS NULL THEN
        RAISE NOTICE 'No users found. Skipping user-dependent seed data. Sign up first, then re-run Phase 9.';
        RETURN;
    END IF;

    SELECT id, name, price, image INTO prod1 FROM products ORDER BY id LIMIT 1;
    SELECT id, name, price, image INTO prod2 FROM products ORDER BY id LIMIT 1 OFFSET 1;
    SELECT id, name, price, image INTO prod3 FROM products ORDER BY id LIMIT 1 OFFSET 2;

    -- Generate order IDs
    order_id1 := 'ORD-20260210-' || substr(gen_random_uuid()::text, 1, 8);
    order_id2 := 'ORD-20260213-' || substr(gen_random_uuid()::text, 1, 8);
    order_id3 := 'ORD-20260212-' || substr(gen_random_uuid()::text, 1, 8);

    -- === SEED ORDERS ===
    INSERT INTO orders (id, user_id, useremail, items, total, shippingaddress, paymentmethod, status, timeline, createdat, isarchived)
    VALUES (
        order_id1, user_rec.id, user_rec.email,
        jsonb_build_array(jsonb_build_object('id', prod1.id, 'name', prod1.name, 'price', prod1.price, 'quantity', 1, 'size', 'UK 8', 'color', 'Black', 'image', prod1.image)),
        prod1.price, 'No. 12, Avinashi Road, Coimbatore, TN 641018', 'Cash on Delivery', 'Delivered',
        jsonb_build_array(
            jsonb_build_object('status', 'Order Placed', 'timestamp', (NOW() - interval '4 days')::text),
            jsonb_build_object('status', 'Delivered', 'timestamp', (NOW() - interval '1 day')::text)
        ), NOW() - interval '4 days', false
    );

    IF prod2 IS NOT NULL THEN
        INSERT INTO orders (id, user_id, useremail, items, total, shippingaddress, paymentmethod, status, timeline, createdat, isarchived)
        VALUES (
            order_id2, user_rec.id, user_rec.email,
            jsonb_build_array(jsonb_build_object('id', prod2.id, 'name', prod2.name, 'price', prod2.price, 'quantity', 2, 'size', 'UK 7', 'color', 'Black', 'image', prod2.image)),
            prod2.price * 2, 'No. 12, Avinashi Road, Coimbatore, TN 641018', 'Wallet', 'Processing',
            jsonb_build_array(jsonb_build_object('status', 'Order Placed', 'timestamp', (NOW() - interval '1 day')::text)),
            NOW() - interval '1 day', false
        );
    END IF;

    IF prod3 IS NOT NULL THEN
        INSERT INTO orders (id, user_id, useremail, items, total, shippingaddress, paymentmethod, status, timeline, createdat, isarchived)
        VALUES (
            order_id3, user_rec.id, user_rec.email,
            jsonb_build_array(jsonb_build_object('id', prod3.id, 'name', prod3.name, 'price', prod3.price, 'quantity', 1, 'size', 'UK 9', 'color', 'Default', 'image', prod3.image)),
            prod3.price, 'No. 5, MG Road, Erode, TN 638001', 'Cash on Delivery', 'Shipped',
            jsonb_build_array(
                jsonb_build_object('status', 'Order Placed', 'timestamp', (NOW() - interval '2 days')::text),
                jsonb_build_object('status', 'Shipped', 'timestamp', NOW()::text)
            ), NOW() - interval '2 days', false
        );
    END IF;

    -- === SEED REVIEWS (references orders via FK) ===
    INSERT INTO reviews (orderid, productid, user_id, useremail, rating, comment, images, helpful, createdat, updatedat) VALUES
    (order_id1, prod1.id, user_rec.id, user_rec.email, 5, 'Excellent quality! Premium material and top-notch stitching.', '[]'::jsonb, 12, NOW() - interval '3 days', NOW()),
    (order_id1, prod2.id, user_rec.id, user_rec.email, 4, 'Great value for money. Comfortable fit and stylish.', '[]'::jsonb, 8, NOW() - interval '2 days', NOW()),
    (order_id1, prod3.id, user_rec.id, user_rec.email, 5, 'Absolutely love it! Premium feel and amazing comfort.', '[]'::jsonb, 15, NOW() - interval '1 day', NOW())
    ON CONFLICT DO NOTHING;

    -- Update product review counts
    UPDATE products p SET reviews = (SELECT COUNT(*) FROM reviews r WHERE r.productid = p.id);

    -- === SEED SAVED ITEMS (Wishlist) ===
    INSERT INTO saved_items (user_id, useremail, productid, productdata)
    SELECT user_rec.id, user_rec.email, p.id, 
           jsonb_build_object('id', p.id, 'name', p.name, 'price', p.price, 'image', p.image, 'category', p.category, 'rating', p.rating)
    FROM products p LIMIT 2 OFFSET 3
    ON CONFLICT (user_id, productid) DO NOTHING;

    -- === SEED LOGS ===
    INSERT INTO logs (userid, level, message, metadata, createdat) VALUES
    (user_rec.id, 'info', 'User logged in',   '{"source":"google_oauth"}'::jsonb, NOW() - interval '3 days'),
    (user_rec.id, 'info', 'Order placed',      '{"total":12999,"items_count":1}'::jsonb, NOW() - interval '2 days'),
    (user_rec.id, 'info', 'Product viewed',    '{"page":"/products"}'::jsonb, NOW() - interval '1 day'),
    (user_rec.id, 'info', 'Cart updated',      '{"action":"add_item"}'::jsonb, NOW() - interval '12 hours'),
    (user_rec.id, 'info', 'Profile updated',   '{"fields":["name","phone"]}'::jsonb, NOW());

    RAISE NOTICE '✅ Seed data created: 3 orders, 3 reviews, 2 saved items, 5 logs';
END $$;


-- ===========================================================================
-- PHASE 10: VERIFY EVERYTHING
-- ===========================================================================
SELECT 'products' as table_name, COUNT(*) as row_count FROM products
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'cart_items', COUNT(*) FROM cart_items
UNION ALL SELECT 'saved_items', COUNT(*) FROM saved_items
UNION ALL SELECT 'reviews', COUNT(*) FROM reviews
UNION ALL SELECT 'returns', COUNT(*) FROM returns
UNION ALL SELECT 'profiles', COUNT(*) FROM profiles
UNION ALL SELECT 'logs', COUNT(*) FROM logs
UNION ALL SELECT 'settings', COUNT(*) FROM settings
ORDER BY table_name;

-- ===========================================================================
-- DONE! Your Fario database is fully set up.
-- ===========================================================================
