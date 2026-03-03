-- SQL Script to clean up unwanted tables
-- Run this in your Supabase SQL Editor

-- 1. Drop unwanted tables
DROP TABLE IF EXISTS logs CASCADE;
DROP TABLE IF EXISTS saved_items CASCADE;
DROP TABLE IF EXISTS wishlist CASCADE;

-- Note: 'settings' table is kept because it is required for your Admin CMS to work!
-- If you absolutely want to delete it, uncomment the line below:
-- DROP TABLE IF EXISTS settings CASCADE;

-- 2. Create the 'spin_wheel' table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.spin_wheel (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    spin_date TIMESTAMPTZ DEFAULT NOW(),
    reward_type TEXT NOT NULL,
    reward_value TEXT NOT NULL,
    is_claimed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on spin_wheel
ALTER TABLE public.spin_wheel ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own spins
CREATE POLICY "Users can view own spins"
ON public.spin_wheel FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to insert their own spins
CREATE POLICY "Users can insert own spins"
ON public.spin_wheel FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow admins to view all spins
CREATE POLICY "Admins can view all spins"
ON public.spin_wheel FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
