-- =====================================================
-- Migration: Enable Supabase Realtime on ALL Tables
-- Date: 2026-02-14 (Updated)
-- =====================================================
-- Supabase Realtime requires tables to be added to the
-- `supabase_realtime` publication. Without this, 
-- postgres_changes subscriptions will NOT fire.

-- Step 1: Drop existing publication (if any) and recreate
-- This is idempotent - safe to run multiple times.
DROP PUBLICATION IF EXISTS supabase_realtime;

CREATE PUBLICATION supabase_realtime FOR TABLE
  public.products,
  public.orders,
  public.cart_items,
  public.saved_items,
  public.reviews,
  public.returns,
  public.profiles,
  public.logs,
  public.settings;

-- Step 2: Enable REPLICA IDENTITY FULL for proper DELETE payloads
-- Without this, DELETE events only contain the primary key, not the full row.
ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.cart_items REPLICA IDENTITY FULL;
ALTER TABLE public.saved_items REPLICA IDENTITY FULL;
ALTER TABLE public.reviews REPLICA IDENTITY FULL;
ALTER TABLE public.returns REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.logs REPLICA IDENTITY FULL;
ALTER TABLE public.settings REPLICA IDENTITY FULL;

-- =====================================================
-- REALTIME CHANNELS REFERENCE (Frontend Subscriptions)
-- =====================================================
-- 
-- CHANNEL                    | TABLE        | EVENTS              | LOCATION
-- ─────────────────────────────────────────────────────────────────────────────
-- catalog-changes            | products     | INSERT,UPDATE,DELETE | CartContext.tsx
-- orders-{userId}            | orders       | INSERT,UPDATE,DELETE | CartContext.tsx
-- cart-{userId}              | cart_items   | INSERT,UPDATE,DELETE | CartContext.tsx
-- saved-{userId}             | saved_items  | INSERT,DELETE        | CartContext.tsx
-- wishlist-rt-{userId}       | saved_items  | INSERT,DELETE        | WishlistContext.tsx
-- reviews-{productId}        | reviews      | INSERT               | ProductDetail.tsx
--
-- ALL channels filter by user_id (except catalog-changes which is global).
-- All subscriptions use Supabase Realtime postgres_changes.
