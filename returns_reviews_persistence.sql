-- returns_reviews_persistence.sql

-- 1. Create Returns Table
CREATE TABLE IF NOT EXISTS public.returns (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    order_id TEXT NOT NULL,
    items JSONB NOT NULL,
    reason TEXT,
    method TEXT,
    status TEXT DEFAULT 'Pending',
    refund_amount NUMERIC,
    tracking_number TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    auto_decision BOOLEAN DEFAULT FALSE,
    decision_reason TEXT,
    decided_at TIMESTAMP WITH TIME ZONE
);

-- 2. Create Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    user_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    title TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    status TEXT DEFAULT 'published' -- published, hidden, pending
);

-- 3. Enable RLS
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 4. Returns Policies
CREATE POLICY "Users can insert their own returns" ON public.returns
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own returns" ON public.returns
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins have full access to returns" ON public.returns
    FOR ALL USING (
        auth.jwt() ->> 'email' = 'reachkreateup@gmail.com'
    );

-- 5. Reviews Policies
CREATE POLICY "Anyone can read reviews" ON public.reviews
    FOR SELECT USING (status = 'published');

CREATE POLICY "Users can insert their own reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins have full access to reviews" ON public.reviews
    FOR ALL USING (
        auth.jwt() ->> 'email' = 'reachkreateup@gmail.com'
    );

-- 6. RPC: Process Return Refund (Mock Logic for now)
CREATE OR REPLACE FUNCTION process_return_refund(return_id TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.returns
    SET status = 'Refunded', updated_at = now()
    WHERE id = return_id;

    -- In a real scenario, this would trigger a payment gateway refund or wallet credit
    -- For now, we assume the wallet update happens separately or via another RPC
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
