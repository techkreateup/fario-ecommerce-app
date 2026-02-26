
import { createClient } from '@supabase/supabase-js';

// Hardcoded creds from .env (to simulate build env)
const SUPABASE_URL = 'https://csyiiksxpmbehiiovlbg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeWlpa3N4cG1iZWhpaW92bGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNTE1MDgsImV4cCI6MjA4NjYyNzUwOH0.A1i9vqFwd_BsMwtod_uFyR-yJhHGW2Vu7PmacxGT6m4';

console.log('🚀 Client Simulation: Initializing Supabase Client...');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function runTest() {
    try {
        console.log('📡 Fetching coupons...');

        // Timeout promise
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('TIMEOUT: Request took >5s')), 5000)
        );

        // Fetch promise
        const fetchPromise = supabase
            .from('coupons')
            .select('*')
            .limit(5);

        const { data, error } = await Promise.race([fetchPromise, timeout]);

        if (error) {
            console.error('❌ Supabase Error:', error);
        } else {
            console.log(`✅ Success! Fetched ${data.length} coupons.`);
            data.forEach(c => console.log(`   - ${c.code}`));
        }

    } catch (err) {
        console.error('🔥 Runtime Error:', err.message);
    }
}

runTest();
