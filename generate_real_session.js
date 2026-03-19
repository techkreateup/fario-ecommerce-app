import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

async function run() {
    let authRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test_real_qa@example.com', password: 'Password123!' })
    });
    let authData = await authRes.json();

    if (!authData.access_token) {
        authRes = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
            method: 'POST',
            headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test_real_qa@example.com', password: 'Password123!' })
        });
        authData = await authRes.json();
    }

    if (authData.access_token) {
        // Force the user to be admin so we can test the admin dashboard
        await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${authData.user.id}`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${authData.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role: 'admin' })
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

        fs.writeFileSync('real_session.json', JSON.stringify({
            key: localStorageKey,
            value: JSON.stringify(sessionToStore)
        }));
        console.log("✅ SESSION GENERATED:", localStorageKey);
    } else {
        console.error("❌ FAILED TO GENERATE SESSION:", authData);
    }
}
run();
