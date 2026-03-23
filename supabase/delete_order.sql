CREATE OR REPLACE FUNCTION delete_my_order(p_order_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete child dependencies first if missing ON DELETE CASCADE
    DELETE FROM returns WHERE order_id = p_order_id;
    DELETE FROM order_reviews WHERE order_id = p_order_id;
    
    -- Finally delete the order
    DELETE FROM orders WHERE id = p_order_id AND user_id = auth.uid();
    
    RETURN found;
END;
$$;
