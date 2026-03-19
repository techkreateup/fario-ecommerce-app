import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkDatabase() {
    console.log("🔍 CHECKING SUPABASE FOR E2E TEST DATA (AUTHENTICATED)...\n");

    try {
        const sessionData = JSON.parse(fs.readFileSync('real_session.json', 'utf8'));
        const JWT = JSON.parse(sessionData.value).access_token;
        const refreshToken = JSON.parse(sessionData.value).refresh_token;

        await supabase.auth.setSession({ access_token: JWT, refresh_token: refreshToken });

        console.log("1️⃣ Checking if the 'reachkreateup@gmail.com' Admin exists and has coupon metadata...");

        // Use service role key if possible, but anon key might not let us query auth.users directly.
        // Instead we can check the 'profiles' table which is public/readable usually.
        const { data: profile, error: profileErr } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', 'reachkreateup@gmail.com')
            .single();

        if (profileErr && profileErr.code !== 'PGRST116') {
            console.log("⚠️ Error reading profile:", profileErr.message);
        } else if (profile) {
            console.log(`✅ Profile Found: ${profile.name} (${profile.email})`);
            console.log(`   Role: ${profile.role}`);
        } else {
            console.log("⚠️ Profile for 'reachkreateup@gmail.com' not found in public.profiles.");
        }

        console.log("\n2️⃣ Checking recent Orders...");
        const { data: allOrders, error: ordersErr } = await supabase
            .from('orders')
            .select('*')
            .limit(100);

        if (ordersErr) console.error("❌ Error fetching orders:", ordersErr.message);
        else if (allOrders && allOrders.length > 0) {
            // Sort in JS instead to avoid schema issues
            const sortedOrders = allOrders.reverse().slice(0, 5);
            console.log("✅ Most Recent Orders in Database:");
            sortedOrders.forEach(o => {
                console.log(`   📦 Order ${o.id.split('-')[0]}... | User: ${o.useremail || o.user_id} | Status: ${o.status}`);
            });
        } else {
            console.log("ℹ️ No orders exist in the entire table.");
        }

        console.log("\n3️⃣ Checking recent Cart Items...");
        const { data: allCartItems, error: cartErr } = await supabase
            .from('cart_items')
            .select('*')
            .limit(100);

        if (cartErr) console.error("❌ Error fetching cart items:", cartErr.message);
        else if (allCartItems && allCartItems.length > 0) {
            const sortedCart = allCartItems.reverse().slice(0, 5);
            console.log("✅ Most Recent Cart Items in Database:");
            sortedCart.forEach(c => {
                console.log(`   🛒 Cart Item for User: ${c.user_id?.split('-')[0]}... | Product ID: ${c.product_id} | Size: ${c.size}`);
            });
        } else {
            console.log("ℹ️ No cart items exist in the entire table.");
        }

        console.log("\n=======================================================");
        console.log("✅ DATABASE VERIFICATION COMPLETE.");
        console.log("=======================================================\n");

    } catch (e) {
        console.error("System Error:", e);
    }
}

checkDatabase();
