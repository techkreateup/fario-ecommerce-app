-- =====================================================================
-- FARIO WOMEN'S FOOTWEAR - 8 PRODUCTS (NO HL3 IMAGES)
-- Real women's shoe photos from Unsplash + user-provided URLs
-- Run this in Supabase SQL Editor
-- Schema: fario_complete_setup.sql (all lowercase columns)
-- =====================================================================

INSERT INTO products (
  id, name, tagline, category, price, originalprice,
  image, description, features, colors, sizes,
  instock, rating, stockquantity, gender, isdeleted
) VALUES

-- W1: Grace Cloud (Comfort Flat) - Fabindia CDN (real women's shoe)
(
  'w1',
  'Grace Cloud',
  'Effortless. Feminine. Essential.',
  'Shoes',
  1099,
  1499,
  'https://apisap.fabindia.com/medias/20267929-01.jpg?context=bWFzdGVyfGltYWdlc3wyMDU5MTR8aW1hZ2UvanBlZ3xhRGRqTDJobE15OHhNakkwTWpJM056UTRNalE1T1RBdk1qQXlOamM1TWpsZk1ERXVhbkJufDg1NWUwNGU2OGY0ZTExZDFmYjAzNWE1OWE4MDNkOGU5YzdlOTdjZjA1ZGFlYjg1YmY5YmMyZGYxNjMxM2FkYWE&aio=w-400',
  'Everyday elegance reimagined from the ground up. The Grace Cloud pairs our signature memory foam insole with a buttery-soft synthetic upper, giving every woman the all-day comfort she deserves — without sacrificing style.',
  to_jsonb(ARRAY['Memory Foam Insole', 'Slip-Resistant Sole', 'Breathable Lining']),
  to_jsonb(ARRAY['Cream', 'Black', 'Rose Gold']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.8, 60, 'Female', false
),

-- W2: Aura Step (Fashion Sneaker) - Google Images URL (real women's shoe)
(
  'w2',
  'Aura Step',
  'Bold. Vibrant. Yours.',
  'Shoes',
  1299,
  1699,
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOrSORI8SxCpda3U_QaG88DbZgS9hiUtgQpw&s',
  'Street-fashion sneaker built for the style-forward woman. Aura Step fuses a high-contrast sole with an ultra-clean knit upper, creating a silhouette that turns heads from campus to café.',
  to_jsonb(ARRAY['Knit Upper', 'Cushioned Footbed', 'Lightweight EVA Sole']),
  to_jsonb(ARRAY['White/Lime', 'Black/Purple', 'Blush/Gold']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.9, 45, 'Female', false
),

-- W3: Luna Flex (Running Shoe) - Unsplash
(
  'w3',
  'Luna Flex',
  'Fast. Fluid. Fearless.',
  'Shoes',
  1599,
  1999,
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  'Performance running engineered for the female athlete. Luna Flex features kinetic torsion control and a responsive foam midsole that adapts to every stride, mile after powerful mile.',
  to_jsonb(ARRAY['Kinetic Torsion Control', 'Responsive Foam', 'Anti-Skid Tread']),
  to_jsonb(ARRAY['Mint Green', 'Purple', 'White']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.9, 38, 'Female', false
),

-- W4: Pearl Stride (Formal Comfort) - Unsplash
(
  'w4',
  'Pearl Stride',
  'Polished. Powerful. Professional.',
  'Shoes',
  1399,
  1799,
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80',
  'Office-ready comfort with an edge of luxury. Pearl Stride combines cushioned arch technology with a sleek upper finish, designed for the woman who commands every room she walks into.',
  to_jsonb(ARRAY['Memory Foam Arch', 'Vegan Leather Upper', 'Anti-Fatigue Insole']),
  to_jsonb(ARRAY['Nude/Beige', 'Black', 'Burgundy']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.7, 32, 'Female', false
),

-- W5: Bloom Lite (Casual Slip-On) - Unsplash
(
  'w5',
  'Bloom Lite',
  'Free. Light. Joyful.',
  'Shoes',
  899,
  1199,
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
  'The slip-on that feels like walking on air. Bloom Lite has zero-lace convenience with a cloud-cushion base and breathable canvas upper, making it the perfect pick for spontaneous days.',
  to_jsonb(ARRAY['Zero-Lace Design', 'Cloud Cushion Base', 'Canvas Upper']),
  to_jsonb(ARRAY['Sky Blue', 'Coral', 'Ivory']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.6, 55, 'Female', false
),

-- W6: Velvet Force (High-Top Sneaker) - Unsplash
(
  'w6',
  'Velvet Force',
  'Strong. Sleek. Unstoppable.',
  'Shoes',
  1499,
  1899,
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
  'High-top street power for the bold woman. Velvet Force features ankle support panels and a chunky profile that blends athletic function with street-style attitude.',
  to_jsonb(ARRAY['Ankle Support Panels', 'Chunky Street Sole', 'Anti-Odor Lining']),
  to_jsonb(ARRAY['Black/Gold', 'White/Lime', 'Midnight Blue']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.8, 28, 'Female', false
),

-- W7: Spark Trail (Outdoor) - Unsplash
(
  'w7',
  'Spark Trail',
  'Rugged. Ready. Resilient.',
  'Shoes',
  1799,
  2299,
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
  'Built for women who explore beyond the pavement. Spark Trail combines a ridged multi-terrain outsole with a waterproof-coated upper, giving outdoor enthusiasts the grip and protection needed for every adventure.',
  to_jsonb(ARRAY['Waterproof Coating', 'Multi-Terrain Grip', 'Padded Collar']),
  to_jsonb(ARRAY['Olive Green', 'Tan', 'Black']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.9, 20, 'Female', false
),

-- W8: Serenity Knit (Athleisure) - Unsplash
(
  'w8',
  'Serenity Knit',
  'Calm. Confident. Comfortable.',
  'Shoes',
  1199,
  1599,
  'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&q=80',
  'Athleisure perfected for the modern Indian woman. Serenity Knit uses a seamless sock-fit construction with a flexible rubber sole, blending yoga-studio softness with streetwear versatility.',
  to_jsonb(ARRAY['Sock-Fit Knit', 'Flexible Rubber Sole', 'Moisture-Wicking Lining']),
  to_jsonb(ARRAY['Lilac', 'Rose', 'Stone Grey']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.7, 42, 'Female', false
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
-- VERIFY: All 8 women's products with correct (non-HL3) images
-- =====================================================================
SELECT id, name, price, stockquantity, instock, gender, image
FROM products
WHERE gender = 'Female'
ORDER BY id;
