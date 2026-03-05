-- =====================================================================
-- FARIO WOMEN'S FOOTWEAR - UPDATE IMAGES WITH REAL SHOE PHOTOS
-- Run this in Supabase SQL Editor to update product images
-- =====================================================================

-- Update w1: Grace Cloud - Real women's shoe from Fabindia CDN
UPDATE products SET
  image = 'https://apisap.fabindia.com/medias/20267929-01.jpg?context=bWFzdGVyfGltYWdlc3wyMDU5MTR8aW1hZ2UvanBlZ3xhRGRqTDJobE15OHhNakkwTWpJM056UTRNalE1T1RBdk1qQXlOamM1TWpsZk1ERXVhbkJufDg1NWUwNGU2OGY0ZTExZDFmYjAzNWE1OWE4MDNkOGU5YzdlOTdjZjA1ZGFlYjg1YmY5YmMyZGYxNjMxM2FkYWE&aio=w-400'
WHERE id = 'w1';

-- Update w2: Aura Step - Real women's shoe from Google Images
UPDATE products SET
  image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOrSORI8SxCpda3U_QaG88DbZgS9hiUtgQpw&s'
WHERE id = 'w2';

-- ✅ Verify updates
SELECT id, name, image FROM products WHERE gender = 'Female' ORDER BY id;

-- =====================================================================
-- NOTE FOR REMAINING 6 PRODUCTS (w3-w8):
-- The other images were provided as base64 data. To use them:
-- 1. Save each base64 image to your Google Drive folder
-- 2. Share the file publicly (Anyone with link can view)
-- 3. Get the file ID from the share URL
-- 4. Run: UPDATE products SET image = 'https://lh3.googleusercontent.com/d/{FILE_ID}' WHERE id = 'w3';
-- =====================================================================
