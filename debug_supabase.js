const supabaseUrl = 'https://qiylwsgjqwqhxwjwfbom.supabase.co';
const supabaseKey = 'sb_publishable_q6RN54n-PeAEjQUd7FUqZQ_qPyTvQen';

async function test() {
    console.log('Testing connection to:', supabaseUrl);
    try {
        const start = Date.now();
        const response = await fetch(`${supabaseUrl}/rest/v1/products?select=id&limit=1`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });
        const duration = Date.now() - start;

        if (!response.ok) {
            const text = await response.text();
            console.error(`❌ HTTP Error ${response.status}:`, text);
        } else {
            const data = await response.json();
            console.log('✅ Connection Successful!');
            console.log('Response time:', duration, 'ms');
            console.log('Sample Data:', data);
        }
    } catch (err) {
        console.error('💥 Execution Exception:', err);
    }
}

test();
