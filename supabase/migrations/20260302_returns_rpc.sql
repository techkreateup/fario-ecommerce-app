-- Recreate or update the RPC for processing returns
CREATE OR REPLACE FUNCTION process_return_refund(return_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_return RECORD;
    v_order RECORD;
    v_user_email TEXT;
BEGIN
    -- 1. Get the return details
    SELECT * INTO v_return FROM returns WHERE id = return_id FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Return request not found';
    END IF;

    IF v_return.status = 'refunded' THEN
        RAISE EXCEPTION 'Return refund has already been processed';
    END IF;

    -- 2. Validate linked order
    SELECT * INTO v_order FROM orders WHERE id = v_return.orderid;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Associated order not found';
    END IF;

    v_user_email := v_order.useremail;

    -- 3. Process the refund method
    IF v_return.method = 'credit' THEN
        -- Add to Fario Wallet Balance
        UPDATE profiles
        SET wallet_balance = COALESCE(wallet_balance, 0) + v_return.refundamount,
            updated_at = NOW()
        WHERE email = v_user_email;
    END IF;
    -- If 'refund' (Card/Original), assumption is payment gateway handles it out-of-band for now.

    -- 4. Mark the return as completed/refunded
    UPDATE returns
    SET status = 'refunded',
        decided_at = NOW()
    WHERE id = return_id;

    RETURN jsonb_build_object('success', true, 'message', 'Refund processed successfully');
END;
$$;
