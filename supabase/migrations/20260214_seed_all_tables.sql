-- =====================================================
-- FARIO: Seed Data for All Empty Tables (v3 FIXED)
-- Date: 2026-02-14
-- Run in Supabase Dashboard → SQL Editor
-- =====================================================
-- Orders MUST be created before reviews (FK constraint).
-- Column names verified from actual Supabase Dashboard.

-- =====================================================
-- 1. SETTINGS (Store Configuration - Singleton Row)
-- =====================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM settings LIMIT 1) THEN
        INSERT INTO settings DEFAULT VALUES;
        RAISE NOTICE '✅ Settings created!';
    ELSE
        RAISE NOTICE '⏭️ Settings already exists.';
    END IF;
END $$;


-- =====================================================
-- 2. ORDERS (Must come BEFORE reviews due to FK)
-- =====================================================
DO $$
DECLARE
    user_rec RECORD;
    prod1 RECORD;
    prod2 RECORD;
    prod3 RECORD;
    order_id1 TEXT;
    order_id2 TEXT;
    order_id3 TEXT;
BEGIN
    SELECT id, email INTO user_rec FROM auth.users LIMIT 1;
    IF user_rec IS NULL THEN
        RAISE NOTICE '⚠️ No users. Skipping orders.';
        RETURN;
    END IF;

    SELECT id, name, price, image INTO prod1 FROM products WHERE isdeleted = false ORDER BY id LIMIT 1;
    SELECT id, name, price, image INTO prod2 FROM products WHERE isdeleted = false ORDER BY id LIMIT 1 OFFSET 1;
    SELECT id, name, price, image INTO prod3 FROM products WHERE isdeleted = false ORDER BY id LIMIT 1 OFFSET 2;

    IF prod1 IS NULL THEN
        RAISE NOTICE '⚠️ No products. Skipping orders.';
        RETURN;
    END IF;

    order_id1 := 'ORD-20260210-' || substr(gen_random_uuid()::text, 1, 8);
    order_id2 := 'ORD-20260213-' || substr(gen_random_uuid()::text, 1, 8);
    order_id3 := 'ORD-20260212-' || substr(gen_random_uuid()::text, 1, 8);

    -- Order 1: Delivered
    INSERT INTO orders (id, user_id, useremail, items, total, shippingaddress, paymentmethod, status, timeline, createdat, isarchived)
    VALUES (
        order_id1, user_rec.id, user_rec.email,
        jsonb_build_array(jsonb_build_object(
            'id', prod1.id, 'name', prod1.name, 'price', prod1.price,
            'quantity', 1, 'size', 'UK 8', 'color', 'Black', 'image', prod1.image
        )),
        prod1.price,
        'No. 12, Avinashi Road, Coimbatore, TN 641018',
        'Cash on Delivery', 'Delivered',
        jsonb_build_array(
            jsonb_build_object('status', 'Order Placed', 'timestamp', (NOW() - interval '4 days')::text, 'description', 'Order placed successfully'),
            jsonb_build_object('status', 'Processing', 'timestamp', (NOW() - interval '3 days')::text, 'description', 'Being prepared'),
            jsonb_build_object('status', 'Shipped', 'timestamp', (NOW() - interval '2 days')::text, 'description', 'Handed to courier'),
            jsonb_build_object('status', 'Delivered', 'timestamp', (NOW() - interval '1 day')::text, 'description', 'Delivered successfully')
        ),
        NOW() - interval '4 days', false
    );

    -- Order 2: Processing
    IF prod2 IS NOT NULL THEN
        INSERT INTO orders (id, user_id, useremail, items, total, shippingaddress, paymentmethod, status, timeline, createdat, isarchived)
        VALUES (
            order_id2, user_rec.id, user_rec.email,
            jsonb_build_array(jsonb_build_object(
                'id', prod2.id, 'name', prod2.name, 'price', prod2.price,
                'quantity', 2, 'size', 'UK 7', 'color', 'Black', 'image', prod2.image
            )),
            prod2.price * 2,
            'No. 12, Avinashi Road, Coimbatore, TN 641018',
            'Wallet', 'Processing',
            jsonb_build_array(
                jsonb_build_object('status', 'Order Placed', 'timestamp', (NOW() - interval '1 day')::text, 'description', 'Order placed successfully'),
                jsonb_build_object('status', 'Processing', 'timestamp', NOW()::text, 'description', 'Being prepared')
            ),
            NOW() - interval '1 day', false
        );
    END IF;

    -- Order 3: Shipped
    IF prod3 IS NOT NULL THEN
        INSERT INTO orders (id, user_id, useremail, items, total, shippingaddress, paymentmethod, status, timeline, createdat, isarchived)
        VALUES (
            order_id3, user_rec.id, user_rec.email,
            jsonb_build_array(jsonb_build_object(
                'id', prod3.id, 'name', prod3.name, 'price', prod3.price,
                'quantity', 1, 'size', 'UK 9', 'color', 'Default', 'image', prod3.image
            )),
            prod3.price,
            'No. 5, MG Road, Erode, TN 638001',
            'Cash on Delivery', 'Shipped',
            jsonb_build_array(
                jsonb_build_object('status', 'Order Placed', 'timestamp', (NOW() - interval '2 days')::text, 'description', 'Order placed successfully'),
                jsonb_build_object('status', 'Processing', 'timestamp', (NOW() - interval '1 day')::text, 'description', 'Being prepared'),
                jsonb_build_object('status', 'Shipped', 'timestamp', NOW()::text, 'description', 'Handed to courier')
            ),
            NOW() - interval '2 days', false
        );
    END IF;

    RAISE NOTICE '✅ Orders seeded: %, %, %', order_id1, order_id2, order_id3;
