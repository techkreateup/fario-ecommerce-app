-- DIRECT TEST OF RPC FUNCTION
-- Run this in Supabase SQL Editor to test if the RPC works

-- First, get your user ID from the auth.users table
SELECT id, email FROM auth.users LIMIT 5;

-- Then replace YOUR_USER_ID below with the actual UUID from above
-- and run this to test the RPC function directly:

SELECT place_order_with_stock(
    'YOUR_USER_ID'::uuid,  -- Replace with actual user UUID
    '[
        {
            "id": "p_v2_001",
            "quantity": 1,
            "name": "Test Shoe",
            "price": 1200,
            "image": "test.jpg",
            "category": "Men",
            "brand": "Test Brand",
            "rating": 4.5,
            "reviews": 10,
            "inStock": true
        }
    ]'::jsonb,
    1200,
    'Test Address, Test City, Test State 123456',
    'COD'
);

-- If you get an error, copy the EXACT error message and send it to me
-- If it returns success, the RPC works and the issue is in the frontend auth
