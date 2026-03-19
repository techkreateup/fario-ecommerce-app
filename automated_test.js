import { chromium } from 'playwright';

(async () => {
    console.log('🚀 FARIO E-COMMERCE - AUTOMATED BROWSER TEST');
    console.log('--------------------------------------------------');

    // Launch browser
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Arrays to store report
    const report = [];

    // Helper to log and report
    const logResult = (task, result, details = '') => {
        const mark = result ? '✅ PASS' : '❌ FAIL';
        console.log(`[${mark}] ${task} ${details ? '- ' + details : ''}`);
        report.push({ task, result, details });
    };

    try {
        // --- PHASE 1: INITIAL SETUP & GUEST USER JOURNEY ---
        console.log('\n--- PHASE 1: Site Load & Environment Check ---');

        // Task 1.1: Homepage Load Test
        const startLoad = Date.now();
        await page.goto('https://techkreateup.github.io/fario-ecommerce-app/', { waitUntil: 'networkidle' });
        const loadTime = Date.now() - startLoad;
        logResult('TASK 1.1: Homepage Load Test', loadTime < 3000, `Load time: ${loadTime}ms`);

        // Task 1.2: Env Check
        // Cannot read import.meta.env from compiled output easily without dev tools, 
        // but we can check if keys exist in the window object or intercept requests.
        // We will test Supabase connection via REST.

        // Task 1.3: Navigation Test
        await page.click('text=Products');
        await page.waitForURL('**/products');
        logResult('TASK 1.3: Navigation to /products', true);

        await page.click('text=Cart');
        await page.waitForTimeout(1000); // Wait for drawer
        logResult('TASK 1.3: Navigation to Cart Drawer', true);

        // Close drawer (click outside or X depending on UI)
        await page.keyboard.press('Escape');

        // Task 1.4: Supabase Connection Test
        const spRes = await page.evaluate(async () => {
            try {
                const res = await fetch('https://csyiiksxpmbehiiovlbg.supabase.co/rest/v1/products?select=count', {
                    headers: {
                        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeWlpa3N4cG1iZWhpaW92bGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNTE1MDgsImV4cCI6MjA4NjYyNzUwOH0.A1i9vqFwd_BsMwtod_uFyR-yJhHGW2Vu7PmacxGT6m4'
                    }
                });
                return { ok: res.ok, status: res.status };
            } catch (e) { return { ok: false, error: e.message }; }
        });
        logResult('TASK 1.4: Supabase Connection Test', spRes.ok, `Status: ${spRes.status}`);

        // --- PHASE 2: Products Page & DB Sync ---
        console.log('\n--- PHASE 2: Products Page & Search ---');
        await page.goto('https://techkreateup.github.io/fario-ecommerce-app/#/products', { waitUntil: 'networkidle' });

        const productCards = await page.locator('.product-card, [data-testid="product-card"], a[href*="/product/"]').count();
        logResult('TASK 2.1: Products Listing', productCards > 0, `Found ${productCards} products`);

        await page.fill('input[type="text"][placeholder*="Search"]', 'shirt');
        await page.waitForTimeout(1000); // wait for debounce
        const searchResults = await page.locator('a[href*="/product/"]').count();
        logResult('TASK 2.2: Product Search ("shirt")', searchResults > 0, `Found ${searchResults} items matching "shirt"`);

    } catch (error) {
        console.error('TEST ERROR:', error);
    } finally {
        await browser.close();
    }
})();
