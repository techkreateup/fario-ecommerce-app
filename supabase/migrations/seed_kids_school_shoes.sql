-- =====================================================================
-- FARIO KIDS & SCHOOL SHOES PRODUCTS
-- Run this in Supabase SQL Editor to add Kids and School Shoes
-- Uses HL3 Google Drive CDN images (proven reliable)
-- Schema: fario_complete_setup.sql (all lowercase columns)
-- =====================================================================

INSERT INTO products (
  id, name, tagline, category, price, originalprice,
  image, description, features, colors, sizes,
  instock, rating, stockquantity, gender, isdeleted
) VALUES

-- ===========================
-- KIDS PRODUCTS (category = 'Kids')
-- ===========================

-- K1: Velcro Sprint Junior
(
  'k1',
  'Velcro Sprint Junior',
  'Independent. Swift. Secure.',
  'Kids',
  699,
  849,
  'https://lh3.googleusercontent.com/d/1fm0yzmL6IQktGcvEZ34X3hF3YaVqcYoC',
  'Engineered for the young explorers. The Velcro Sprint Junior features a dual-lock strap system for total independence, providing small feet with the structural security and cushioned collar they need for all-day discovery.',
  to_jsonb(ARRAY['Double Velcro Strap', 'Easy Wear', 'Cushioned Collar']),
  to_jsonb(ARRAY['Black', 'Blue', 'Red']),
  to_jsonb(ARRAY['UK 10K', 'UK 11K', 'UK 12K', 'UK 13K', 'UK 1', 'UK 2']),
  true, 4.8, 50, 'Unisex', false
),

-- K2: Jumpr 200 Active
(
  'k2',
  'Jumpr 200 Active',
  'Agile. Energetic. Fun.',
  'Kids',
  799,
  999,
  'https://lh3.googleusercontent.com/d/1tEuedCwZYRWL-aYCOXY46bXCBcnyVuU-',
  'High-energy footwear for the always-on-the-move child. The Jumpr 200 Active features a reinforced flex sole for playground antics and a breathable mesh upper that keeps little feet cool.',
  to_jsonb(ARRAY['Flex Sole', 'Breathable Mesh', 'Padded Ankle']),
  to_jsonb(ARRAY['Black/Lime', 'White/Purple', 'Navy/Orange']),
  to_jsonb(ARRAY['UK 10K', 'UK 11K', 'UK 12K', 'UK 13K', 'UK 1', 'UK 2']),
  true, 4.7, 45, 'Unisex', false
),

-- K3: Mini Strider
(
  'k3',
  'Mini Strider',
  'First Steps. Big Adventures.',
  'Kids',
  599,
  749,
  'https://lh3.googleusercontent.com/d/1pc6UNVFR889igs7LbnQml_DpWpVd5AP2',
  'Designed for the littlest explorers, Mini Strider features a soft-toe bumper for protection and a slip-resistant sole for safe adventures on every surface.',
  to_jsonb(ARRAY['Soft-Toe Bumper', 'Slip-Resistant Sole', 'Quick Dry Lining']),
  to_jsonb(ARRAY['White', 'Pink', 'Sky Blue']),
  to_jsonb(ARRAY['UK 8K', 'UK 9K', 'UK 10K', 'UK 11K', 'UK 12K']),
  true, 4.6, 60, 'Unisex', false
),

-- K4: Campus Champ
(
  'k4',
  'Campus Champ',
  'School. Play. Repeat.',
  'Kids',
  849,
  1099,
  'https://lh3.googleusercontent.com/d/1JAkZKl652biLyzUdO5X05Y4s7a1AsqPU',
  'The all-rounder for school and play. Campus Champ combines a scuff-resistant upper with a flexible outsole, keeping kids comfortable from first period to final whistle.',
  to_jsonb(ARRAY['Scuff Resistant', 'Flexible Outsole', 'Memory Foam Insole']),
  to_jsonb(ARRAY['Black', 'Navy', 'Grey']),
  to_jsonb(ARRAY['UK 10K', 'UK 11K', 'UK 12K', 'UK 13K', 'UK 1', 'UK 2', 'UK 3']),
  true, 4.8, 38, 'Unisex', false
),

