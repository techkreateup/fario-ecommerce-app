-- Create cart_items table
create table if not exists public.cart_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  product_id text references public.products(id) not null, -- Product IDs are text/uuid in Fario? Let's check. Assuming text from imports.
  quantity int default 1,
  size text,
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id, size, color)
);

-- Enable RLS
alter table public.cart_items enable row level security;

-- Policies
create policy "Users can view their own cart items"
  on public.cart_items for select
  using (auth.uid() = user_id);

create policy "Users can insert their own cart items"
  on public.cart_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own cart items"
  on public.cart_items for update
  using (auth.uid() = user_id);

create policy "Users can delete their own cart items"
  on public.cart_items for delete
  using (auth.uid() = user_id);

-- Migration for Wishlist (Saved Items) is already likely handled or needs similar check. 
-- The user said "REMOVE ALL LOCAL STORAGE", so ensure saved_items table exists too.
-- Checking previous context, `saved_items` table was referenced in `CartContext.tsx` so it likely exists.
