-- =====================================================================
-- ADD 6 MORE WOMEN'S FOOTWEAR PRODUCTS (w3 - w8)
-- Using REAL Unsplash women's shoe images — NO HL3
-- Run this in Supabase SQL Editor
-- =====================================================================

INSERT INTO products (
  id, name, tagline, category, price, originalprice,
  image, description, features, colors, sizes,
  instock, rating, stockquantity, gender, isdeleted
) VALUES

-- W3: Luna Flex (Running Shoe)
(
  'w3',
  'Luna Flex',
  'Fast. Fluid. Fearless.',
  'Shoes',
  1599,
  1999,
  'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80',
  'Performance running engineered for the female athlete. Luna Flex features kinetic torsion control and a responsive foam midsole that adapts to every stride.',
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
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80',
  'Office-ready comfort with an edge of luxury. Pearl Stride combines cushioned arch technology with a sleek upper finish, for the woman who commands every room.',
  to_jsonb(ARRAY['Memory Foam Arch', 'Vegan Leather Upper', 'Anti-Fatigue Insole']),
  to_jsonb(ARRAY['Nude/Beige', 'Black', 'Burgundy']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.7, 32, 'Female', false
),

-- W5: Bloom Lite (Casual Sandal)
(
  'w5',
  'Bloom Lite',
  'Free. Light. Joyful.',
  'Shoes',
  899,
  1199,
  'https://images.unsplash.com/photo-1598808503746-f34cfb267a0a?w=600&q=80',
  'The sandal that feels like walking on air. Bloom Lite has a cloud-cushion base and breathable straps, making it the perfect pick for spontaneous summer days.',
  to_jsonb(ARRAY['Cloud Cushion Base', 'Adjustable Strap', 'Anti-Slip Sole']),
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
  'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=600&q=80',
  'High-top street power for the bold woman. Velvet Force features ankle support panels and a chunky profile that blends athletic function with street-style attitude.',
  to_jsonb(ARRAY['Ankle Support Panels', 'Chunky Street Sole', 'Anti-Odor Lining']),
  to_jsonb(ARRAY['Black/Gold', 'White/Lime', 'Midnight Blue']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.8, 28, 'Female', false
),

-- W7: Spark Trail (Outdoor Boot)
(
  'w7',
  'Spark Trail',
  'Rugged. Ready. Resilient.',
  'Shoes',
  1799,
  2299,
  'https://images.unsplash.com/photo-1583496661160-fb5974f1ff64?w=600&q=80',
  'Built for women who explore beyond the pavement. Spark Trail combines a ridged multi-terrain outsole with a waterproof-coated upper for every adventure.',
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
  'https://images.unsplash.com/photo-1604179693289-06e0ca453e57?w=600&q=80',
  'Athleisure perfected for the modern Indian woman. Serenity Knit uses a seamless sock-fit construction with a flexible rubber sole, blending comfort with streetwear style.',
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
-- VERIFY: All 8 women's products (w1-w8), all Female, NO HL3 images
-- =====================================================================
SELECT id, name, image, instock, gender
FROM products
WHERE gender = 'Female'
ORDER BY id;
