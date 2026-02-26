import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://csyiiksxpmbehiiovlbg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeWlpa3N4cG1iZWhpaW92bGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNTE1MDgsImV4cCI6MjA4NjYyNzUwOH0.A1i9vqFwd_BsMwtod_uFyR-yJhHGW2Vu7PmacxGT6m4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runAudit() {
    console.log("=========================================");
    console.log("🚀 FARIO QUICK SUPABASE HEALTH CHECK");
    console.log("=========================================\n");

    try {
        // --- 1. TEST ORPHANS ---
        console.log("➡️ CHECKING FOR ORPHANS...");
        const { data: orphans, error: orphanErr } = await supabase
            .from('cart_items')
            .select('*, products(id)')

        if (orphanErr) {
            console.log("❌ Failed to query cart_items. Check RLS or schema.", orphanErr);
        } else {
            const trueOrphans = orphans.filter(o => !o.products || o.products.id === null);
            console.log(`✅ Orphaned Cart Items Found: ${trueOrphans.length}`);
        }

        // --- 2. NEGATIVE VALUES CHECK ---
        console.log("\n➡️ CHECKING NEGATIVE VALUES...");
        const { data: negStock, error: stockErr } = await supabase.from('products').select('id, name, stock').lt('stock', 0);
        if (stockErr) console.log("❌ Failed to query stock info.", stockErr.message);
        else console.log(`✅ Products with Negative Stock: ${negStock.length}`);

        const { data: negPrice, error: priceErr } = await supabase.from('products').select('id, name, price').lt('price', 0);
        if (priceErr) console.log("❌ Failed to query price info.", priceErr.message);
        else console.log(`✅ Products with Negative Price: ${negPrice.length}`);

        // --- 3. TEST RLS + CRUD via DUMMY ACCOUNTS ---
        console.log("\n➡️ TESTING RLS & DATA ISOLATION...");
        const emailA = `test_a_${Date.now()}@fario.com`;
        const emailB = `test_b_${Date.now()}@fario.com`;

        // Register A
        const { data: userA, error: errA } = await supabase.auth.signUp({ email: emailA, password: 'Password123!' });
        console.log(`👤 User A registered: ${!errA ? 'SUCCESS' : errA.message}`);

        let testProduct = null;
        const { data: products } = await supabase.from('products').select('id, stock, price').limit(1);
        testProduct = products && products.length > 0 ? products[0] : null;

        if (!testProduct) {
            console.log("❌ No products available to test cart logic!");
            return;
        }

        // User A adds item to cart
        if (!errA) {
            const { error: cartInsertErr } = await supabase.from('cart_items').insert({
                user_id: userA.user.id,
                product_id: testProduct.id,
                quantity: 1
            });
            console.log(`🛒 User A Add To Cart: ${!cartInsertErr ? 'SUCCESS' : cartInsertErr.message}`);
        }

        // Logout User A, Login User B
        await supabase.auth.signOut();
        const { data: userB, error: errB } = await supabase.auth.signUp({ email: emailB, password: 'Password123!' });
        console.log(`👤 User B registered: ${!errB ? 'SUCCESS' : errB.message}`);

        // User B tries to read User A's cart
        if (!errB) {
            const { data: bViewsCart, error: bViewErr } = await supabase.from('cart_items').select('*').eq('user_id', userA.user.id);
            console.log(`🚫 User B Reading User A's Cart count: ${bViewsCart ? bViewsCart.length : 0} (Should be 0)`);
            if (bViewsCart && bViewsCart.length > 0) {
                console.log("❌ RLS FAILURE! User B can see User A's data!");
            } else {
                console.log("✅ RLS SUCCESS! User A's data isolated.");
            }
        }

        console.log("\n=========================================");
        console.log("🏁 AUDIT SCRIPT COMPLETE");
        console.log("=========================================");

    } catch (err) {
        console.error("Critical script failure:", err);
    }
}

runAudit();
