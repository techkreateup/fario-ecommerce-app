-- ==========================================
-- FARIO MASTER SITE AUTOMATION SCRIPT v2.0
-- Automation Functions & Triggers Only
-- ==========================================
-- This script adds automation to your existing Supabase tables
-- Run this AFTER your tables are already created

-- 1. REAL-TIME PUBLICATION SETUP
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    products, 
    orders, 
    reviews, 
    profiles, 
    wishlist, 
    logs;
COMMIT;

-- 2. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updatedat_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedat = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updatedat triggers to tables that have it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updatedat_products') THEN
        CREATE TRIGGER set_updatedat_products BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updatedat_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updatedat_profiles') THEN
        CREATE TRIGGER set_updatedat_profiles BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updatedat_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updatedat_orders') THEN
        CREATE TRIGGER set_updatedat_orders BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updatedat_column();
    END IF;
END $$;

-- 3. ATOMIC STOCK REDUCTION
CREATE OR REPLACE FUNCTION reduce_stock_atomic(p_product_id TEXT, p_quantity INT)
RETURNS BOOLEAN AS $$
DECLARE
    current_stock INT;
BEGIN
    SELECT stockquantity INTO current_stock FROM products WHERE id = p_product_id FOR UPDATE;
    
    IF current_stock >= p_quantity THEN
        UPDATE products 
        SET stockquantity = stockquantity - p_quantity,
            instock = (stockquantity - p_quantity) > 0
        WHERE id = p_product_id;
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. ADMIN DASHBOARD STATS
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS JSON AS $$
DECLARE
    total_rev NUMERIC;
    total_ords INT;
    total_custs INT;
BEGIN
    SELECT COALESCE(SUM(total), 0) INTO total_rev FROM orders WHERE status = 'Delivered';
    SELECT COUNT(*) INTO total_ords FROM orders;
    SELECT COUNT(*) INTO total_custs FROM profiles;

    RETURN json_build_object(
        'total_revenue', total_rev,
        'total_orders', total_ords,
        'total_customers', total_custs
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. ROW LEVEL SECURITY POLICIES
-- Products: Read for everyone, Edit for Admin
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Products" ON products;
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (isdeleted = false OR (auth.role() = 'authenticated' AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'));

DROP POLICY IF EXISTS "Admin CRUD Products" ON products;
CREATE POLICY "Admin CRUD Products" ON products FOR ALL 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Orders: Users read own, Admin reads all  
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users Read Own Orders" ON orders;
CREATE POLICY "Users Read Own Orders" ON orders FOR SELECT USING (useremail = (SELECT email FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admin Manage Orders" ON orders;
CREATE POLICY "Admin Manage Orders" ON orders FOR ALL 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Reviews: Public read, authenticated create
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Reviews" ON reviews;
CREATE POLICY "Public Read Reviews" ON reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated Create Reviews" ON reviews;
CREATE POLICY "Authenticated Create Reviews" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Wishlist: Users manage own items
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users Manage Own Wishlist" ON wishlist;
CREATE POLICY "Users Manage Own Wishlist" ON wishlist FOR ALL 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 6. WALLET CREDIT FUNCTION
CREATE OR REPLACE FUNCTION credit_user_wallet(p_user_id UUID, p_amount NUMERIC, p_reason TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE profiles 
    SET wallet_balance = wallet_balance + p_amount
    WHERE id = p_user_id;
    
    -- Log the transaction
    INSERT INTO logs (userid, level, message, metadata)
    VALUES (p_user_id, 'info', 'Wallet credited', jsonb_build_object('amount', p_amount, 'reason', p_reason));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. SEARCH INDEX
CREATE INDEX IF NOT EXISTS products_search_idx ON products USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- 8. ADMIN BOOTSTRAP
UPDATE profiles SET role = 'admin' WHERE email = 'reachkreateup@gmail.com';

-- 9. CONSTRAINTS
ALTER TABLE products DROP CONSTRAINT IF EXISTS stock_non_negative;
ALTER TABLE products ADD CONSTRAINT stock_non_negative CHECK (stockquantity >= 0);

ALTER TABLE products DROP CONSTRAINT IF EXISTS price_positive;
ALTER TABLE products ADD CONSTRAINT price_positive CHECK (price >= 0);

-- 10. BULK STOCK OPERATIONS
CREATE OR REPLACE FUNCTION bulk_update_stock(p_ids TEXT[], p_adjustment INT, p_mode TEXT)
RETURNS VOID AS $$
BEGIN
    IF p_mode = 'SET' THEN
        UPDATE products SET stockquantity = p_adjustment, instock = (p_adjustment > 0) WHERE id = ANY(p_ids);
    ELSIF p_mode = 'ADD' THEN
        UPDATE products SET stockquantity = stockquantity + p_adjustment, instock = (stockquantity + p_adjustment > 0) WHERE id = ANY(p_ids);
    ELSIF p_mode = 'SUBTRACT' THEN
        UPDATE products SET stockquantity = GREATEST(0, stockquantity - p_adjustment), instock = (GREATEST(0, stockquantity - p_adjustment) > 0) WHERE id = ANY(p_ids);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- End of Master Script
SELECT 'FARIO MASTER SITE AUTOMATION DEPLOYED SUCCESSFULLY' as status;
