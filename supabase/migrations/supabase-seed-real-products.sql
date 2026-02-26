-- =====================================================
-- FARIO REAL PRODUCTS - SUPABASE INSERT SCRIPT
-- =====================================================
-- This script inserts all 6 real products from the Fario website
-- Run this in Supabase SQL Editor after creating tables
-- =====================================================

-- Insert REAL Products from constants.ts
INSERT INTO products (
  id, name, tagline, category, price, originalPrice, 
  image, description, features, colors, sizes, 
  inStock, rating, stockQuantity, gender, 
  isDeleted, createdAt, updatedAt
) VALUES

-- Product 1: Scholar Max Classic (Male)
(
  'p5',
  'Scholar Max Classic (Male) | Timeless. Tough. Tailored.',
  'A sophisticated lace-up icon redefined for the next generation.',
  'School Shoes',
  799,
  999,
  '/shoe-lifestyle.jpg',
  'A sophisticated lace-up icon redefined for the next generation. The Scholar Max pairs a scuff-resistant synthetic finish with a feather-light build, ensuring you stay sharp and agile from the first bell to the final class.',
  '["Reinforced Lacing", "Scuff Resistant", "Lightweight"]'::jsonb,
  '["Black"]'::jsonb,
  '["UK 4", "UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10"]'::jsonb,
  true,
  4.7,
  42,
  'Male',
  false,
  NOW(),
  NOW()
),

-- Product 2: Edustep Core Black (Unisex)
(
  'p1',
  'Edustep Core Black | Resilient. Refined. Essential.',
  'The definitive foundation for the modern student.',
  'Shoes',
  999,
  1299,
  '/shoe-edustep.jpg',
  'The definitive foundation for the modern student. Engineered with industrial-grade durability and our signature silicone identity tags, the Edustep Core provides elite arch support designed to outlast the most rigorous school year.',
  '["Anti-Skid Sole", "Breathable Mesh", "Memory Foam Insole"]'::jsonb,
  '["Black", "Grey"]'::jsonb,
  '["UK 4", "UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10"]'::jsonb,
  true,
  4.8,
  124,
  'Unisex',
  false,
  NOW(),
  NOW()
),

-- Product 3: Jumpr 200 Kinetic (Female)
(
  'p2',
  'Jumpr 200 Kinetic | Agile. Explosive. Elite.',
  'High-performance footwear for the active achiever.',
  'Shoes',
  1199,
  1499,
  '/shoe-lifestyle.jpg',
  'High-performance footwear for the active achiever. Featuring a reinforced leather upper and a high-traction outsole, the Jumpr 200 is built to handle every playground pivot and sudden sprint with zero compromise on comfort.',
  '["Leather Upper", "Reinforced Toe", "Arch Support"]'::jsonb,
  '["White", "Lime", "Purple"]'::jsonb,
  '["UK 4", "UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10"]'::jsonb,
  true,
  4.9,
  8,
  'Female',
  false,
  NOW(),
  NOW()
),

-- Product 4: Velcro Sprint Junior (Kids)
(
  'p6',
  'Velcro Sprint Junior | Independent. Swift. Secure.',
  'Engineered for the young explorers.',
  'Kids',
  699,
  849,
  '/shoe-velcro-1.jpg',
  'Engineered for the young explorers. The Velcro Sprint Junior features a dual-lock strap system for total independence, providing small feet with the structural security and cushioned collar they need for all-day discovery.',
  '["Double Velcro Strap", "Easy Wear", "Cushioned Collar"]'::jsonb,
  '["Black"]'::jsonb,
  '["UK 10K", "UK 11K", "UK 12K", "UK 13K", "UK 1", "UK 2"]'::jsonb,
  true,
  4.8,
  15,
  'Unisex',
  false,
  NOW(),
  NOW()
),

-- Product 5: Scholar Pack Pro (Bag)
(
  'p3',
  'Scholar Pack Pro | Structural. Expansive. Ergonomic.',
  'Your mobile academic headquarters.',
  'Bags',
  699,
  899,
  '/shoe-lifestyle.jpg',
  'Your mobile academic headquarters. Featuring spinal-support architecture and a water-resistant exterior shield, the Scholar Pack Pro organizes heavy textbook loads with effortless ease and maximum security.',
  '["Water Resistant", "Laptop Sleeve", "Spinal Support"]'::jsonb,
  '["Black", "Blue"]'::jsonb,
  '["OS"]'::jsonb,
  true,
  4.7,
  67,
  'Unisex',
  false,
  NOW(),
  NOW()
),

-- Product 6: Cloud-Blend Socks (OUT OF STOCK)
(
  'p4',
  'Cloud-Blend Socks (3-Pack) | Seamless. Fresh. Enduring.',
  'The hidden hero of the school uniform.',
  'Socks',
  199,
  299,
  '/shoe-lifestyle.jpg',
  'The hidden hero of the school uniform. Our anti-microbial cotton blend creates a high-performance moisture-wicking barrier that keeps feet exceptionally fresh through every class and extracurricular activity.',
  '["Cotton Blend", "Reinforced Heel", "Odor Control"]'::jsonb,
  '["White", "Black"]'::jsonb,
  '["Small", "Medium", "Large"]'::jsonb,
  false,
  4.5,
  0,
  'Unisex',
  false,
  NOW(),
  NOW()
)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  price = EXCLUDED.price,
  originalPrice = EXCLUDED.originalPrice,
  stockQuantity = EXCLUDED.stockQuantity,
  inStock = EXCLUDED.inStock,
  updatedAt = NOW();

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
-- Run this to verify products were inserted correctly
SELECT id, name, price, stockQuantity, inStock, category FROM products ORDER BY id;
