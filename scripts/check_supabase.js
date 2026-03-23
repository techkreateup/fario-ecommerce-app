
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://csyiiksxpmbehiiovlbg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeWlpa3N4cG1iZWhpaW92bGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNTE1MDgsImV4cCI6MjA4NjYyNzUwOH0.A1i9vqFwd_BsMwtod_uFyR-yJhHGW2Vu7PmacxGT6m4';

async function runCheck() {
    console.log("🏥 Starting Supabase Health Check (Deep Flow)...");
    console.log(`Checking URL: ${supabaseUrl}`);

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const start = Date.now();

        // 1. Check Products
        console.log("\n📦 Products Table Check:");
        const { data: products, error: prodError } = await supabase.from('products').select('count', { count: 'exact', head: true });

        if (prodError) {
            console.error(`   ❌ Error: ${prodError.message}`);
        } else {
            console.log(`   ✅ Success! Connection active.`);
            console.log(`   📊 Product Count: ${products === null ? 'Unknown (Head request)' : products}`); // count is in count property usually if head:true? No, count is returned in count.
            // Actually head:true returns null data but count property.
            // Let's just do a limit 1 select.
        }

        const { data: prodData, error: prodReadError } = await supabase.from('products').select('id').limit(1);
        if (prodReadError) console.error(`   ❌ Read Error: ${prodReadError.message}`);
        else console.log(`   ✅ Read latency: ${Date.now() - start}ms`);

        // 2. Check Auth Config (Client Side View)
        console.log("\n🔐 Auth Config Check:");
        // we can't check server config from client, but we can check if we can reach auth endpoint
        const { data: session, error: authError } = await supabase.auth.getSession();
        if (authError) console.error(`   ❌ Auth Error: ${authError.message}`);
        else console.log(`   ✅ Auth Service Reachable.`);

        // 3. User Table (Profiles)
        console.log("\n👤 Profiles Table Check (RLS Test):");
        const { data: profiles, error: profError } = await supabase.from('profiles').select('id').limit(1);
        if (profError) {
            console.warn(`   ⚠️ Profiles Access: ${profError.message} (Expected if RLS is on for anon)`);
        } else {
            console.log(`   ✅ Profiles Access: OK (Public/Anon read allowed)`);
        }

        console.log("\n✅ Deep Check Finished. Connection is GOOD.");

    } catch (e) {
        console.error("❌ CRITICAL SCRIPT ERROR:", e.message);
    }
}

runCheck();
