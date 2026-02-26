import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envFile = readFileSync('.env.local', 'utf-8');
const env = Object.fromEntries(envFile.split('\n').filter(l => l && !l.startsWith('#')).map(l => {
    let [k, ...v] = l.split('=');
    if (!k) return [];
    return [k.trim(), v.join('=').trim().replace(/['"]/g, '')];
}).filter(a => a.length === 2));

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
const tables = ['profiles', 'products', 'orders', 'cart_items', 'reviews', 'coupons', 'logs', 'returns'];

async function check() {
    console.log('--- SUPABASE TABLE ROW COUNTS ---');
    for (const table of tables) {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (error) console.log(`Table ${table} error: ${error.message}`);
        else console.log(`T: ${table} -> ${count} rows`);
    }
    console.log('---------------------------------');
}
check();