END $$;


-- =====================================================
-- 3. REVIEWS (References orders via orderid FK)
-- =====================================================
DO $$
DECLARE
    prod RECORD;
    user_rec RECORD;
    user_email TEXT;
    first_order_id TEXT;
    comments TEXT[] := ARRAY[
        'Excellent quality! Premium material and top-notch stitching. Highly recommend.',
        'Great value for money. Comfortable fit and stylish. Would buy again.',
        'Perfect fit, ordered my usual size. Comfortable right out of the box.',
        'Good product, fast delivery. Decent quality for the price.',
        'Stylish and comfortable. Gets compliments every time I wear it.',
        'Decent purchase. Not bad for the price. Good for casual use.',
        'Absolutely love it! Premium quality, amazing comfort, on point style.',
        'Solid everyday wear. A month in and still looks brand new.',
        'Cushioning is excellent for long walks. One of my best purchases.',
        'Fast shipping and great packaging. Product matched the photos exactly.',
        'Bought as a gift and recipient loved it. Will order more.',
        'Impressed with build quality at this price range. Worth every rupee.'
    ];
    ratings INT[] := ARRAY[5, 4, 5, 4, 5, 3, 5, 4, 5, 4, 5, 4];
    i INTEGER := 1;
BEGIN
    SELECT id, email INTO user_rec FROM auth.users LIMIT 1;
    IF user_rec IS NULL THEN
        RAISE NOTICE '⚠️ No users. Skipping reviews.';
        RETURN;
    END IF;
    user_email := user_rec.email;

    -- Get the first order to use as FK reference
    SELECT id INTO first_order_id FROM orders WHERE user_id = user_rec.id ORDER BY createdat DESC LIMIT 1;
    IF first_order_id IS NULL THEN
        RAISE NOTICE '⚠️ No orders found. Skipping reviews.';
        RETURN;
    END IF;

    FOR prod IN SELECT id FROM products WHERE isdeleted = false ORDER BY id
    LOOP
        -- Review 1
        INSERT INTO reviews (orderid, productid, user_id, useremail, rating, comment, images, helpful, createdat, updatedat)
        VALUES (
            first_order_id, prod.id, user_rec.id, user_email,
            ratings[i], comments[i], '[]'::jsonb,
            floor(random() * 15)::int,
            NOW() - (random() * interval '30 days'), NOW()
        )
        ON CONFLICT DO NOTHING;

        i := i + 1;
        IF i > array_length(comments, 1) THEN i := 1; END IF;

        -- Review 2
        INSERT INTO reviews (orderid, productid, user_id, useremail, rating, comment, images, helpful, createdat, updatedat)
        VALUES (
            first_order_id, prod.id, user_rec.id, user_email,
            ratings[i], comments[i], '[]'::jsonb,
            floor(random() * 10)::int,
            NOW() - (random() * interval '20 days'), NOW()
        )
        ON CONFLICT DO NOTHING;

        i := i + 1;
        IF i > array_length(comments, 1) THEN i := 1; END IF;
    END LOOP;

    RAISE NOTICE '✅ Reviews seeded!';
