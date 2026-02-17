# Deployment Guide (Production Ready)

## 1. Environment Variables
Ensure these variables are set in your **Vercel Project Settings**:

```bash
VITE_SUPABASE_URL=https://csyiiksxpmbehiiovlbg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeWlpa3N4cG1iZWhpaW92bGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNTE1MDgsImV4cCI6MjA4NjYyNzUwOH0.A1i9vqFwd_BsMwtod_uFyR-yJhHGW2Vu7PmacxGT6m4
```

> ⚠️ **IMPORTANT**: Do not commit `.env` to GitHub.

## 2. Database Migrations
Before deploying, run these SQL files in the Supabase SQL Editor (in order):

1.  `migrations/20260214_create_cart_table.sql` (Schema)
2.  `migrations/20260214_secure_rpcs.sql` (Security)
3.  `migrations/20260214_performance_indexes.sql` (Performance)

## 3. Build Command
Vercel should automatically detect Vite, but if needed:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 4. Post-Deploy Checks
- Verify **Guest Cart**: Add item -> Refresh page -> Item should persist.
- Verify **Login Merge**: Add guest item -> Login -> Item should be in account.
- Verify **Profile**: Should load faster (thanks to new indexes).
