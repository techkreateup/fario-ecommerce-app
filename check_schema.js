import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('Checking orders table schema...');
    // We can query the information_schema to check the column type
    const { data, error } = await supabase.rpc('execute_sql', {
        sql_query: "SELECT column_name, data_type, udt_name FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'status';"
    });

    if (error) {
        console.log('Error calling execute_sql RPC, trying REST API directly...', error.message);
        // Fallback: Just select 1 restricted row to see what the API returns in the header or data
        const { data: oData, error: oError } = await supabase.from('orders').select('status').limit(1);
        console.log('Sample Data:', oData);
    } else {
        console.log('Schema Result:', data);
    }
}

checkSchema();