END $$;

-- Update product review counts
UPDATE products p SET reviews = (SELECT COUNT(*) FROM reviews r WHERE r.productid = p.id);


-- =====================================================
-- 4. SAVED_ITEMS (Wishlist)
-- =====================================================
DO $$
DECLARE
    user_rec RECORD;
    prod RECORD;
BEGIN
    SELECT id, email INTO user_rec FROM auth.users LIMIT 1;
    IF user_rec IS NULL THEN RETURN; END IF;

    FOR prod IN SELECT id, name, price, image, category, rating FROM products WHERE isdeleted = false LIMIT 2 OFFSET 3
    LOOP
        INSERT INTO saved_items (user_id, useremail, productid, productdata)
        VALUES (
            user_rec.id, user_rec.email, prod.id,
            jsonb_build_object('id', prod.id, 'name', prod.name, 'price', prod.price,
                'image', prod.image, 'category', prod.category, 'rating', prod.rating)
        )
        ON CONFLICT (user_id, productid) DO NOTHING;
    END LOOP;
    RAISE NOTICE '✅ Saved items seeded!';
END $$;


-- =====================================================
-- 5. LOGS (Activity History)
-- =====================================================
DO $$
DECLARE
    user_rec RECORD;
BEGIN
    SELECT id INTO user_rec FROM auth.users LIMIT 1;
    IF user_rec IS NULL THEN RETURN; END IF;

    INSERT INTO logs (userid, level, message, metadata, createdat) VALUES
    (user_rec.id, 'info', 'User logged in', '{"source":"google_oauth"}'::jsonb, NOW() - interval '3 days'),
    (user_rec.id, 'info', 'Order placed', '{"total":2499,"items_count":1}'::jsonb, NOW() - interval '2 days'),
    (user_rec.id, 'info', 'Product viewed', '{"page":"/products"}'::jsonb, NOW() - interval '1 day'),
    (user_rec.id, 'info', 'Cart updated', '{"action":"add_item"}'::jsonb, NOW() - interval '12 hours'),
    (user_rec.id, 'info', 'Profile updated', '{"fields":["name","phone"]}'::jsonb, NOW());
    RAISE NOTICE '✅ Logs seeded!';
END $$;


-- =====================================================
-- 6. VERIFY ALL TABLE ROW COUNTS
-- =====================================================
SELECT 'products' as table_name, COUNT(*) as row_count FROM products
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'cart_items', COUNT(*) FROM cart_items
UNION ALL SELECT 'saved_items', COUNT(*) FROM saved_items
UNION ALL SELECT 'reviews', COUNT(*) FROM reviews
UNION ALL SELECT 'returns', COUNT(*) FROM returns
UNION ALL SELECT 'profiles', COUNT(*) FROM profiles
UNION ALL SELECT 'logs', COUNT(*) FROM logs
UNION ALL SELECT 'settings', COUNT(*) FROM settings
ORDER BY table_name;
