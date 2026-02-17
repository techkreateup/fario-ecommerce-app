-- Create RPC function to fetch user's orders (bypasses RLS like place_order_with_stock)
CREATE OR REPLACE FUNCTION get_my_orders(p_user_id uuid)
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
        o.id,
        o.useremail,
        o.items,
        o.total,
        o.status,
        o.shippingaddress,
        o.shippingmethod,
        o.paymentmethod,
        o.timeline,
        o.rating,
        o.reviewtext,
        o.isarchived,
        o.createdat,
        o.updatedat,
        o.user_id
    FROM orders o
    WHERE o.user_id = p_user_id
    ORDER BY o.createdat DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_my_orders(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_my_orders(uuid) TO anon;
