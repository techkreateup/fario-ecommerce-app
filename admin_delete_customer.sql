-- Enhanced SQL Script to enable Admins to delete customers forcefully
-- Run this in your Supabase SQL Editor

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

    -- 2. DANGEROUS OPERATIONS: Forcefully delete dependent records first
    -- This handles tables that might NOT have built-in ON DELETE CASCADE
    
    -- Delete Orders (and potentially order items if ON DELETE CASCADE is missing)
    -- If there's an order_items table related to orders, this might still fail unless 
    -- we do a more complex cascading delete here, but standard Supabase setups often cascade
    -- from orders to order_items. We'll attempt a direct orders delete.
    DELETE FROM public.orders WHERE user_id = customer_id;
    
    -- Delete Addresses (if they exist)
    DELETE FROM public.addresses WHERE user_id = customer_id;
    
    -- Delete Reviews
    DELETE FROM public.reviews WHERE user_id = customer_id;
    
    -- Delete Returns (if linked directly to user)
    DELETE FROM public.returns WHERE user_id = customer_id;
    
    -- Delete anything else mapped directly to user_id that usually blocks deletion
    DELETE FROM public.wishlist WHERE user_id = customer_id;
    DELETE FROM public.saved_items WHERE user_id = customer_id;

    -- 3. Delete the user from public.profiles manually
    DELETE FROM public.profiles WHERE id = customer_id;

    -- 4. Finally, delete the identity from auth.users (Supabase's core auth system)
    DELETE FROM auth.users WHERE id = customer_id;

    RETURN TRUE;
END;
$$;

-- Grant execution to authenticated users (The function checks admin status inside)
GRANT EXECUTE ON FUNCTION public.delete_customer_by_admin(UUID) TO authenticated;
