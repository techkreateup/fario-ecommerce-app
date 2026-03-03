-- =====================================================
-- FARIO: Create saved_items table for Wishlist feature
-- Run this in Supabase Dashboard → SQL Editor
-- =====================================================

CREATE TABLE IF NOT EXISTS public.saved_items (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    productid   TEXT NOT NULL,
    productdata JSONB NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, productid)
);

-- Enable Row Level Security
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see their own saved items
CREATE POLICY "Users can view own saved items"
    ON public.saved_items FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: users can insert their own saved items
CREATE POLICY "Users can insert own saved items"
    ON public.saved_items FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: users can delete their own saved items
CREATE POLICY "Users can delete own saved items"
    ON public.saved_items FOR DELETE
    USING (auth.uid() = user_id);

-- Realtime is already enabled globally (FOR ALL TABLES) — no extra step needed.

-- Index for fast user-based lookups
CREATE INDEX IF NOT EXISTS idx_saved_items_user_id ON public.saved_items(user_id);
