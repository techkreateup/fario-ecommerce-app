
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://csyiiksxpmbehiiovlbg.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
    console.log('Checking products in:', supabaseUrl);
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(10);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Found', data.length, 'products');
    data.forEach(p => {
        console.log(`- ${p.id}: ${p.name} (${p.category})`);
    });
}

checkProducts();
