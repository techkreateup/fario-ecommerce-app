-- =====================================================================
-- COMPLETE MEN'S FOOTWEAR RESET WITH HL3 IMAGES
-- =====================================================================

DELETE FROM products WHERE gender = 'Male';

INSERT INTO products (
  id, name, tagline, category, price, originalprice,
  image, description, features, colors, sizes,
  instock, rating, stockquantity, gender, isdeleted
) VALUES

(
  'm1', 'AeroStride Pro', 'Push your limits. Own the run.', 'Shoes', 2499, 3999,
  'https://lh3.googleusercontent.com/d/1tEuedCwZYRWL-aYCOXY46bXCBcnyVuU-',
  'Premium performance running shoe engineered for elite athletes.',
  to_jsonb(ARRAY['Breathable Knit', 'Responsive Cushioning']),
  to_jsonb(ARRAY['Neon/Black', 'White/Blue']),
  to_jsonb(ARRAY['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12']),
  true, 4.8, 45, 'Male', false
),
(
  'm2', 'Urban Glide', 'The city is your playground.', 'Shoes', 1999, 2999,
  'https://lh3.googleusercontent.com/d/1pc6UNVFR889igs7LbnQml_DpWpVd5AP2',
  'Sleek streetwear slip-ons built for all-day comfort in the urban jungle.',
  to_jsonb(ARRAY['Slip-on ease', 'Memory Foam']),
  to_jsonb(ARRAY['All Black', 'Grey Matrix']),
  to_jsonb(ARRAY['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']),
  true, 4.5, 30, 'Male', false
),
(
  'm3', 'Midnight Force', 'Dominate the night.', 'Shoes', 2199, 3499,
  'https://lh3.googleusercontent.com/d/1JAkZKl652biLyzUdO5X05Y4s7a1AsqPU',
  'High-top sneakers with attitude, built to handle any street surface.',
  to_jsonb(ARRAY['Ankle Support', 'Durable Sole']),
  to_jsonb(ARRAY['Midnight Black', 'Shadow Grey']),
  to_jsonb(ARRAY['UK 8', 'UK 9', 'UK 10', 'UK 11']),
  true, 4.7, 25, 'Male', false
),
(
  'm4', 'Velocity Elite', 'Speed meets precision.', 'Shoes', 2899, 4299,
  'https://lh3.googleusercontent.com/d/19UKGRbcIZHffq1xs56MekmVpgF90H2kr',
  'Elite tier marathon shoe with ultra-light carbon plates.',
  to_jsonb(ARRAY['Carbon Plate', 'Ultra-lightweight']),
  to_jsonb(ARRAY['Crimson Red', 'Electric Blue']),
  to_jsonb(ARRAY['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12']),
  true, 4.9, 15, 'Male', false
),
(
  'm5', 'Street Kicks', 'Classic style. Modern comfort.', 'Shoes', 1599, 2499,
  'https://lh3.googleusercontent.com/d/1fm0yzmL6IQktGcvEZ34X3hF3YaVqcYoC',
  'Everyday casual wear inspired by retro court classics.',
  to_jsonb(ARRAY['Canvas Upper', 'Vulcanized Rubber']),
  to_jsonb(ARRAY['Classic White', 'Navy/White']),
  to_jsonb(ARRAY['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']),
  true, 4.4, 60, 'Male', false
),
(
  'm6', 'Runner X', 'Versatile trainer for every day.', 'Shoes', 1799, 2699,
  'https://lh3.googleusercontent.com/d/1P2Rdo8iTmbVCLJ7bKG8SRiYdjoiEl5TZ',
  'Your go-to gym and road shoe with adaptive flex grooves.',
  to_jsonb(ARRAY['Mesh Upper', 'Flex Grooves']),
  to_jsonb(ARRAY['Cobalt Blue', 'Black/White']),
  to_jsonb(ARRAY['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']),
  true, 4.6, 35, 'Male', false
),
(
  'm7', 'Classic Court', 'Court-inspired heritage.', 'Shoes', 1899, 2799,
  'https://lh3.googleusercontent.com/d/1BB5uMVdb66bRJLUgle-vUkLaKyK1gC-i',
  'Vintage vibes with modern tech and thick cupsole construction.',
  to_jsonb(ARRAY['Leather Upper', 'Cupsole Construction']),
  to_jsonb(ARRAY['White/Green', 'Off-White']),
  to_jsonb(ARRAY['UK 8', 'UK 9', 'UK 10', 'UK 11']),
  true, 4.5, 40, 'Male', false
),
(
  'm8', 'Minimalist High', 'Elevate your basics.', 'Shoes', 2299, 3599,
  'https://lh3.googleusercontent.com/d/1pc6UNVFR889igs7LbnQml_DpWpVd5AP2',
  'Clean, high-top design that pairs with any casual outfit.',
  to_jsonb(ARRAY['Premium Leather', 'Padded Collar']),
  to_jsonb(ARRAY['All White', 'Gum Sole']),
  to_jsonb(ARRAY['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']),
  true, 4.8, 20, 'Male', false
);

SELECT id, name, gender, image FROM products WHERE gender = 'Male' ORDER BY id;
