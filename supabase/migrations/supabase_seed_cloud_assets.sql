-- =====================================================
-- FARIO CLOUD ASSET MIGRATION - FINAL SEED
-- =====================================================
-- This script replaces ALL local image paths with Google Drive links
-- Run this in Supabase SQL Editor to update existing products
-- =====================================================

-- STEP 1: Clear old products with local image paths
DELETE FROM products WHERE image LIKE '/%' OR image LIKE '/shoe-%';

-- STEP 2: Insert new products with Google Drive cloud links
INSERT INTO products (
  id, name, tagline, category, price, originalprice, 
  image, description, features, colors, sizes, 
  instock, rating, stockquantity, gender, 
  isdeleted, createdat, updatedat
) VALUES

-- Product 1: AeroStride Pro
(
  'p_v2_001',
  'AeroStride Pro',
  'Performance Redefined',
  'Shoes',
  12999,
  15999,
  'https://drive.google.com/uc?export=view&id=1tEuedCwZYRWL-aYCOXY46bXCBcnyVuU-',
  'Engineered for elite runners, the AeroStride Pro combines lightweight materials with responsive cushioning.',
  '["Carbon Fiber Plate", "Breathable Mesh", "High-Traction Sole"]'::jsonb,
  '["Black", "Volt Green"]'::jsonb,
  '["UK 7", "UK 8", "UK 9", "UK 10"]'::jsonb,
  true,
  4.8,
  45,
  'Men',
  false,
  NOW(),
  NOW()
),

-- Product 2: Urban Glide
(
  'p_v2_002',
  'Urban Glide',
  'City Comfort',
  'Shoes',
  8499,
  10999,
  'https://drive.google.com/uc?export=view&id=1pc6UNVFR889igs7LbnQml_DpWpVd5AP2',
  'The perfect companion for urban exploration, featuring all-day comfort and sleek design.',
  '["Memory Foam Insole", "Slip-Resistant", "Easy-Clean Upper"]'::jsonb,
  '["Grey", "Navy"]'::jsonb,
  '["UK 6", "UK 7", "UK 8", "UK 9"]'::jsonb,
  true,
  4.6,
  60,
  'Unisex',
  false,
  NOW(),
  NOW()
),

-- Product 3: Midnight Force
(
  'p_v2_003',
  'Midnight Force',
  'Stealth & Power',
  'Shoes',
  14499,
  18999,
  'https://drive.google.com/uc?export=view&id=1JAkZKl652biLyzUdO5X05Y4s7a1AsqPU',
  'Dominate the court or the street with the Midnight Force. Unmatched stability and style.',
  '["Ankle Support", "Durable Rubber Outsole", "Reflective Details"]'::jsonb,
  '["Black/Red", "Triple Black"]'::jsonb,
  '["UK 8", "UK 9", "UK 10", "UK 11"]'::jsonb,
  true,
  4.9,
  30,
  'Men',
  false,
  NOW(),
  NOW()
),

-- Product 4: Velocity Elite
(
  'p_v2_004',
  'Velocity Elite',
  'Speed Unleashed',
  'Shoes',
  11999,
  14999,
  'https://drive.google.com/uc?export=view&id=19UKGRbcIZHffq1xs56MekmVpgF90H2kr',
  'Built for speed training and race day. Minimalist design for maximum output.',
  '["Ultra-Lightweight", "Responsive Foam", "Seamless Knit"]'::jsonb,
  '["White/Blue", "Orange"]'::jsonb,
  '["UK 7", "UK 8", "UK 9"]'::jsonb,
  true,
  4.7,
  25,
  'Unisex',
  false,
  NOW(),
  NOW()
),

-- Product 5: Stealth Commuter (Bag)
(
  'p_v2_005',
  'Stealth Commuter',
  'Organized Efficiency',
  'Bags',
  5999,
  7999,
  'https://drive.google.com/uc?export=view&id=1fm0yzmL6IQktGcvEZ34X3hF3YaVqcYoC',
  'A sleek backpack designed for the modern professional. Water-resistant and packed with smart storage.',
  '["Water Resistant", "Laptop Compartment", "Hidden Pockets"]'::jsonb,
  '["Black", "Charcoal"]'::jsonb,
  '["One Size"]'::jsonb,
  true,
  4.8,
  100,
  'Unisex',
  false,
  NOW(),
  NOW()
),

-- Product 6: Modular Tote (Bag)
(
  'p_v2_006',
  'Modular Tote',
  'Versatile Utility',
  'Bags',
  4499,
  5999,
  'https://drive.google.com/uc?export=view&id=1P2Rdo8iTmbVCLJ7bKG8SRiYdjoiEl5TZ',
  'From gym to office, this tote adapts to your needs. Durable and stylish.',
  '["Expandable Volume", "Detachable Strap", "Reinforced Base"]'::jsonb,
  '["Olive", "Black"]'::jsonb,
  '["One Size"]'::jsonb,
  true,
  4.5,
  80,
  'Women',
  false,
  NOW(),
  NOW()
),

-- Product 7: Tech Sling (Accessories)
(
  'p_v2_007',
  'Tech Sling',
  'Essential Carry',
  'Accessories',
  2999,
  3999,
  'https://drive.google.com/uc?export=view&id=1BB5uMVdb66bRJLUgle-vUkLaKyK1gC-i',
  'Keep your essentials close and secure. Perfect for travel or daily errands.',
  '["RFID Blocking", "Quick-Access pocket", "Adjustable Strap"]'::jsonb,
  '["Black", "Camo"]'::jsonb,
  '["One Size"]'::jsonb,
  true,
  4.6,
  150,
  'Unisex',
  false,
  NOW(),
  NOW()
)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  price = EXCLUDED.price,
  originalprice = EXCLUDED.originalprice,
  image = EXCLUDED.image,
  stockquantity = EXCLUDED.stockquantity,
  instock = EXCLUDED.instock,
  updatedat = NOW();

-- VERIFICATION: Check all products now use Google Drive
SELECT id, name, 
       CASE 
         WHEN image LIKE 'https://drive.google.com%' THEN '✅ Cloud'
         ELSE '❌ Local'
       END as image_source,
       stockquantity, instock 
FROM products 
ORDER BY id;

-- EXPECTED OUTPUT: All 7 products should show "✅ Cloud"
