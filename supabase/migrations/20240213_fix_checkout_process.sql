-- Migration: Fix Checkout Process (Schema-Aligned RPC)
-- Date: 2024-02-13
-- Fixed to match actual orders table schema

-- Drop the old function first
DROP FUNCTION IF EXISTS place_order_with_stock(uuid,jsonb,numeric,text,text);

CREATE OR REPLACE FUNCTION place_order_with_stock(
  p_user_id UUID,
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
  new_order_id TEXT;
  v_item JSONB;
  v_product_id TEXT;
  v_quantity INT;
  v_stock INT;
  v_useremail TEXT;
BEGIN
  -- Get user email for the order record
  SELECT email INTO v_useremail FROM auth.users WHERE id = p_user_id;
  
  -- Generate order ID
  new_order_id := 'FR-' || floor(random() * 900000 + 100000)::TEXT;
  
  -- Step 1: Validate stock for all items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := v_item->>'id';
    v_quantity := (v_item->>'quantity')::INT;
    
    SELECT stockquantity INTO v_stock 
    FROM products 
    WHERE id = v_product_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product % not found', v_product_id;
    END IF;
    
    IF v_stock < v_quantity THEN
      RAISE EXCEPTION 'Insufficient stock for product %', v_product_id;
    END IF;
  END LOOP;
  
  -- Step 2: Deduct stock
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := v_item->>'id';
    v_quantity := (v_item->>'quantity')::INT;
    
    UPDATE products 
    SET stockquantity = stockquantity - v_quantity
    WHERE id = v_product_id;
  END LOOP;
  
  -- Step 3: Create order (using actual column names from schema)
  INSERT INTO orders (
    id,
    user_id,
    useremail,
    items,
    total,
    status,
    shippingaddress,
    paymentmethod,
    createdat,
    timeline,
    isarchived
  ) VALUES (
    new_order_id,
    p_user_id,
    COALESCE(v_useremail, 'unknown@email.com'),
    p_items,
    p_total,
    'Processing',
    p_shipping_address,
    p_payment_method,
    NOW(),
    jsonb_build_array(
      jsonb_build_object(
        'status', 'Processing',
        'time', NOW()::TEXT,
        'message', 'Order placed successfully'
      )
    ),
    false
  );
  
  -- Return success with order ID
  RETURN jsonb_build_object(
    'success', true,
    'order_id', new_order_id,
    'message', 'Order placed successfully'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in place_order_with_stock: %', SQLERRM;
    RAISE;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION place_order_with_stock(uuid,jsonb,numeric,text,text) TO authenticated;
