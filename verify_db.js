import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verifyTable() {
    console.log('Verifying user_coupons table...');
    const { data, error } = await supabase.from('user_coupons').select('*').limit(1);

    if (error) {
        if (error.code === '42P01') {
            console.log('TABLE_NOT_FOUND');
        } else {
            console.error('ERROR:', error);
        }
    } else {
        console.log('TABLE_EXISTS');
    }
}

verifyTable();
