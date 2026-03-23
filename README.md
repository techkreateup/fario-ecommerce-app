# Fario E-commerce

## 🔐 GitHub Secrets Configuration

For CI/CD deployment to work, add these secrets to your repository:

### How to Add Secrets:

1. Go to: https://github.com/techkreateup/fario-ecommerce-app/settings/secrets/actions
2. Click "New repository secret"
3. Add each of these:

### Required Secrets:

| Secret Name | Where to Get | Description |
|-------------|--------------|-------------|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Settings → API | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → anon/public | Public API key for frontend |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Dashboard → Turnstile | Captcha site key |

### Optional Secrets:

| Secret Name | Where to Get | Description |
|-------------|--------------|-------------|
| `VITE_RAZORPAY_KEY_ID` | Razorpay Dashboard | For payment integration |

### Testing Locally:

Create `.env.local` file with:
```env
VITE_SUPABASE_URL=https://wkvwrqbsxvuwcewfucuk.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
VITE_TURNSTILE_SITE_KEY=0x4AAAAAAAzSL_uzEQRLF-xI
```

⚠️ Never commit `.env.local` to git!
