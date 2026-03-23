-- PHASE 4 SCHEMA: Coupons & Wallet

-- 1. Create Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
    code text PRIMARY KEY,
    discount_type text CHECK (discount_type IN ('percentage', 'fixed')),
    value numeric NOT NULL,
    min_order_value numeric DEFAULT 0,
    expires_at timestamptz,
    usage_limit int DEFAULT 0, -- 0 means unlimited
    used_count int DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- 2. Enable RLS on Coupons
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for Coupons
-- Admin can do everything
CREATE POLICY "Admins can manage coupons" ON public.coupons
    FOR ALL USING (
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );

-- Users can read active coupons (or you might want to hide them until entered?)
-- For now, let's allow reading so we can validate codes client-side or via RPC
CREATE POLICY "Users can read coupons" ON public.coupons
    FOR SELECT USING (true);

-- 4. Update Profiles for Wallet & Cards
-- Add wallet_balance if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'wallet_balance') THEN
        ALTER TABLE public.profiles ADD COLUMN wallet_balance numeric DEFAULT 0;
    END IF;
END $$;

-- Add saved_cards if not exists (storing as JSONB for flexibility)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'saved_cards') THEN
        ALTER TABLE public.profiles ADD COLUMN saved_cards jsonb DEFAULT '[]'::jsonb;
    END IF;
END $$;

-- 5. RPC to Apply Coupon (Optional, can be client-side logic + DB check)
-- But let's create a helper to increment usage
CREATE OR REPLACE FUNCTION public.increment_coupon_usage(p_code text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    UPDATE coupons
    SET used_count = used_count + 1
    WHERE code = p_code;
END;
$function$;

-- 6. RPC to Add Money to Wallet
CREATE OR REPLACE FUNCTION public.add_wallet_money(p_amount numeric)
 RETURNS numeric
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_new_balance numeric;
BEGIN
    UPDATE profiles
    SET wallet_balance = COALESCE(wallet_balance, 0) + p_amount,
        updated_at = now()
    WHERE id = auth.uid()
    RETURNING wallet_balance INTO v_new_balance;
    
    RETURN v_new_balance;
END;
$function$;
