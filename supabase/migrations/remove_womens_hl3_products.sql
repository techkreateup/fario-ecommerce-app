-- =====================================================================
-- REMOVE WOMEN'S PRODUCTS WITH HL3 IMAGES (w3 - w8)
-- These were seeded with HL3 Google Drive image URLs.
-- w1 (Fabindia) and w2 (gstatic) are KEPT as they have real images.
-- =====================================================================

-- Hard delete women's products w3 through w8 (HL3 image URLs)
DELETE FROM products
WHERE id IN ('w3', 'w4', 'w5', 'w6', 'w7', 'w8');

-- =====================================================================
-- VERIFY: Only w1 and w2 should remain for gender = 'Female'
-- =====================================================================
SELECT id, name, image, gender
FROM products
WHERE gender = 'Female'
ORDER BY id;
