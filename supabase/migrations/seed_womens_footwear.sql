-- =====================================================================
-- FARIO WOMEN'S FOOTWEAR - 8 NEW PRODUCTS
-- Run this in Supabase SQL Editor to add women's footwear products
-- Uses existing Google Drive image IDs from the homepage gallery
-- =====================================================================

INSERT INTO products (
  id, name, tagline, category, price, originalPrice,
  image, description, features, colors, sizes,
  inStock, rating, stockQuantity, gender,
  isDeleted, createdAt, updatedAt
) VALUES

-- W1: Grace Cloud (Comfort Flat)
(
  'w1',
  'Grace Cloud | Effortless. Feminine. Essential.',
  'Everyday elegance reimagined from the ground up.',
  'Shoes',
  1099,
  1499,
  'https://lh3.googleusercontent.com/d/1pc6UNVFR889igs7LbnQml_DpWpVd5AP2',
  'Everyday elegance reimagined from the ground up. The Grace Cloud pairs our signature memory foam insole with a buttery-soft synthetic upper, giving every woman the all-day comfort she deserves — without sacrificing style.',
  '["Memory Foam Insole", "Slip-Resistant Sole", "Breathable Lining"]'::jsonb,
  '["Cream", "Black", "Rose Gold"]'::jsonb,
  '["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"]'::jsonb,
  true,
  4.8,
  60,
  'Female',
  false,
  NOW(),
  NOW()
),

-- W2: Aura Step (Fashion Sneaker)
(
  'w2',
  'Aura Step | Bold. Vibrant. Yours.',
  'Street-fashion sneaker built for the style-forward woman.',
  'Shoes',
  1299,
  1699,
  'https://lh3.googleusercontent.com/d/1JAkZKl652biLyzUdO5X05Y4s7a1AsqPU',
  'Street-fashion sneaker built for the style-forward woman. Aura Step fuses a high-contrast sole with an ultra-clean knit upper, creating a silhouette that turns heads from campus to café.',
  '["Knit Upper", "Cushioned Footbed", "Lightweight EVA Sole"]'::jsonb,
  '["White/Lime", "Black/Purple", "Blush/Gold"]'::jsonb,
  '["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"]'::jsonb,
  true,
  4.9,
  45,
  'Female',
  false,
  NOW(),
  NOW()
),

-- W3: Luna Flex (Running Shoe)
(
  'w3',
  'Luna Flex | Fast. Fluid. Fearless.',
  'Performance running engineered for the female athlete.',
  'Shoes',
  1599,
  1999,
  'https://lh3.googleusercontent.com/d/1tEuedCwZYRWL-aYCOXY46bXCBcnyVuU-',
  'Performance running engineered for the female athlete. Luna Flex features kinetic torsion control and a responsive foam midsole that adapts to every stride, mile after powerful mile.',
  '["Kinetic Torsion Control", "Responsive Foam", "Anti-Skid Tread"]'::jsonb,
  '["Mint Green", "Purple", "White"]'::jsonb,
  '["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"]'::jsonb,
  true,
  4.9,
  38,
  'Female',
  false,
  NOW(),
  NOW()
),

-- W4: Pearl Stride (Formal Comfort)
(
  'w4',
  'Pearl Stride | Polished. Powerful. Professional.',
  'Office-ready comfort with an edge of luxury.',
  'Shoes',
  1399,
  1799,
  'https://lh3.googleusercontent.com/d/19UKGRbcIZHffq1xs56MekmVpgF90H2kr',
  'Office-ready comfort with an edge of luxury. Pearl Stride combines cushioned arch technology with a sleek upper finish, designed for the woman who commands every room she walks into.',
  '["Memory Foam Arch", "Vegan Leather Upper", "Anti-Fatigue Insole"]'::jsonb,
  '["Nude/Beige", "Black", "Burgundy"]'::jsonb,
  '["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"]'::jsonb,
  true,
  4.7,
  32,
  'Female',
  false,
  NOW(),
  NOW()
),

