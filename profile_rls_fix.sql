-- profile_rls_fix.sql

-- 1. Ensure addresses column exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS addresses JSONB DEFAULT '[]'::jsonb;

-- 2. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- 4. Create Strict Policies
-- SELECT: Users can see their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- UPDATE: Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- INSERT: handled by triggers usually, but if client inserts:
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Admin Policy (Optional, for dashboard access)
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR ALL 
USING (auth.jwt() ->> 'email' = 'reachkreateup@gmail.com');

-- 5. Force update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
