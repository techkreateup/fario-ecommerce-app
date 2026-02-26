-- ============================================
-- SCHEMA FIXES V3: CONSTRAINTS & STABILITY
-- ============================================

BEGIN;

-- FIX 1: Add missing FK on saved_items.productid
ALTER TABLE saved_items 
DROP CONSTRAINT IF EXISTS saved_items_productid_fkey;

ALTER TABLE saved_items 
ADD CONSTRAINT saved_items_productid_fkey 
FOREIGN KEY (productid) REFERENCES public.products(id) 
ON DELETE CASCADE;

-- FIX 2: Add missing UNIQUE constraint on saved_items
-- Remove duplicates first
DELETE FROM saved_items a
USING saved_items b
WHERE a.id > b.id 
AND a.user_id = b.user_id 
AND a.productid = b.productid;

ALTER TABLE saved_items 
DROP CONSTRAINT IF EXISTS saved_items_user_product_unique;

ALTER TABLE saved_items 
ADD CONSTRAINT saved_items_user_product_unique 
UNIQUE (user_id, productid);

-- FIX 3: Add missing UNIQUE constraint on reviews
-- Remove duplicates first
DELETE FROM reviews a
USING reviews b
WHERE a.id > b.id 
AND a.user_id = b.user_id 
AND a.productid = b.productid;

ALTER TABLE reviews 
DROP CONSTRAINT IF EXISTS reviews_user_product_unique;

ALTER TABLE reviews 
ADD CONSTRAINT reviews_user_product_unique 
UNIQUE (user_id, productid);

-- FIX 4: Make user_id NOT NULL (Security hardening)
-- We use DO blocks to avoid errors if data is still messy, but we try to enforce it.
DO $$
BEGIN
    -- Orders
    IF NOT EXISTS (SELECT 1 FROM orders WHERE user_id IS NULL) THEN
        ALTER TABLE orders ALTER COLUMN user_id SET NOT NULL;
    END IF;
    
    -- Reviews
    IF NOT EXISTS (SELECT 1 FROM reviews WHERE user_id IS NULL) THEN
        ALTER TABLE reviews ALTER COLUMN user_id SET NOT NULL;
    END IF;
    
    -- Saved Items
    IF NOT EXISTS (SELECT 1 FROM saved_items WHERE user_id IS NULL) THEN
        ALTER TABLE saved_items ALTER COLUMN user_id SET NOT NULL;
    END IF;
    
    -- Returns
    IF NOT EXISTS (SELECT 1 FROM returns WHERE user_id IS NULL) THEN
        ALTER TABLE returns ALTER COLUMN user_id SET NOT NULL;
    END IF;
END $$;

-- FIX 5: Fix "Spinning Products Loop" (NULL isdeleted issue)
-- Ensure column exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='isdeleted') THEN
        ALTER TABLE products ADD COLUMN isdeleted BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Backfill NULLs to false (Critical for RLS visibility)
UPDATE products SET isdeleted = false WHERE isdeleted IS NULL;
ALTER TABLE products ALTER COLUMN isdeleted SET DEFAULT false;

COMMIT;

-- FIX 6: Verify constraints output
SELECT 
  tc.table_name, 
  tc.constraint_name, 
  tc.constraint_type
FROM information_schema.table_constraints tc
WHERE tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_type;
