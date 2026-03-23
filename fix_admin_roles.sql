-- Run this script in the Supabase SQL Editor
-- This ensures that your owner accounts have the proper 'admin' role bypass
-- which fixes the "Supabase fetch failed" errors in the Admin Dashboard

UPDATE public.profiles
SET role = 'admin'
WHERE email IN ('reachkreateup@gmail.com', 'kreateuptech@gmail.com');

-- If you want, you can also verify the roles with:
SELECT id, email, role FROM public.profiles WHERE email IN ('reachkreateup@gmail.com', 'kreateuptech@gmail.com');
