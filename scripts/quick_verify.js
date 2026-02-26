
import https from 'https';

const SUPABASE_URL = 'https://csyiiksxpmbehiiovlbg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeWlpa3N4cG1iZWhpaW92bGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNTE1MDgsImV4cCI6MjA4NjYyNzUwOH0.A1i9vqFwd_BsMwtod_uFyR-yJhHGW2Vu7PmacxGT6m4';

const options = {
    hostname: 'csyiiksxpmbehiiovlbg.supabase.co',
    path: '/rest/v1/coupons?select=*',
    method: 'GET',
    headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
    }
};

console.log("🚀 Connectivity Check: Pinging Supabase (ESM Mode)...");

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
                const coupons = JSON.parse(data);
                console.log(`✅ SUCCESS: Connected to Database.`);
                console.log(`📊 Found ${coupons.length} coupons:`);
                coupons.forEach(c => console.log(`   - ${c.code} (${c.discounttype}: ${c.discountvalue})`));
            } catch (e) {
                console.error("❌ ERROR: Failed to parse JSON response.");
                console.log(data);
            }
        } else {
            console.error(`❌ ERROR: Request failed with status code ${res.statusCode}`);
            console.log(data);
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ NETWORK ERROR: ${e.message}`);
});

req.end();
