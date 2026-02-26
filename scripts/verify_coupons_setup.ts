
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables if available
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://csyiiksxpmbehiiovlbg.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeWlpa3N4cG1iZWhpaW92bGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNTE1MDgsImV4cCI6MjA4NjYyNzUwOH0.A1i9vqFwd_BsMwtod_uFyR-yJhHGW2Vu7PmacxGT6m4';

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Anon Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCoupons() {
    console.log('Checking connection to Supabase...');
    try {
        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .limit(5);

        if (error) {
            console.error('Error fetching coupons:', error.message);
            if (error.code === '42P01') { // undefined_table
                console.log('TABLE MISSING: The "coupons" table does not exist.');
            }
            process.exit(1);
        }

        console.log(`Success! Found ${data.length} coupons.`);
        if (data.length > 0) {
            console.log('Sample data:', data[0]);
        } else {
            console.log('Table exists but is empty.');
        }
    } catch (err) {
        console.error('Unexpected error:', err);
        process.exit(1);
    }
}

checkCoupons();
