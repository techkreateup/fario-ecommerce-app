-- ============================================
-- SCHEMA MIGRATION V2: STRICT SECURITY & UUIDs
-- ============================================

-- 1A: ADD user_id UUID TO ALL EMAIL-BASED TABLES
-- ORDERS
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Backfill existing orders
UPDATE orders o 
SET user_id = p.id 
FROM profiles p 
WHERE o.useremail = p.email 
AND o.user_id IS NULL;

-- REVIEWS
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Backfill existing reviews
UPDATE reviews r 
SET user_id = p.id 
FROM profiles p 
WHERE r.useremail = p.email 
AND r.user_id IS NULL;

-- SAVED_ITEMS (Create if not exists)
CREATE TABLE IF NOT EXISTS saved_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id),
    useremail TEXT,
    productid TEXT,
    productdata JSONB
);

-- Migrate data from wishlist if it exists (Legacy Support)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'wishlist') THEN
        -- Attempt to migrate data. Columns must match or be adapted.
        -- Assuming wishlist had useremail, productid, productdata
        INSERT INTO saved_items (useremail, productid, productdata)
        SELECT useremail, productid, productdata 
        FROM wishlist;
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipping wishlist data migration due to schema mismatch';
END $$;

-- Now apply the strict security updates
ALTER TABLE saved_items ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Backfill existing saved items
UPDATE saved_items s 
SET user_id = p.id 
FROM profiles p 
WHERE s.useremail = p.email 
AND s.user_id IS NULL;

-- RETURNS: Add user_id (currently has NO user reference)
ALTER TABLE returns ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Backfill returns via orders
UPDATE returns r 
SET user_id = o.user_id 
FROM orders o 
WHERE r.orderid = o.id 
AND r.user_id IS NULL;


-- ============================================
-- 1B: DROP THE GHOST TABLE
-- ============================================

DROP TABLE IF EXISTS wishlist;


-- ============================================
-- 1C: ADD UNIQUE CONSTRAINTS
-- ============================================

-- Prevent duplicate wishlist entries
-- Check if constraint exists first to avoid errors if re-running
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'saved_items_user_product_unique') THEN
        ALTER TABLE saved_items 
        ADD CONSTRAINT saved_items_user_product_unique 
        UNIQUE (user_id, productid);
    END IF;
END $$;

-- Prevent duplicate reviews (one review per user per product)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reviews_user_product_unique') THEN
        ALTER TABLE reviews 
        ADD CONSTRAINT reviews_user_product_unique 
        UNIQUE (user_id, productid);
    END IF;
END $$;


-- ============================================
-- 1D: DROP ALL OLD RLS POLICIES
-- ============================================

-- Orders
DROP POLICY IF EXISTS "Users see own orders" ON orders;
DROP POLICY IF EXISTS "Users Read Own Orders" ON orders;
DROP POLICY IF EXISTS "Users create own orders" ON orders;
DROP POLICY IF EXISTS "Admin view all orders" ON orders;
DROP POLICY IF EXISTS "Admin Manage Orders" ON orders;
DROP POLICY IF EXISTS "Admin update orders" ON orders;

-- Reviews
DROP POLICY IF EXISTS "Public Read Reviews" ON reviews;
DROP POLICY IF EXISTS "Users create reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated Create Reviews" ON reviews;
DROP POLICY IF EXISTS "Users manage own reviews" ON reviews;

-- Saved Items
DROP POLICY IF EXISTS "Users view own saved items" ON saved_items;
DROP POLICY IF EXISTS "Users insert own saved items" ON saved_items;
DROP POLICY IF EXISTS "Users delete own saved items" ON saved_items;

-- Returns
DROP POLICY IF EXISTS "Users view own returns" ON returns;
DROP POLICY IF EXISTS "Users create returns" ON returns;
DROP POLICY IF EXISTS "Admin manage returns" ON returns;


-- ============================================
-- 1E: CREATE NEW STRICT UUID-BASED RLS POLICIES
-- ============================================

-- Ensure is_admin() function exists
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---- ORDERS ----
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_select_own" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "orders_insert_own" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_admin_select" ON orders
  FOR SELECT USING (is_admin());

CREATE POLICY "orders_admin_update" ON orders
  FOR UPDATE USING (is_admin());

-- ---- REVIEWS ----
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select_public" ON reviews
  FOR SELECT USING (true);
  -- Anyone can READ reviews (this is fine)

CREATE POLICY "reviews_insert_own" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  -- Can ONLY insert with YOUR user_id

CREATE POLICY "reviews_update_own" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "reviews_delete_own" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "reviews_admin_delete" ON reviews
  FOR DELETE USING (is_admin());

-- ---- SAVED_ITEMS ----
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_items_select_own" ON saved_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "saved_items_insert_own" ON saved_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_items_delete_own" ON saved_items
  FOR DELETE USING (auth.uid() = user_id);

