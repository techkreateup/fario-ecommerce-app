-- =====================================================================
-- COMPLETE WOMEN'S FOOTWEAR RESET (8 PRODUCTS)
-- =====================================================================

DELETE FROM products WHERE gender = 'Female';

INSERT INTO products (
  id, name, tagline, category, price, originalprice,
  image, description, features, colors, sizes,
  instock, rating, stockquantity, gender, isdeleted
) VALUES
(
  'w1', 'Grace Cloud', 'Effortless. Feminine. Essential.', 'Shoes', 1099, 1499,
  'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcThRb6Na5MrV7d4JxRHfz5R6C60iZr017CQ-aM4PNWPku3_0QSKLmaK1XpePwVCpIZutDrVw4Z7vOuJiCLIzywHpXjA0baXZiW-gWH5TWZEeqX1zLQR0z9FajwoHhTaESKvRiIZFDo&usqp=CAc',
  'Everyday elegance reimagined from the ground up.',
  to_jsonb(ARRAY['Memory Foam Insole', 'Slip-Resistant Sole', 'Breathable Lining']),
  to_jsonb(ARRAY['Cream', 'Black', 'Rose Gold']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.8, 60, 'Female', false
),
(
  'w2', 'Aura Step', 'Bold. Vibrant. Yours.', 'Shoes', 1299, 1699,
  'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQASaQKWHqUwFssgd9HCff069ovTHMGsPVsYnjx891UBc416yWY40BS2WUmtfj_lgVvyHtvGD6d7Mmo_li3jAURYZJO8dr5wXf9QE0TvDU&usqp=CAc',
  'Street-fashion sneaker built for the style-forward woman.',
  to_jsonb(ARRAY['Knit Upper', 'Cushioned Footbed', 'Lightweight EVA Sole']),
  to_jsonb(ARRAY['White/Lime', 'Black/Purple', 'Blush/Gold']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.9, 45, 'Female', false
),
(
  'w3', 'Luna Flex', 'Fast. Fluid. Fearless.', 'Shoes', 1599, 1999,
  'data:image/jpeg;base64,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',
  'Performance running engineered for the female athlete.',
  to_jsonb(ARRAY['Kinetic Torsion Control', 'Responsive Foam', 'Anti-Skid Tread']),
  to_jsonb(ARRAY['Mint Green', 'Purple', 'White']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.9, 38, 'Female', false
),
(
  'w4', 'Pearl Stride', 'Polished. Powerful. Professional.', 'Shoes', 1399, 1799,
  'https://apisap.fabindia.com/medias/20267929-01.jpg?context=bWFzdGVyfGltYWdlc3wyMDU5MTR8aW1hZ2UvanBlZ3xhRGRqTDJobE15OHhNakkwTWpJM056UTRNalE1T1RBdk1qQXlOamM1TWpsZk1ERXVhbkJufDg1NWUwNGU2OGY0ZTExZDFmYjAzNWE1OWE4MDNkOGU5YzdlOTdjZjA1ZGFlYjg1YmY5YmMyZGYxNjMxM2FkYWE&aio=w-400',
  'Office-ready comfort with an edge of luxury.',
  to_jsonb(ARRAY['Memory Foam Arch', 'Vegan Leather Upper', 'Anti-Fatigue Insole']),
  to_jsonb(ARRAY['Nude/Beige', 'Black', 'Burgundy']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.7, 32, 'Female', false
),
(
  'w5', 'Bloom Lite', 'Free. Light. Joyful.', 'Shoes', 899, 1199,
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHdTjgW0825FOjBYGbLItzLa5TdzjYS6-lzg&s',
  'The sandal that feels like walking on air.',
  to_jsonb(ARRAY['Cloud Cushion Base', 'Adjustable Strap', 'Anti-Slip Sole']),
  to_jsonb(ARRAY['Sky Blue', 'Coral', 'Ivory']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.6, 55, 'Female', false
),
(
  'w6', 'Velvet Force', 'Strong. Sleek. Unstoppable.', 'Shoes', 1499, 1899,
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO2Kxh4ZUzKkiRxXSeBwHoFXLBeY7AqjPjwQ&s',
  'High-top street power for the bold woman.',
  to_jsonb(ARRAY['Ankle Support Panels', 'Chunky Street Sole', 'Anti-Odor Lining']),
  to_jsonb(ARRAY['Black/Gold', 'White/Lime', 'Midnight Blue']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.8, 28, 'Female', false
),
(
  'w7', 'Spark Trail', 'Adventure. Unbound.', 'Shoes', 1699, 2099,
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQijuEjsLkbieCQAORLWhe-WWXDKfXlBIv1vg&s',
  'Tackle any terrain with the Spark Trail, designed for ultimate grip and comfort.',
  to_jsonb(ARRAY['Trail Grip', 'Water Resistant', 'Reinforced Toe']),
  to_jsonb(ARRAY['Olive/Black', 'Grey/Orange', 'Tan']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.8, 40, 'Female', false
),
(
  'w8', 'Serenity Knit', 'Soft. Flexible. Yours.', 'Shoes', 1199, 1599,
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxZi_07UaFciaJB4ByUoewBnqNvJ1m4PvKOg&s',
  'A slip-on knit shoe that wraps your foot in pure Serenity.',
  to_jsonb(ARRAY['Seamless Knit', 'Slip-on Design', 'Featherlight']),
  to_jsonb(ARRAY['Lavender', 'Charcoal', 'Navy']),
  to_jsonb(ARRAY['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8']),
  true, 4.7, 50, 'Female', false
);
