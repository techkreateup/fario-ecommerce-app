-- Create user_coupons table for real-time spin wheel rewards
CREATE TABLE IF NOT EXISTS user_coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    coupon_code TEXT UNIQUE NOT NULL,
    discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed', 'freebie')),
    discount_value DECIMAL(10, 2) NOT NULL,
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    used_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_user_coupons_user_id ON user_coupons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_coupons_code ON user_coupons(coupon_code);

ALTER TABLE user_coupons ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own coupons
DROP POLICY IF EXISTS "Users can view their own coupons" ON user_coupons;
CREATE POLICY "Users can view their own coupons" ON user_coupons
    FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own coupons (from Spin Wheel)
DROP POLICY IF EXISTS "Users can insert their own coupons" ON user_coupons;
CREATE POLICY "Users can insert their own coupons" ON user_coupons
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own coupons (mark as used during checkout)
DROP POLICY IF EXISTS "Users can update their own coupons" ON user_coupons;
CREATE POLICY "Users can update their own coupons" ON user_coupons
    FOR UPDATE USING (auth.uid() = user_id);

-- Function to safely claim a new coupon
CREATE OR REPLACE FUNCTION claim_spin_coupon(p_code TEXT, p_type TEXT, p_val DECIMAL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_coupon_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Basic protection against spinning multiple times a day (optional/could be enforced here)
    -- For now, allow insert
    INSERT INTO user_coupons (user_id, coupon_code, discount_type, discount_value)
    VALUES (v_user_id, p_code, p_type, p_val)
    RETURNING id INTO v_coupon_id;

    RETURN jsonb_build_object('success', true, 'coupon_id', v_coupon_id);
EXCEPTION WHEN unique_violation THEN
    RETURN jsonb_build_object('success', false, 'error', 'Coupon code already exists');
END;
$$;
