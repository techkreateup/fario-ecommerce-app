-- ===========================================================================
-- FIX BROKEN IMAGES (Replace Google Drive with Unsplash)
-- Rule: Google Drive links often block hotlinking. Unsplash is reliable.
-- ===========================================================================

-- 1. AeroStride Pro (Running Shoe)
UPDATE products 
SET image = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop'
WHERE id = 'p_v2_001';

-- 2. Urban Glide (Casual Sneaker)
UPDATE products 
SET image = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop'
WHERE id = 'p_v2_002';

-- 3. Midnight Force (Basketball/High-top)
UPDATE products 
SET image = 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop'
WHERE id = 'p_v2_003';

-- 4. Velocity Elite (Racing Shoe)
UPDATE products 
SET image = 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000&auto=format&fit=crop'
WHERE id = 'p_v2_004';

-- 5. Stealth Commuter (Accessory/Backpack)
UPDATE products 
SET image = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop'
WHERE id = 'p_v2_005';

-- 6. Modular Tote (Bag)
UPDATE products 
SET image = 'https://images.unsplash.com/photo-1590874103328-327526dd079b?q=80&w=1000&auto=format&fit=crop'
WHERE id = 'p_v2_006';

-- 7. Tech Sling (Sling Bag/Accessory)
UPDATE products 
SET image = 'https://images.unsplash.com/photo-1622560480605-d83c85265c91?q=80&w=1000&auto=format&fit=crop'
WHERE id = 'p_v2_007';

-- Verify update
SELECT id, name, substr(image, 1, 30) || '...' as image_url FROM products;
