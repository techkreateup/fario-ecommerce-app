-- ==========================================
-- FARIO SCHEMA COMPLETION: ANALYTICS & RETURNS
-- ==========================================

-- 1. Analytics: Daily Revenue Aggregation
CREATE OR REPLACE FUNCTION get_admin_analytics_revenue(days_limit INT)
RETURNS TABLE (date DATE, revenue NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        date_trunc('day', createdat)::date as date,
        COALESCE(SUM(total), 0)::NUMERIC as revenue
    FROM orders
    WHERE createdat >= NOW() - (days_limit || ' days')::INTERVAL
    AND status != 'Cancelled'
    GROUP BY 1
    ORDER BY 1 ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Analytics: Category Performance
CREATE OR REPLACE FUNCTION get_category_performance()
RETURNS TABLE (category TEXT, revenue NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.category,
        SUM( (item->>'price')::NUMERIC * (item->>'quantity')::INT )::NUMERIC as revenue
    FROM orders o,
    jsonb_array_elements(o.items) item
    JOIN products p ON p.id = item->>'product_id'
    WHERE o.status != 'Cancelled'
    GROUP BY p.category
    ORDER BY revenue DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Analytics: Top Selling Products
CREATE OR REPLACE FUNCTION get_top_selling_products(limit_count INT)
RETURNS TABLE (product_id TEXT, name TEXT, total_sold INT, revenue NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        item->>'product_id' as product_id,
        p.name,
        SUM((item->>'quantity')::INT)::INT as total_sold,
        SUM((item->>'price')::NUMERIC * (item->>'quantity')::INT)::NUMERIC as revenue
    FROM orders o,
    jsonb_array_elements(o.items) item
    JOIN products p ON p.id = item->>'product_id'
    WHERE o.status != 'Cancelled'
    GROUP BY 1, 2
    ORDER BY total_sold DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Admin Dashboard Stats (Enhanced with Trends)
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS JSON AS $$
DECLARE
    total_rev NUMERIC;
    prev_rev NUMERIC;
    total_ords INT;
    total_custs INT;
    rev_trend NUMERIC;
BEGIN
    -- Current Total Revenue
    SELECT COALESCE(SUM(total), 0) INTO total_rev FROM orders WHERE status != 'Cancelled';
    
    -- Previous 30-day revenue for trend calculation
    SELECT COALESCE(SUM(total), 0) INTO prev_rev 
    FROM orders 
    WHERE status != 'Cancelled' 
    AND createdat >= NOW() - INTERVAL '60 days' 
    AND createdat < NOW() - INTERVAL '30 days';

    IF prev_rev > 0 THEN
        rev_trend := ((total_rev - prev_rev) / prev_rev) * 100;
    ELSE
        rev_trend := 0;
    END IF;

    SELECT COUNT(*) INTO total_ords FROM orders;
    SELECT COUNT(*) INTO total_custs FROM profiles;

    RETURN json_build_object(
        'total_revenue', total_rev,
        'total_orders', total_ords,
        'total_customers', total_custs,
        'revenue_trend', rev_trend
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Return Processing: Refund Execute
CREATE OR REPLACE FUNCTION process_return_refund(return_id UUID)
RETURNS VOID AS $$
DECLARE
    v_user_id UUID;
    v_amount NUMERIC;
    v_method TEXT;
    v_status TEXT;
BEGIN
    -- Use double quotes for potentially CamelCase columns from JSON imports
    SELECT 
        user_id, 
        COALESCE("refundAmount", "refundamount", 0), 
        method, 
        status 
    INTO v_user_id, v_amount, v_method, v_status
    FROM returns
    WHERE id = return_id;

    IF v_status IS NULL THEN
        RAISE EXCEPTION 'Return ID % not found', return_id;
    END IF;

    IF v_status != 'approved' THEN
        RAISE EXCEPTION 'Return request status is %, must be approved for refund.', v_status;
    END IF;

    -- Credit wallet if method is 'credit'
    IF v_method = 'credit' THEN
        UPDATE profiles 
        SET wallet_balance = COALESCE(wallet_balance, 0) + v_amount
        WHERE id = v_user_id;

        INSERT INTO logs (userid, level, message, metadata)
        VALUES (v_user_id, 'info', 'Return Refund issued to wallet', jsonb_build_object('return_id', return_id, 'amount', v_amount));
    END IF;

    -- Update return status to 'refunded'
    UPDATE returns 
    SET status = 'refunded',
        decided_at = NOW()
    WHERE id = return_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
