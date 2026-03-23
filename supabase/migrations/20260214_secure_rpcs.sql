-- Migration: Secure RPCs (Remove IDOR & Enforce Auth)
-- Date: 2026-02-14
-- Description: Replaces functions that accepted p_user_id with auth.uid()

-- ============================================================================
-- 1. SECURE PLACE ORDER (Was place_order_with_stock(uuid, ...))
-- ============================================================================
DROP FUNCTION IF EXISTS place_order_with_stock(uuid,jsonb,numeric,text,text);

CREATE OR REPLACE FUNCTION place_order_with_stock(
  p_items JSONB,
  p_total NUMERIC,
  p_shipping_address TEXT,
  p_payment_method TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  new_order_id TEXT;
  v_item JSONB;
  v_product_id TEXT;
  v_quantity INT;
  v_stock INT;
  v_useremail TEXT;
BEGIN
  -- 1. Get User ID securely from the session token
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get user email for the order record
  SELECT email INTO v_useremail FROM auth.users WHERE id = v_user_id;
  
  -- Generate order ID
  new_order_id := 'FR-' || floor(random() * 900000 + 100000)::TEXT;
  
  -- Step 1: Validate stock
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := v_item->>'id';
    v_quantity := (v_item->>'quantity')::INT;
    
    SELECT stockquantity INTO v_stock FROM products WHERE id = v_product_id;
    
    IF NOT FOUND THEN RAISE EXCEPTION 'Product % not found', v_product_id; END IF;
    IF v_stock < v_quantity THEN RAISE EXCEPTION 'Insufficient stock for product %', v_product_id; END IF;
  END LOOP;
  
  -- Step 2: Deduct stock
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := v_item->>'id';
    v_quantity := (v_item->>'quantity')::INT;
    UPDATE products SET stockquantity = stockquantity - v_quantity WHERE id = v_product_id;
  END LOOP;
  
  -- Step 3: Create order
  INSERT INTO orders (
    id, user_id, useremail, items, total, status, shippingaddress, paymentmethod, createdat, timeline, isarchived
  ) VALUES (
    new_order_id,
    v_user_id,
    COALESCE(v_useremail, 'unknown@email.com'),
    p_items,
    p_total,
    'Processing',
    p_shipping_address,
    p_payment_method,
    NOW(),
    jsonb_build_array(jsonb_build_object('status', 'Processing', 'time', NOW(), 'message', 'Order placed successfully')),
    false
  );
  
  RETURN jsonb_build_object('success', true, 'order_id', new_order_id, 'message', 'Order placed successfully');
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in place_order_with_stock: %', SQLERRM;
    RAISE;
END;
$$;

-- ============================================================================
-- 2. SECURE GET MY ORDERS (Was get_my_orders(uuid))
-- ============================================================================
DROP FUNCTION IF EXISTS get_my_orders(uuid);

CREATE OR REPLACE FUNCTION get_my_orders()
RETURNS TABLE (
    id text,
    useremail text,
    items jsonb,
    total numeric,
    status text,
    shippingaddress text,
    shippingmethod text,
    paymentmethod text,
    timeline jsonb,
    rating integer,
    reviewtext text,
    isarchived boolean,
    createdat timestamptz,
    updatedat timestamptz,
    user_id uuid
)
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id, o.useremail, o.items, o.total, o.status, o.shippingaddress, o.shippingmethod, 
        o.paymentmethod, o.timeline, o.rating, o.reviewtext, o.isarchived, o.createdat, o.updatedat, o.user_id
    FROM orders o
    WHERE o.user_id = auth.uid() -- Secure check
    ORDER BY o.createdat DESC;
END;
$$;

-- ============================================================================
-- 3. SECURE ARCHIVE ORDER
-- ============================================================================
DROP FUNCTION IF EXISTS archive_order(text, uuid);

CREATE OR REPLACE FUNCTION archive_order(p_order_id text)
RETURNS jsonb
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Secure Check
    IF NOT EXISTS (SELECT 1 FROM orders WHERE id = p_order_id AND user_id = auth.uid()) THEN
        RETURN jsonb_build_object('success', false, 'message', 'Order not found or access denied');
    END IF;

    UPDATE orders SET isarchived = true, updatedat = NOW() WHERE id = p_order_id;

    RETURN jsonb_build_object('success', true, 'message', 'Order archived successfully');
END;
$$;

-- ============================================================================
-- 4. SECURE ADD REVIEW
-- ============================================================================
DROP FUNCTION IF EXISTS add_order_review(text, uuid, integer, text);

CREATE OR REPLACE FUNCTION add_order_review(p_order_id text, p_rating integer, p_review_text text)
RETURNS jsonb
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM orders WHERE id = p_order_id AND user_id = auth.uid()) THEN
        RETURN jsonb_build_object('success', false, 'message', 'Order not found or access denied');
    END IF;

    IF p_rating < 1 OR p_rating > 5 THEN
        RETURN jsonb_build_object('success', false, 'message', 'Rating must be between 1 and 5');
    END IF;

    UPDATE orders SET rating = p_rating, reviewtext = p_review_text, updatedat = NOW() WHERE id = p_order_id;
    RETURN jsonb_build_object('success', true, 'message', 'Review added successfully');
