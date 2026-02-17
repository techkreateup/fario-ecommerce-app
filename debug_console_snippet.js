// Copy and paste this into your Browser Console (F12 -> Console)

(async () => {
    console.log("⚡ Starting Supabase fetch test...");

    // 1. Try to import Supabase client (assuming it's available via window or module)
    // If your app exposes the client globally, use that. Otherwise we try to use the module.
    try {
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
        console.log("✅ Supabase JS loaded");

        // REPLACE THESE WITH YOUR ACTUAL SUPABASE URL AND KEY FROM YOUR .env or lib/supabase.ts
        // You can find them in your project or asking the developer
        const SUPABASE_URL = 'https://qiylwsgj.supabase.co'; // Example from your request
        const SUPABASE_KEY = 'YOUR_ANON_KEY_HERE'; // PLEASE FILL THIS IN

        if (SUPABASE_KEY === 'YOUR_ANON_KEY_HERE') {
            console.error("❌ STOP: You need to replace 'YOUR_ANON_KEY_HERE' in the script with your actual key.");
            return;
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

        // Test 1: Basic fetch
        console.log("📡 Fetching products...");
        const { data, error, count } = await supabase
            .from('products')
            .select('*', { count: 'exact' })
            .eq('isdeleted', false)
            .limit(5);

        console.log('📊 DATA:', data);
        console.log('❌ ERROR:', error);
        console.log('🔢 COUNT:', count);

        if (error) {
            console.error("🔥 Query failed. Check RLS or connection.");
        } else if (!data || data.length === 0) {
            console.warn("⚠️ Query succeeded but returned NO data. Possible RLS blocking or empty DB.");
        } else {
            console.log("✅ Success! Found", data.length, "products.");
        }

    } catch (e) {
        console.error("💥 Script execution error:", e);
    }
})();
