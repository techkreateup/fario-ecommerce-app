import fetch from 'node-fetch';

const SUPABASE_URL = 'https://csyiiksxpmbehiiovlbg.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeWlpa3N4cG1iZWhpaW92bGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNTE1MDgsImV4cCI6MjA4NjYyNzUwOH0.A1i9vqFwd_BsMwtod_uFyR-yJhHGW2Vu7PmacxGT6m4';

async function testReturnRPC() {
    console.log("Testing create_return_request RPC directly...");
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/create_return_request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${ANON_KEY}`
            },
            body: JSON.stringify({
                p_order_id: 'test_order_123',
                p_user_id: '00000000-0000-0000-0000-000000000000',
                p_items: [],
                p_reason: 'Testing RPC',
                p_refund_method: 'wallet'
            })
        });

        const status = response.status;
        const text = await response.text();
        console.log(`RPC Response Status: ${status}`);
        console.log(`RPC Response Body: ${text}`);

        if (status === 200) {
            const data = JSON.parse(text);
            if (data.success === false && data.message === "Order not found") {
                console.log("✅ SUCCESS! The RPC is executing properly. It verified the order doesn't exist, meaning the 'requestedat' SQL error is GONE.");
            } else {
                console.log("⚠️ RPC executed, but returned unexpected logic output:", data);
            }
        } else {
            console.error("❌ RPC failed with HTTP error.");
        }
    } catch (e) {
        console.error("Fetch failed", e);
    }
}

testReturnRPC();
