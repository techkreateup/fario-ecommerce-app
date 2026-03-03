-- SQL Script to enable Admins to delete customers
-- Run this in your Supabase SQL Editor

-- In Supabase, deleting a user from `public.profiles` does NOT delete them from authentication (`auth.users`).
-- To properly delete a customer from the frontend, we need a Security Definer RPC function
-- that has the privileges to delete from BOTH `public.profiles` and `auth.users`,
-- while ensuring the person calling it is an admin.

CREATE OR REPLACE FUNCTION public.delete_customer_by_admin(customer_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with Postgres superuser privileges
AS $$
DECLARE
    is_admin BOOLEAN;
BEGIN
    -- 1. Verify the caller is an Admin
    SELECT (role = 'admin') INTO is_admin
    FROM public.profiles
    WHERE id = auth.uid();
    
    IF NOT is_admin THEN
        RAISE EXCEPTION 'Unauthorized: Only admins can delete customers';
    END IF;

    -- 2. Delete the user from auth.users (This automatically cascades to public.profiles if setup correctly)
    -- If it doesn't cascade, we delete from profiles manually just in case
    DELETE FROM auth.users WHERE id = customer_id;
    
    -- Manually delete from profiles if ON DELETE CASCADE is missing
    DELETE FROM public.profiles WHERE id = customer_id;

    RETURN TRUE;
END;
$$;

-- Grant execution to authenticated users (The function checks admin status inside)
GRANT EXECUTE ON FUNCTION public.delete_customer_by_admin(UUID) TO authenticated;
