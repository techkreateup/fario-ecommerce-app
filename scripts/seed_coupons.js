
import { createClient } from '@supabase/supabase-js';

// Hardcoded for reliable diagnostic execution - read from .env manually if needed, 
// but for a quick script, direct values are safer to avoid env parsing issues in some contexts.
const SUPABASE_URL = 'https://csyiiksxpmbehiiovlbg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeWlpa3N4cG1iZWhpaW92bGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNTE1MDgsImV4cCI6MjA4NjYyNzUwOH0.A1i9vqFwd_BsMwtod_uFyR-yJhHGW2Vu7PmacxGT6m4';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const coupons = [
    {
        code: 'WELCOME20',
        discounttype: 'percentage',
        discountvalue: 20,
        minordervalue: 1000,
        isactive: true,
        usedcount: 0
    },
    {
        code: 'SAVE50',
        discounttype: 'fixed',
        discountvalue: 50,
        minordervalue: 500,
        isactive: true,
        usedcount: 5
    },
    {
        code: 'SUMMER30',
        discounttype: 'percentage',
        discountvalue: 30,
        minordervalue: 2000,
        isactive: false, // Inactive
        usedcount: 0
    }
];

async function seed() {
    console.log('🌱 Seeding Coupons...');

    for (const coupon of coupons) {
        const { error } = await supabase
            .from('coupons')
            .upsert(coupon, { onConflict: 'code' }); // Upsert by code

        if (error) {
            console.error(`❌ Failed to seed ${coupon.code}:`, error.message);
        } else {
            console.log(`✅ Seeded: ${coupon.code}`);
        }
    }

    console.log('--- Verification ---');
    const { data, error } = await supabase.from('coupons').select('*');
    if (error) console.error('Verify Error:', error);
    else console.log(`Total Coupons: ${data.length}`);
}

seed();
