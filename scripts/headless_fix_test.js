const { chromium } = require('playwright');

(async () => {
    console.log('🚀 Launching Headful Browser...');
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('🌊 Navigating to Login...');
        await page.goto('https://techkreateup.github.io/fario-ecommerce-app/#/login');

        // User requested selector-based wait
        await page.waitForSelector('input[type="email"]', { timeout: 15000 });
        console.log('LOGIN_PAGE_LOADED');

        // Attempt Login
        console.log('🔑 Attempting Login...');
        await page.fill('input[type="email"]', 'kreateuptech@gmail.com');
        await page.press('input[type="email"]', 'Tab'); // Move to Name
        await page.type('input[placeholder="Full Name"]', 'Admin Test'); // Placeholder if needed
        await page.press('input[placeholder="Full Name"]', 'Tab'); // Move to Phone
        await page.type('input[placeholder="Contact Link"]', '888888'); // Password/Phone

        // Find generic button
        await page.click('button');

        // Wait for Dashboard or Coupons
        console.log('⏳ Waiting for Redirect...');
        try {
            await page.waitForSelector('a[href*="admin/coupons"]', { timeout: 15000 });
            console.log('DASHBOARD_LOADED');

            console.log('🎫 Navigating to Coupons...');
            await page.goto('https://techkreateup.github.io/fario-ecommerce-app/#/admin/coupons');
            await page.waitForSelector('table', { timeout: 15000 });
            console.log('COUPONS_TABLE_LOADED');

            // Quick visual check of content
            const content = await page.content();
            if (content.includes('WELCOME10') || content.includes('SAVE20')) {
                console.log('✅ FOUND_COUPON_DATA');
            } else {
                console.log('⚠️ TABLE_LOADED_BUT_NO_DATA_MATCH');
            }
        } catch (e) {
            console.log('⚠️ Navigation/Redirect timed out or failed: ' + e.message);
        }

    } catch (e) {
        console.error('❌ ERROR:', e.message);
    } finally {
        console.log('🔒 Closing browser...');
        await browser.close();
        console.log('👋 Exiting process...');
        process.exit(0);
    }
})();
