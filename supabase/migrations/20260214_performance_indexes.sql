-- Migration: Performance Indexes
-- Date: 2026-02-14
-- Description: Adds indexes to foreign keys to speed up "Get My Stuff" queries (Profile, Cart, Wishlist)

-- 1. Orders (Critical for Profile History)
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(createdat DESC);

-- 2. Cart Items (Critical for Cart Load)
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);

-- 3. Saved Items (Wishlist)
CREATE INDEX IF NOT EXISTS idx_saved_items_user_id ON saved_items(user_id);

-- 4. Reviews
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- 5. Profiles (Auth lookups)
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
