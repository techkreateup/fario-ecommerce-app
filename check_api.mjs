import fs from 'fs';

const supabaseUrl = 'https://csyiiksxpmbehiiovlbg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeWlpa3N4cG1iZWhpaW92bGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNTE1MDgsImV4cCI6MjA4NjYyNzUwOH0.A1i9vqFwd_BsMwtod_uFyR-yJhHGW2Vu7PmacxGT6m4';

const tables = ['profiles', 'products', 'orders', 'cart_items', 'reviews', 'coupons', 'logs', 'returns'];

async function check() {
    const out = [];
    out.push('\n=========================================');
    out.push('📊 FARIO DATABASE AUDIT (LIVE DATA)');
    out.push('=========================================\n');
    for (const table of tables) {
        try {
            const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=id`, {
                method: 'HEAD',
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Prefer': 'count=exact'
                }
            });
            const cntRange = res.headers.get('content-range');
            const count = cntRange ? cntRange.split('/')[1] : '0';

            out.push(`➔ Table [ ${table.toUpperCase().padEnd(12)} ] : ${count.padStart(4)} rows`);
        } catch (e) {
            out.push(`➔ Table [ ${table.toUpperCase().padEnd(12)} ] : ERROR (${e.message})`);
        }
    }
    out.push('\n=========================================\n');
    fs.writeFileSync('db_counts_fixed.txt', out.join('\n'));
}
check();
