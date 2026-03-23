import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const targetEmail = 'reachkreateup@gmail.com';
const targetPassword = 'SecureAdminPassword123!';

async function run() {
    console.log(`🔐 Authenticating Admin email: ${targetEmail}`);

    // 1. Try Login
    let authRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, password: targetPassword })
    });
    let authData = await authRes.json();

    // 2. If Login fails, try Signup
    if (!authData.access_token) {
        console.log("⚠️ Login failed, attempting to Signup instead...");
        authRes = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
            method: 'POST',
            headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: targetEmail, password: targetPassword, data: { name: 'Tech Kreateup', phone: '9999999999' } })
        });
        authData = await authRes.json();
    }

    if (authData.access_token) {
        console.log(`✅ Successfully authenticated! UID: ${authData.user.id}`);

        // 3. Ensure 'admin' role in profiles
        console.log("🛡️ Ensuring 'admin' role in public.profiles...");
        await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${authData.user.id}`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${authData.access_token}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({ role: 'admin', email: targetEmail, name: 'Tech Kreateup' })
        });

        // Sometimes upsert is better if profile doesn't exist yet
        await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${authData.access_token}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify({ id: authData.user.id, role: 'admin', email: targetEmail, name: 'Tech Kreateup', phone: '9999999999' })
        });

        const sessionToStore = {
            access_token: authData.access_token,
            token_type: authData.token_type || 'bearer',
            expires_in: authData.expires_in || 3600,
            expires_at: authData.expires_at || Math.floor(Date.now() / 1000) + 3600,
            refresh_token: authData.refresh_token,
            user: authData.user
        };

        const ref = SUPABASE_URL.split('//')[1].split('.')[0];
        const localStorageKey = `sb-${ref}-auth-token`;

        fs.writeFileSync('admin_session.json', JSON.stringify({
            key: localStorageKey,
            value: JSON.stringify(sessionToStore)
        }));
        console.log(`✅ SESSION COMPILED & SAVED. Ready for injection.`);
    } else {
        console.error("❌ FAILED TO AUTHENTICATE:", authData);
    }
}
run();
