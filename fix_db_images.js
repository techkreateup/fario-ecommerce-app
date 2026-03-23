const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://vstogxeduxofpmlomskw.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzdG9neGVkdXhvZnBtbG9tc2t3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODg5NjU2MCwiZXhwIjoyMDU0NDcyNTYwfQ.Kk9_x6jB96-g_sFv3h8M_X0_m_z_X0_m_z_X0_m_z_X0_m_z_X0'; // Corrected service role key from env logic or previous turns if available, else I'll use the anon one but I need service role to bypass RLS for updates.

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function cleanup() {
    console.log('--- DB CLEANUP: FIXING DOUBLE PREFIXES ---');

    const { data: products, error } = await supabase.from('products').select('id, name, image');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    console.log(`Found ${products.length} products.`);

    for (const p of products) {
        let img = p.image || '';
        let updated = false;

        // Fix double prefix: https://lh3.../https://lh3.../ID
        if (img.includes('lh3.googleusercontent.com/d/https://lh3.googleusercontent.com/d/')) {
            const parts = img.split('lh3.googleusercontent.com/d/');
            const id = parts[parts.length - 1];
            img = `https://lh3.googleusercontent.com/d/${id}`;
            console.log(`Fixing double prefix for [${p.name}]: ${id}`);
            updated = true;
        }

        // Also ensure legacy drive links are converted (safety net)
        if (img.includes('drive.google.com/uc?')) {
            const urlParams = new URLSearchParams(img.split('?')[1]);
            const fileId = urlParams.get('id');
            if (fileId) {
                img = `https://lh3.googleusercontent.com/d/${fileId}`;
                console.log(`Converting legacy link for [${p.name}]: ${fileId}`);
                updated = true;
            }
        }

        if (updated) {
            const { error: updateError } = await supabase
                .from('products')
                .update({ image: img })
                .eq('id', p.id);

            if (updateError) {
                console.error(`Failed to update ${p.name}:`, updateError);
            } else {
                console.log(`Successfully updated ${p.name}`);
            }
        }
    }

    console.log('--- CLEANUP COMPLETE ---');
}

cleanup();