-- ---- RETURNS ----
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "returns_select_own" ON returns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "returns_insert_own" ON returns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "returns_admin_select" ON returns
  FOR SELECT USING (is_admin());

CREATE POLICY "returns_admin_update" ON returns
  FOR UPDATE USING (is_admin());

-- ---- PROFILES (verify existing) ----
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_select" ON profiles;

CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_admin_select" ON profiles
  FOR SELECT USING (is_admin());

-- ---- PRODUCTS (verify existing) ----
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_select_public" ON products;
DROP POLICY IF EXISTS "Public Read Products" ON products;
DROP POLICY IF EXISTS "products_admin_insert" ON products;
DROP POLICY IF EXISTS "products_admin_update" ON products;
DROP POLICY IF EXISTS "products_admin_delete" ON products;
DROP POLICY IF EXISTS "Admin CRUD Products" ON products;

CREATE POLICY "products_select_public" ON products
  FOR SELECT USING (isdeleted = false OR is_admin());

CREATE POLICY "products_admin_insert" ON products
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "products_admin_update" ON products
  FOR UPDATE USING (is_admin());

CREATE POLICY "products_admin_delete" ON products
  FOR DELETE USING (is_admin());

-- ---- LOGS ----
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "logs_admin_select" ON logs;
DROP POLICY IF EXISTS "logs_insert_authenticated" ON logs;

CREATE POLICY "logs_admin_select" ON logs
  FOR SELECT USING (is_admin());

CREATE POLICY "logs_insert_authenticated" ON logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ---- SETTINGS ----
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "settings_select_public" ON settings;
DROP POLICY IF EXISTS "settings_admin_update" ON settings;

CREATE POLICY "settings_select_public" ON settings
  FOR SELECT USING (true);

CREATE POLICY "settings_admin_update" ON settings
  FOR UPDATE USING (is_admin());

CREATE POLICY "settings_admin_insert" ON settings
  FOR INSERT WITH CHECK (is_admin());


-- ============================================
-- 1F: UPDATE STOCK REDUCTION RPC TO USE user_id
-- ============================================

CREATE OR REPLACE FUNCTION place_order_with_stock(
  p_user_id UUID,
  p_items JSONB,
  p_total NUMERIC,
  p_shipping_address TEXT,
  p_payment_method TEXT DEFAULT 'wallet'
)
RETURNS TEXT AS $$
DECLARE
  item RECORD;
  current_stock INTEGER;
  new_order_id TEXT;
BEGIN
  -- Generate order ID
  new_order_id := 'ORD-' || to_char(NOW(), 'YYYYMMDD') || '-' || 
                  substr(gen_random_uuid()::text, 1, 8);

  -- Validate and reduce stock atomically
  FOR item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(
    product_id TEXT, quantity INTEGER, price NUMERIC
  )
  LOOP
    SELECT stockquantity INTO current_stock 
    FROM products 
    WHERE id = item.product_id 
    FOR UPDATE;
    
    IF current_stock IS NULL THEN
      RAISE EXCEPTION 'Product % not found', item.product_id;
    END IF;
    
    IF current_stock < item.quantity THEN
      RAISE EXCEPTION 'Insufficient stock for %. Available: %, Requested: %', 
        item.product_id, current_stock, item.quantity;
    END IF;
    
    UPDATE products 
    SET stockquantity = stockquantity - item.quantity,
        instock = (stockquantity - item.quantity) > 0
    WHERE id = item.product_id;
  END LOOP;
  
  -- Deduct wallet if applicable
  IF p_payment_method = 'wallet' THEN
    UPDATE profiles 
    SET wallet_balance = wallet_balance - p_total 
    WHERE id = p_user_id 
    AND wallet_balance >= p_total;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Insufficient wallet balance';
    END IF;
  END IF;
  
  -- Create order with user_id (NOT email)
  INSERT INTO orders (
    id, user_id, useremail, items, total, 
    shippingaddress, paymentmethod, status, 
    timeline, createdat
  ) VALUES (
    new_order_id, 
    p_user_id,
    (SELECT email FROM profiles WHERE id = p_user_id),
    p_items, p_total, p_shipping_address,
    p_payment_method, 'Processing',
    jsonb_build_array(jsonb_build_object(
      'status', 'Order Placed',
      'timestamp', NOW(),
      'description', 'Your order has been placed successfully'
    )),
    NOW()
  );
  
  -- Log the transaction
  INSERT INTO logs (userid, level, message, metadata)
  VALUES (
    p_user_id, 'info', 'Order placed',
    jsonb_build_object(
      'order_id', new_order_id,
      'total', p_total,
      'items_count', jsonb_array_length(p_items)
    )
  );
  
  RETURN new_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

SELECT 'STRICT SECURITY MIGRATION COMPLETE' as status;
