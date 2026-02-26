-- Test if place_order_with_stock function exists and is callable
-- Run this in Supabase SQL Editor to verify the function

SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_schema = 'public' 
AND routine_name = 'place_order_with_stock';

-- If the above returns 0 rows, the function doesn't exist.
-- If it returns 1 row, run this test call:

/*
SELECT place_order_with_stock(
    'REPLACE_WITH_ACTUAL_USER_UUID'::uuid,
    '[{"id": "p_v2_001", "quantity": 1, "name": "Test Product", "price": 100}]'::jsonb,
    100,
    'Test Address, Test City, Test State 123456',
    'COD'
);
*/
