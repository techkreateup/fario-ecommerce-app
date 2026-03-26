-- ==========================================
-- FARIO - ADMIN ROLE MIGRATION & RLS UPDATE
-- Run this in the Supabase SQL Editor
-- ==========================================

-- 1. Create the ROLE column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user' NOT NULL;
    END IF;
END $$;

-- 2. Validate the role values (optional but recommended)
-- ALTER TABLE public.profiles ADD CONSTRAINT check_valid_role CHECK (role IN ('user', 'admin', 'stock_manager'));

-- 3. Migrate existing admin users (IMPORTANT)
-- Update this to match whichever accounts should have admin access immediately
UPDATE public.profiles 
SET role = 'admin' 
WHERE email IN ('reachkreateup@gmail.com', 'kreateuptech@gmail.com');

-- 4. Ensure RLS on profiles is secure based on new role architecture
-- Users can view their own profile, and Admins can view ALL profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- If you want admins to see all profiles (e.g. for a dashboard list)
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

-- NOTE: All other strictly mapped policies (Orders, Returns, etc.) using `auth.uid() = user_id` 
-- remain 100% secure and untouched as they natively rely on UUID checks.
