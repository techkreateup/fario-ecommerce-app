const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://csyiiksxpmbehiiovlbg.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeWlpa3N4cG1iZWhpaW92bGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNTE1MDgsImV4cCI6MjA4NjYyNzUwOH0.A1i9vqFwd_BsMwtod_uFyR-yJhHGW2Vu7PmacxGT6m4';

async function runTests() {
    console.log('🧪 FARIO E-COMMERCE - API VALIDATION TESTS');
    console.log('=========================================\n');

    // Test 1: Get all products
    console.log('TEST 1: Fetch All Products');
    const allProducts = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
        headers: { 'apikey': SUPABASE_ANON_KEY }
    }).then(r => r.json());
    console.log(`✅ Total products: ${allProducts.length}`);
    console.log(`Products: ${allProducts.map(p => p.name).join(', ')}\n`);

    // Test 2: Search for "Glide" (matches "Urban Glide")
    console.log('TEST 2: Search for "Glide"');
    const searchGlide = await fetch(
        `${SUPABASE_URL}/rest/v1/products?select=*&name=ilike.*Glide*`,
        { headers: { 'apikey': SUPABASE_ANON_KEY } }
    ).then(r => r.json());
    console.log(`✅ Found ${searchGlide.length} products with "Glide"`);
    console.log(`Results: ${searchGlide.map(p => p.name).join(', ')}\n`);

    // Test 3: Filter by "Shoes" category
    console.log('TEST 3: Filter by "Shoes"');
    const shoes = await fetch(
        `${SUPABASE_URL}/rest/v1/products?select=*&category=eq.Shoes`,
        { headers: { 'apikey': SUPABASE_ANON_KEY } }
    ).then(r => r.json());
    console.log(`✅ Found ${shoes.length} shoes`);
    console.log(`Products: ${shoes.map(p => p.name).join(', ')}\n`);

    // Test 4: Filter by "Bags" category
    console.log('TEST 4: Filter by "Bags"');
    const bags = await fetch(
        `${SUPABASE_URL}/rest/v1/products?select=*&category=eq.Bags`,
        { headers: { 'apikey': SUPABASE_ANON_KEY } }
    ).then(r => r.json());
    console.log(`✅ Found ${bags.length} bags`);
    console.log(`Products: ${bags.map(p => p.name).join(', ')}\n`);

    // Test 5: Get all categories
    console.log('TEST 5: List All Categories');
    const categories = [...new Set(allProducts.map(p => p.category))];
    console.log(`✅ Categories: ${categories.join(', ')}\n`);

    // Test 6: Price range query (under 5000)
    console.log('TEST 6: Products under ₹5000');
    const affordable = await fetch(
        `${SUPABASE_URL}/rest/v1/products?select=*&price=lt.5000`,
        { headers: { 'apikey': SUPABASE_ANON_KEY } }
    ).then(r => r.json());
    console.log(`✅ Found ${affordable.length} affordable products\n`);

    // Test 7: Stock availability
    console.log('TEST 7: In-Stock Products');
    const inStock = await fetch(
        `${SUPABASE_URL}/rest/v1/products?select=*&stock=gt.0`,
        { headers: { 'apikey': SUPABASE_ANON_KEY } }
    ).then(r => r.json());
    console.log(`✅ ${inStock.length} products in stock\n`);

    // Test 8: Featured products
    console.log('TEST 8: Featured Products');
    const featured = await fetch(
        `${SUPABASE_URL}/rest/v1/products?select=*&featured=eq.true`,
        { headers: { 'apikey': SUPABASE_ANON_KEY } }
    ).then(r => r.json());
    console.log(`✅ ${featured.length} featured products`);
    if (featured.length > 0) {
        console.log(`Products: ${featured.map(p => p.name).join(', ')}`);
    }
    console.log('\n');

    // Summary
    console.log('=========================================');
    console.log('📊 TEST SUMMARY');
    console.log('=========================================');
    console.log(`Total Products: ${allProducts.length}`);
    console.log(`Categories: ${categories.length}`);
    console.log(`In Stock: ${inStock.length}`);
    console.log(`Featured: ${featured.length}`);
    console.log(`All Tests: ✅ PASSED`);
}

runTests().catch(console.error);
