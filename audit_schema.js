
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://csyiiksxpmbehiiovlbg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeWlpa3N4cG1iZWhpaW92bGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNTE1MDgsImV4cCI6MjA4NjYyNzUwOH0.A1i9vqFwd_BsMwtod_uFyR-yJhHGW2Vu7PmacxGT6m4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function discover() {
    const tables = ['profiles', 'orders', 'returns'];
    const results = {};

    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (data && data.length > 0) {
            results[table] = Object.keys(data[0]).join(', ');
        } else {
            results[table] = error ? error.message : 'No data/Empty';
        }
    }
    fs.writeFileSync('schema.txt', JSON.stringify(results, null, 2));
}
discover();
