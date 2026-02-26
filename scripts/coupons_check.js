import { createClient } from '@supabase/supabase-js';

// Hardcoded for reliable diagnostic execution - read from .env manually
const SUPABASE_URL = 'https://csyiiksxpmbehiiovlbg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeWlpa3N4cG1iZWhpaW92bGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNTE1MDgsImV4cCI6MjA4NjYyNzUwOH0.A1i9vqFwd_BsMwtod_uFyR-yJhHGW2Vu7PmacxGT6m4';

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing ENV variables');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
    console.log('--- SUPABASE CHECK ---');

    // Check Table Existence & Rows
    const { data, error, count } = await supabase
        .from('coupons')
        .select('*', { count: 'exact' });

    if (error) {
        console.log('Table Access: ERROR (' + error.message + ')');
        return;
    }

    console.log('Table Exists: YES');
    console.log('Row Count:', count); // Use count from response
    console.log('Data Length:', data?.length);

    if (data && data.length > 0) {
        const row = data[0];
        console.log('First Row Data:');
        console.log('  code:', row.code);
        console.log('  discounttype:', row.discounttype);
        console.log('  discountvalue:', row.discountvalue);
        console.log('  isactive:', row.isactive);
    } else {
        console.log('First Row Data: NONE (Table empty)');
    }
}

check();
