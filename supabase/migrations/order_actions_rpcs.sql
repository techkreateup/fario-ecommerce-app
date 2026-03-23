-- Order Actions RPC Functions
-- Following the successful pattern from place_order_with_stock
-- All functions use SECURITY DEFINER to bypass RLS and auth issues

-- ============================================================================
-- 1. ARCHIVE ORDER - Set isarchived = true, hide from user view
-- ============================================================================
CREATE OR REPLACE FUNCTION archive_order(
    p_order_id text,
    p_user_id uuid
)
RETURNS jsonb
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Verify order belongs to user
    IF NOT EXISTS (
        SELECT 1 FROM orders 
        WHERE id = p_order_id AND user_id = p_user_id
    ) THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Order not found or access denied'
        );
    END IF;

    -- Archive the order
    UPDATE orders
    SET 
        isarchived = true,
        updatedat = NOW()
    WHERE id = p_order_id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Order archived successfully'
    );
END;
$$;

-- ============================================================================
-- 2. ADD ORDER REVIEW - Save rating and review text
-- ============================================================================
CREATE OR REPLACE FUNCTION add_order_review(
    p_order_id text,
    p_user_id uuid,
    p_rating integer,
    p_review_text text
)
RETURNS jsonb
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Verify order belongs to user
    IF NOT EXISTS (
        SELECT 1 FROM orders 
        WHERE id = p_order_id AND user_id = p_user_id
    ) THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Order not found or access denied'
        );
    END IF;

    -- Validate rating (1-5)
    IF p_rating < 1 OR p_rating > 5 THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Rating must be between 1 and 5'
        );
    END IF;

    -- Save review
    UPDATE orders
    SET 
        rating = p_rating,
        reviewtext = p_review_text,
        updatedat = NOW()
    WHERE id = p_order_id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Review added successfully',
        'rating', p_rating
    );
END;
$$;

-- ============================================================================
-- 3. UPDATE ORDER TIMELINE - Add tracking events (Admin only in frontend)
-- ============================================================================
CREATE OR REPLACE FUNCTION update_order_timeline(
    p_order_id text,
    p_status text,
    p_message text
)
RETURNS jsonb
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_timeline jsonb;
    v_new_event jsonb;
    v_updated_timeline jsonb;
BEGIN
    -- Fetch current timeline
    SELECT timeline INTO v_current_timeline
    FROM orders
    WHERE id = p_order_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Order not found'
        );
    END IF;

    -- Create new timeline event
    v_new_event := jsonb_build_object(
        'status', p_status,
        'time', NOW(),
        'message', p_message
    );

    -- Append to existing timeline (or create new array if null)
    IF v_current_timeline IS NULL THEN
        v_updated_timeline := jsonb_build_array(v_new_event);
    ELSE
        v_updated_timeline := v_current_timeline || v_new_event;
    END IF;

    -- Update order
    UPDATE orders
    SET 
        status = p_status,
        timeline = v_updated_timeline,
        updatedat = NOW()
    WHERE id = p_order_id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Timeline updated successfully',
        'timeline', v_updated_timeline
    );
END;
$$;

-- ============================================================================
-- 4. CREATE RETURN REQUEST - Store return request in orders or separate table
-- ============================================================================
-- First, let's check if we need a returns table or can store in orders
-- For now, we'll add return info to the order itself in a returns_info column
-- If returns table exists, we'll use that instead

-- Option A: Store in orders table (simpler)
-- Add a returns_info jsonb column to orders if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'returns_info'
    ) THEN
        ALTER TABLE orders ADD COLUMN returns_info jsonb;
    END IF;
END $$;

CREATE OR REPLACE FUNCTION create_return_request(
    p_order_id text,
    p_user_id uuid,
    p_items jsonb,
    p_reason text
)
RETURNS jsonb
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
    v_return_id text;
BEGIN
    -- Verify order belongs to user
    IF NOT EXISTS (
        SELECT 1 FROM orders 
        WHERE id = p_order_id AND user_id = p_user_id
    ) THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Order not found or access denied'
        );
    END IF;

    -- Generate return request ID
    v_return_id := 'RET-' || LPAD(floor(random() * 999999)::text, 6, '0');

    -- Create return request object
    UPDATE orders
    SET 
        returns_info = jsonb_build_object(
            'return_id', v_return_id,
            'items', p_items,
            'reason', p_reason,
            'status', 'Pending',
            'requested_at', NOW()
        ),
        updatedat = NOW()
    WHERE id = p_order_id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Return request created successfully',
        'return_id', v_return_id
    );
END;
$$;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================
GRANT EXECUTE ON FUNCTION archive_order(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION archive_order(text, uuid) TO anon;

GRANT EXECUTE ON FUNCTION add_order_review(text, uuid, integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION add_order_review(text, uuid, integer, text) TO anon;

GRANT EXECUTE ON FUNCTION update_order_timeline(text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION update_order_timeline(text, text, text) TO anon;

GRANT EXECUTE ON FUNCTION create_return_request(text, uuid, jsonb, text) TO authenticated;
GRANT EXECUTE ON FUNCTION create_return_request(text, uuid, jsonb, text) TO anon;

-- ============================================================================
-- VERIFICATION QUERIES (Run these to test)
-- ============================================================================
/*
-- Test Archive
SELECT archive_order('FR-219467', 'YOUR_USER_ID'::uuid);

-- Test Review
SELECT add_order_review('FR-219467', 'YOUR_USER_ID'::uuid, 5, 'Great product!');

-- Test Timeline
SELECT update_order_timeline('FR-219467', 'Shipped', 'Package dispatched from warehouse');

-- Test Return
SELECT create_return_request(
    'FR-219467', 
    'YOUR_USER_ID'::uuid,
    '[{"id": "p_v2_001", "reason": "Size issue"}]'::jsonb,
    'Product too small'
);
*/
