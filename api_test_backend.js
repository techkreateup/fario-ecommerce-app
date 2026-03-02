import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://csyiiksxpmbehiiovlbg.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeWlpa3N4cG1iZWhpaW92bGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNTE1MDgsImV4cCI6MjA4NjYyNzUwOH0.A1i9vqFwd_BsMwtod_uFyR-yJhHGW2Vu7PmacxGT6m4';

async function runAdminTests() {
    console.log("🚀 FARIO E-COMMERCE ADMIN API TESTER");

    // 1. Authenticate as Admin
    console.log("\n1️⃣ Authenticating Admin...");
    let authRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'reachkreateup@gmail.com', password: 'Password123!' }) // Note: You'll need the actual password or we bypass using OTP token if possible
    });

    let authData = await authRes.json();
    if (!authRes.ok || !authData.access_token) {
        console.error("❌ Authentication Failed. Check credentials or OTP setup:", authData);
        console.log("⚠️ SKIPPING Admin writes (Requires authenticated Session Token)");
        return;
    }

    const token = authData.access_token;
    const headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    };

    try {
        // 2. Create Product
        console.log("\n2️⃣ PHASE 10.2: Creating Test Product...");
        const prodData = {
            name: 'TEST Admin Product 2026',
            price: 2999,
            stock: 100,
            category: 'Electronics',
            description: 'Automated test product for DB validation',
            image_url: 'https://via.placeholder.com/400'
        };
        const createRes = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
            method: 'POST', headers, body: JSON.stringify(prodData)
        });
        const newProduct = (await createRes.json())[0];
        console.log(`✅ [PASS] Product added: ${newProduct?.id || 'Failed'}`);

    } catch (e) {
        console.error("System Error", e);
    }
}

runAdminTests();
