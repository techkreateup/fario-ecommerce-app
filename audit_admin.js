
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://csyiiksxpmbehiiovlbg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeWlpa3N4cG1iZWhpaW92bGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNTE1MDgsImV4cCI6MjA4NjYyNzUwOH0.A1i9vqFwd_BsMwtod_uFyR-yJhHGW2Vu7PmacxGT6m4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function audit() {
    console.log('--- AUDIT START ---');

    // 1. Check Profiles for Admins
    const { data: admins, error: adminError } = await supabase
        .from('profiles')
        .select('id, email, role')
        .eq('role', 'admin');

    if (adminError) console.error('Admin Query Error:', adminError);
    console.log('Admins Found:', JSON.stringify(admins, null, 2));

    // 2. Check for "testadmin" specifically (in profiles)
    const { data: testAdmin, error: testError } = await supabase
        .from('profiles')
        .select('id, email, role')
        .ilike('email', '%testadmin%');

    if (testError) console.error('Test Admin Query Error:', testError);
    console.log('Test/Unauthorized Admins:', JSON.stringify(testAdmin, null, 2));

    // 3. Check Product Stock (Limit 5)
    const { data: products, error: prodError } = await supabase
        .from('products')
        .select('id, name, stockquantity')
        .gte('stockquantity', 10)
        .limit(5);

    if (prodError) console.error('Product Query Error:', prodError);
    console.log('Test Candidate Products:', JSON.stringify(products, null, 2));

    console.log('--- AUDIT END ---');
}

audit();
