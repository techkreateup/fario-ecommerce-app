import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// Read JWT from freshly generated session
const sessionData = JSON.parse(fs.readFileSync('real_session.json', 'utf8'));
const TEST_JWT = JSON.parse(sessionData.value).access_token;

async function diagnoseRPC() {
    console.log("🔍 DIAGNOSING 'place_order_with_stock' RPC...\n");

    let realProductId = "test-product-id";
    try {
        const prodRes = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id&limit=1`, {
            headers: { 'apikey': SUPABASE_KEY }
        });
        const prods = await prodRes.json();
        if (prods && prods.length > 0) realProductId = prods[0].id;
        console.log("🛒 Using valid Product ID:", realProductId);
    } catch (e) { }

    const payload = {
        p_items: [{
            id: realProductId,
            quantity: 1,
            price: 5000,
            selectedSize: "10"
        }],
        p_total: 5000,
        p_shipping_address: "Test User, 123 Main St, Test City, TS 12345",
        p_payment_method: "Cash on Delivery"
    };

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/place_order_with_stock`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${TEST_JWT}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(payload)
        });

        const status = response.status;
        const text = await response.text();

        console.log(`📡 HTTP STATUS: ${status}`);
        console.log(`📝 RESPONSE BODY: ${text}`);

        if (status === 200 && text === 'null') {
            console.warn("\n⚠️ WARNING: The RPC returned 'null' with a 200 OK. This indicates the Pl/pgSQL function executed successfully but swallowed an error or performed a ROLLBACK internally.");
        }

    } catch (err) {
        console.error("System Error", err);
    }
}

diagnoseRPC();
