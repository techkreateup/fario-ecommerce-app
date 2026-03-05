-- =====================================================================
-- FARIO WOMEN'S FOOTWEAR - 8 NEW PRODUCTS
-- Run this in Supabase SQL Editor to add women's footwear products
-- Uses existing Google Drive image IDs from the homepage gallery
-- Schema matches: fario_complete_setup.sql (all lowercase columns)
-- =====================================================================

INSERT INTO products (
  id, name, tagline, category, price, originalprice,
  image, description, features, colors, sizes,
  instock, rating, stockquantity, gender, isdeleted
) VALUES

-- W1: Grace Cloud (Comfort Flat)
(
  'w1',
  'Grace Cloud',
  'Effortless. Feminine. Essential.',
  'Shoes',
  1099,
  1499,
  'https://lh3.googleusercontent.com/d/1pc6UNVFR889igs7LbnQml_DpWpVd5AP2',
  'Everyday elegance reimagined from the ground up. The Grace Cloud pairs our signature memory foam insole with a buttery-soft synthetic upper, giving every woman the all-day comfort she deserves — without sacrificing style.',
  to_jsonb(ARRAY['Memory Foam Insole', 'Slip-Resistant Sole', 'Breathable Lining']),
  to_jsonb(ARRAY['Cream', 'Black', 'Rose Gold']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.8, 60, 'Female', false
),

-- W2: Aura Step (Fashion Sneaker)
(
  'w2',
  'Aura Step',
  'Bold. Vibrant. Yours.',
  'Shoes',
  1299,
  1699,
  'https://lh3.googleusercontent.com/d/1JAkZKl652biLyzUdO5X05Y4s7a1AsqPU',
  'Street-fashion sneaker built for the style-forward woman. Aura Step fuses a high-contrast sole with an ultra-clean knit upper, creating a silhouette that turns heads from campus to café.',
  to_jsonb(ARRAY['Knit Upper', 'Cushioned Footbed', 'Lightweight EVA Sole']),
  to_jsonb(ARRAY['White/Lime', 'Black/Purple', 'Blush/Gold']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.9, 45, 'Female', false
),

-- W3: Luna Flex (Running Shoe)
(
  'w3',
  'Luna Flex',
  'Fast. Fluid. Fearless.',
  'Shoes',
  1599,
  1999,
  'https://lh3.googleusercontent.com/d/1tEuedCwZYRWL-aYCOXY46bXCBcnyVuU-',
  'Performance running engineered for the female athlete. Luna Flex features kinetic torsion control and a responsive foam midsole that adapts to every stride, mile after powerful mile.',
  to_jsonb(ARRAY['Kinetic Torsion Control', 'Responsive Foam', 'Anti-Skid Tread']),
  to_jsonb(ARRAY['Mint Green', 'Purple', 'White']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.9, 38, 'Female', false
),

-- W4: Pearl Stride (Formal Comfort)
(
  'w4',
  'Pearl Stride',
  'Polished. Powerful. Professional.',
  'Shoes',
  1399,
  1799,
  'https://lh3.googleusercontent.com/d/19UKGRbcIZHffq1xs56MekmVpgF90H2kr',
  'Office-ready comfort with an edge of luxury. Pearl Stride combines cushioned arch technology with a sleek upper finish, designed for the woman who commands every room she walks into.',
  to_jsonb(ARRAY['Memory Foam Arch', 'Vegan Leather Upper', 'Anti-Fatigue Insole']),
  to_jsonb(ARRAY['Nude/Beige', 'Black', 'Burgundy']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.7, 32, 'Female', false
),

-- W5: Bloom Lite (Casual Slip-On)
(
  'w5',
  'Bloom Lite',
  'Free. Light. Joyful.',
  'Shoes',
  899,
  1199,
  'https://lh3.googleusercontent.com/d/1fm0yzmL6IQktGcvEZ34X3hF3YaVqcYoC',
  'The slip-on that feels like walking on air. Bloom Lite has zero-lace convenience with a cloud-cushion base and breathable canvas upper, making it the perfect pick for spontaneous days.',
  to_jsonb(ARRAY['Zero-Lace Design', 'Cloud Cushion Base', 'Canvas Upper']),
  to_jsonb(ARRAY['Sky Blue', 'Coral', 'Ivory']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.6, 55, 'Female', false
),

-- W6: Velvet Force (High-Top Sneaker)
(
  'w6',
  'Velvet Force',
  'Strong. Sleek. Unstoppable.',
  'Shoes',
  1499,
  1899,
  'https://lh3.googleusercontent.com/d/1P2Rdo8iTmbVCLJ7bKG8SRiYdjoiEl5TZ',
  'High-top street power for the bold woman. Velvet Force features ankle support panels and a chunky profile that blends athletic function with street-style attitude.',
  to_jsonb(ARRAY['Ankle Support Panels', 'Chunky Street Sole', 'Anti-Odor Lining']),
  to_jsonb(ARRAY['Black/Gold', 'White/Lime', 'Midnight Blue']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.8, 28, 'Female', false
),

-- W7: Spark Trail (Outdoor)
(
  'w7',
  'Spark Trail',
  'Rugged. Ready. Resilient.',
  'Shoes',
  1799,
  2299,
  'https://lh3.googleusercontent.com/d/1BB5uMVdb66bRJLUgle-vUkLaKyK1gC-i',
  'Built for women who explore beyond the pavement. Spark Trail combines a ridged multi-terrain outsole with a waterproof-coated upper, giving outdoor enthusiasts the grip and protection needed for every adventure.',
  to_jsonb(ARRAY['Waterproof Coating', 'Multi-Terrain Grip', 'Padded Collar']),
  to_jsonb(ARRAY['Olive Green', 'Tan', 'Black']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.9, 20, 'Female', false
),

-- W8: Serenity Knit (Athleisure)
(
  'w8',
  'Serenity Knit',
  'Calm. Confident. Comfortable.',
  'Shoes',
  1199,
  1599,
  'https://lh3.googleusercontent.com/d/1P2Rdo8iTmbVCLJ7bKG8SRiYdjoiEl5TZ',
  'Athleisure perfected for the modern Indian woman. Serenity Knit uses a seamless sock-fit construction with a flexible rubber sole, blending yoga-studio softness with streetwear versatility.',
  to_jsonb(ARRAY['Sock-Fit Knit', 'Flexible Rubber Sole', 'Moisture-Wicking Lining']),
  to_jsonb(ARRAY['Lilac', 'Rose', 'Stone Grey']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.7, 42, 'Female', false
)

ON CONFLICT (id) DO UPDATE SET
  name        = EXCLUDED.name,
  tagline     = EXCLUDED.tagline,
  price       = EXCLUDED.price,
  originalprice = EXCLUDED.originalprice,
  image       = EXCLUDED.image,
  description = EXCLUDED.description,
  features    = EXCLUDED.features,
  colors      = EXCLUDED.colors,
  sizes       = EXCLUDED.sizes,
  instock     = EXCLUDED.instock,
  rating      = EXCLUDED.rating,
  stockquantity = EXCLUDED.stockquantity,
  gender      = EXCLUDED.gender;

-- =====================================================================
-- VERIFY: Run this after inserting to confirm all 8 products are in
-- =====================================================================
SELECT id, name, price, stockquantity, instock, gender
FROM products
WHERE gender = 'Female'
ORDER BY id;