END;
$$;

-- ============================================================================
-- 5. SECURE CREATE RETURN
-- ============================================================================
DROP FUNCTION IF EXISTS create_return_request(text, uuid, jsonb, text);

CREATE OR REPLACE FUNCTION create_return_request(p_order_id text, p_items jsonb, p_reason text)
RETURNS jsonb
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
    v_return_id text;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM orders WHERE id = p_order_id AND user_id = auth.uid()) THEN
        RETURN jsonb_build_object('success', false, 'message', 'Order not found or access denied');
    END IF;

    v_return_id := 'RET-' || LPAD(floor(random() * 999999)::text, 6, '0');

    UPDATE orders
    SET returns_info = jsonb_build_object('return_id', v_return_id, 'items', p_items, 'reason', p_reason, 'status', 'Pending', 'requested_at', NOW()),
        updatedat = NOW()
    WHERE id = p_order_id;

    RETURN jsonb_build_object('success', true, 'message', 'Return request created successfully', 'return_id', v_return_id);
END;
$$;

-- ============================================================================
-- 6. SECURE UPDATE TIMELINE (ADMIN ONLY)
--    Previously update_order_timeline(text, text, text) - Signature unchanged but logic added
-- ============================================================================
CREATE OR REPLACE FUNCTION update_order_timeline(p_order_id text, p_status text, p_message text)
RETURNS jsonb
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_timeline jsonb;
    v_new_event jsonb;
    v_updated_timeline jsonb;
    v_caller_email text;
    v_caller_role text;
BEGIN
    -- 1. ADMIN CHECK
    SELECT email INTO v_caller_email FROM auth.users WHERE id = auth.uid();
    
    -- Check for explicit admin role or specific email
    SELECT role INTO v_caller_role FROM profiles WHERE id = auth.uid();

    IF v_caller_email != 'reachkreateup@gmail.com' AND (v_caller_role IS NULL OR v_caller_role != 'admin') THEN
       RETURN jsonb_build_object('success', false, 'message', 'Access Denied: Admins Only');
    END IF;

    -- 2. Fetch current timeline
    SELECT timeline INTO v_current_timeline FROM orders WHERE id = p_order_id;
    IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'message', 'Order not found'); END IF;

    -- 3. Update Timeline
    v_new_event := jsonb_build_object('status', p_status, 'time', NOW(), 'message', p_message);
    
    IF v_current_timeline IS NULL THEN
        v_updated_timeline := jsonb_build_array(v_new_event);
    ELSE
        v_updated_timeline := v_current_timeline || v_new_event;
    END IF;

    UPDATE orders SET status = p_status, timeline = v_updated_timeline, updatedat = NOW() WHERE id = p_order_id;

    RETURN jsonb_build_object('success', true, 'message', 'Timeline updated successfully', 'timeline', v_updated_timeline);
END;
$$;

-- GRANT EXECUTE
GRANT EXECUTE ON FUNCTION place_order_with_stock(jsonb,numeric,text,text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_my_orders() TO authenticated;
GRANT EXECUTE ON FUNCTION archive_order(text) TO authenticated;
GRANT EXECUTE ON FUNCTION add_order_review(text, integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION create_return_request(text, jsonb, text) TO authenticated;
GRANT EXECUTE ON FUNCTION update_order_timeline(text, text, text) TO authenticated;
