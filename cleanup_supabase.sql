-- Cleanup Script for Fario Ecommerce
-- Removes unused/redundant tables as requested by user

-- 1. Drop saved_items (Wishlist move to LocalStorage)
DROP TABLE IF EXISTS public.saved_items;

-- 2. Drop any other redundant tables if they exist
-- (Checking for potential duplicates identified in setup)
-- DROP TABLE IF EXISTS public.wishlist; -- Example if it existed separately

-- 3. Notify
-- Table "saved_items" removed. Wishlist is now managed locally in the browser.
