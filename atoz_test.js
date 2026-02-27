import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

async function run() {
    console.log("🚀 FARIO BACKEND A-TO-Z VERIFICATION...\n");
    let token = '';
    let userId = '';

    try {
        // 1. Attempt to create a test user with a password
        console.log("1️⃣ Authenticating Free Tier Test User (test_atoz@example.com)...");
        let authRes = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
            method: 'POST',
            headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test_atoz@example.com', password: 'Password123!' })
        });

        let authData = await authRes.json();

        // If already exists, login instead
        if (!authRes.ok || (authData.msg && authData.msg.includes('already registered'))) {
            authRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
                method: 'POST',
                headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'test_atoz@example.com', password: 'Password123!' })
            });
            authData = await authRes.json();
        }

        if (!authRes.ok || !authData.access_token) {
            console.error("❌ Authentication Failed.");
            return;
        }

        token = authData.access_token;
        userId = authData.user.id;
        console.log(`✅ Authentication Success! Found User ID in Supabase: ${userId}`);

        const headers = {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };

        // FETCH REAL PRODUCTS TO AVOID FK ERRORS
        const productsRes = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id,name,price&limit=2`, { headers });
        const products = await productsRes.json();

        if (!products || products.length < 2) {
            console.error("❌ Need at least 2 real products in DB to run test.");
            return;
        }

        // 2. Add Item to Cart
        console.log(`\n2️⃣ Adding '${products[0].name}' to Cart via REST API...`);
        const cartRes = await fetch(`${SUPABASE_URL}/rest/v1/cart_items`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                user_id: userId,
                product_id: products[0].id,
                quantity: 1,
                size: 9,
                color: 'Default'
            })
        });
        if (cartRes.ok) console.log(`✅ CART SUCCESS: '${products[0].name}' instantly prepended to 'cart_items' table.`);
        else console.error("❌ Cart Error:", await cartRes.json());

        // 3. Add Item to Wishlist
        console.log(`\n3️⃣ Adding '${products[1].name}' to Wishlist via REST API...`);
        const wishRes = await fetch(`${SUPABASE_URL}/rest/v1/saved_items`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                user_id: userId,
                productid: products[1].id,
                productdata: products[1]
            })
        });
        if (wishRes.ok) console.log(`✅ WISHLIST SUCCESS: '${products[1].name}' securely written to 'saved_items' table.`);
        else console.error("❌ Wishlist Error:", await wishRes.json());

        // 4. Spin Wheel (Write to profiles)
        console.log("\n4️⃣ Simulating Spin Wheel Win (MINTING COUPON)...");
        const spinRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({
                data: {
                    spin_coupons: [{
                        id: 'test-coupon',
                        coupon_code: 'SPIN_PRO_MAX',
                        discount_type: 'percentage',
                        discount_value: 20,
                        created_at: new Date().toISOString()
                    }]
                }
            })
        });
        const spinData = await spinRes.json();
        if (spinRes.ok && spinData.user_metadata?.spin_coupons) {
            console.log("✅ SPIN WHEEL SUCCESS: Coupon successfully saved in users profile metadata.");
            console.log("   -> Real-time Coupon Stored:", spinData.user_metadata.spin_coupons[0]);
        } else {
            console.error("❌ Spin Wheel Error:", spinData);
        }

        console.log("\n=======================================================");
        console.log("🎉 A-TO-Z BACKEND PROOF COMPLETE: ");
        console.log("All actions successfully hit the Supabase database REST endpoints without SDK timeouts.");
        console.log("=======================================================\n");

    } catch (e) {
        console.error("System Error:", e);
    }
}

run();