-- ===========================
-- SCHOOL SHOES (category = 'School Shoes')
-- ===========================

-- S1: Scholar Max Classic
(
  's1',
  'Scholar Max Classic',
  'Timeless. Tough. Tailored.',
  'School Shoes',
  799,
  999,
  'https://lh3.googleusercontent.com/d/19UKGRbcIZHffq1xs56MekmVpgF90H2kr',
  'A sophisticated lace-up icon redefined for the next generation. The Scholar Max pairs a scuff-resistant synthetic finish with a feather-light build, ensuring you stay sharp and agile from the first bell to the final class.',
  to_jsonb(ARRAY['Reinforced Lacing', 'Scuff Resistant', 'Lightweight']),
  to_jsonb(ARRAY['Black', 'Brown']),
  to_jsonb(ARRAY['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10']),
  true, 4.7, 42, 'Male', false
),

-- S2: Edustep Core
(
  's2',
  'Edustep Core',
  'Resilient. Refined. Essential.',
  'School Shoes',
  899,
  1199,
  'https://lh3.googleusercontent.com/d/1BB5uMVdb66bRJLUgle-vUkLaKyK1gC-i',
  'The definitive foundation for the modern student. Engineered with industrial-grade durability and our signature silicone identity tags, the Edustep Core provides elite arch support designed to outlast the most rigorous school year.',
  to_jsonb(ARRAY['Anti-Skid Sole', 'Breathable Mesh', 'Memory Foam Insole']),
  to_jsonb(ARRAY['Black', 'Grey']),
  to_jsonb(ARRAY['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10']),
  true, 4.8, 55, 'Unisex', false
),

-- S3: Academy Pro
(
  's3',
  'Academy Pro',
  'Perform. Excel. Repeat.',
  'School Shoes',
  949,
  1249,
  'https://lh3.googleusercontent.com/d/1P2Rdo8iTmbVCLJ7bKG8SRiYdjoiEl5TZ',
  'Built for the high achiever. Academy Pro features anti-microbial lining to keep feet fresh all day, with a durable rubber toe cap for long-lasting wear through every school season.',
  to_jsonb(ARRAY['Anti-Microbial Lining', 'Rubber Toe Cap', 'Arch Support']),
  to_jsonb(ARRAY['Black']),
  to_jsonb(ARRAY['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10']),
  true, 4.6, 30, 'Unisex', false
),

-- S4: Hallway Runner Girls
(
  's4',
  'Hallway Runner',
  'Confident. Comfortable. Complete.',
  'School Shoes',
  749,
  949,
  'https://lh3.googleusercontent.com/d/1P2Rdo8iTmbVCLJ7bKG8SRiYdjoiEl5TZ',
  'Designed for the girl who never slows down. Hallway Runner features a cushioned footbed and a flexible rubber sole, delivering comfort from morning assembly to after-school sports.',
  to_jsonb(ARRAY['Cushioned Footbed', 'Flexible Rubber Sole', 'Easy Fasten Strap']),
  to_jsonb(ARRAY['Black', 'Navy']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.7, 48, 'Female', false
)

ON CONFLICT (id) DO UPDATE SET
  name          = EXCLUDED.name,
  tagline       = EXCLUDED.tagline,
  price         = EXCLUDED.price,
  originalprice = EXCLUDED.originalprice,
  image         = EXCLUDED.image,
  description   = EXCLUDED.description,
  features      = EXCLUDED.features,
  colors        = EXCLUDED.colors,
  sizes         = EXCLUDED.sizes,
  instock       = EXCLUDED.instock,
  rating        = EXCLUDED.rating,
  stockquantity = EXCLUDED.stockquantity,
  gender        = EXCLUDED.gender;

-- =====================================================================
-- VERIFY: Run after inserting to confirm all products are in
-- =====================================================================
SELECT id, name, price, stockquantity, instock, category, gender
FROM products
WHERE category IN ('Kids', 'School Shoes')
ORDER BY category, id;