-- W5: Bloom Lite (Casual Slip-On)
(
  'w5',
  'Bloom Lite | Free. Light. Joyful.',
  'The slip-on that feels like walking on air.',
  'Shoes',
  899,
  1199,
  'https://lh3.googleusercontent.com/d/1fm0yzmL6IQktGcvEZ34X3hF3YaVqcYoC',
  'The slip-on that feels like walking on air. Bloom Lite has zero-lace convenience with a cloud-cushion base and breathable canvas upper, making it the perfect pick for spontaneous days.',
  '["Zero-Lace Design", "Cloud Cushion Base", "Canvas Upper"]'::jsonb,
  '["Sky Blue", "Coral", "Ivory"]'::jsonb,
  '["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"]'::jsonb,
  true,
  4.6,
  55,
  'Female',
  false,
  NOW(),
  NOW()
),

-- W6: Velvet Force (High-Top Sneaker)
(
  'w6',
  'Velvet Force | Strong. Sleek. Unstoppable.',
  'High-top street power for the bold woman.',
  'Shoes',
  1499,
  1899,
  'https://lh3.googleusercontent.com/d/1P2Rdo8iTmbVCLJ7bKG8SRiYdjoiEl5TZ',
  'High-top street power for the bold woman. Velvet Force features ankle support panels and a chunky profile that blends athletic function with street-style attitude — because why choose?',
  '["Ankle Support Panels", "Chunky Street Sole", "Anti-Odor Lining"]'::jsonb,
  '["Black/Gold", "White/Lime", "Midnight Blue"]'::jsonb,
  '["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"]'::jsonb,
  true,
  4.8,
  28,
  'Female',
  false,
  NOW(),
  NOW()
),

-- W7: Spark Trail (Outdoor / Sporty)
(
  'w7',
  'Spark Trail | Rugged. Ready. Resilient.',
  'Built for women who explore beyond the pavement.',
  'Shoes',
  1799,
  2299,
  'https://lh3.googleusercontent.com/d/1BB5uMVdb66bRJLUgle-vUkLaKyK1gC-i',
  'Built for women who explore beyond the pavement. Spark Trail combines a ridged multi-terrain outsole with a waterproof-coated upper, giving outdoor enthusiasts the grip and protection needed for every adventure.',
  '["Waterproof Coating", "Multi-Terrain Grip", "Padded Collar"]'::jsonb,
  '["Olive Green", "Tan", "Black"]'::jsonb,
  '["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"]'::jsonb,
  true,
  4.9,
  20,
  'Female',
  false,
  NOW(),
  NOW()
),

-- W8: Serenity Knit (Athleisure)
(
  'w8',
  'Serenity Knit | Calm. Confident. Comfortable.',
  'Athleisure perfected for the modern Indian woman.',
  'Shoes',
  1199,
  1599,
  'https://lh3.googleusercontent.com/d/1P2Rdo8iTmbVCLJ7bKG8SRiYdjoiEl5TZ',
  'Athleisure perfected for the modern Indian woman. Serenity Knit uses a seamless sock-fit construction with a flexible rubber sole, blending yoga-studio softness with streetwear versatility.',
  '["Sock-Fit Knit", "Flexible Rubber Sole", "Moisture-Wicking Lining"]'::jsonb,
  '["Lilac", "Rose", "Stone Grey"]'::jsonb,
  '["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"]'::jsonb,
  true,
  4.7,
  42,
  'Female',
  false,
  NOW(),
  NOW()
)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  price = EXCLUDED.price,
  originalPrice = EXCLUDED.originalPrice,
  image = EXCLUDED.image,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  colors = EXCLUDED.colors,
  sizes = EXCLUDED.sizes,
  inStock = EXCLUDED.inStock,
  rating = EXCLUDED.rating,
  stockQuantity = EXCLUDED.stockQuantity,
  gender = EXCLUDED.gender,
  updatedAt = NOW();

-- =====================================================================
-- VERIFICATION QUERY - Run after inserting
-- =====================================================================
SELECT id, name, price, stockQuantity, inStock, gender, category 
FROM products 
WHERE gender = 'Female'
ORDER BY id;
