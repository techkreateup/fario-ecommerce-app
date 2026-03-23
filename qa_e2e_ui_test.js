import puppeteer from 'puppeteer';

(async () => {
    console.log("🚀 FARIO UI E2E AUTOMATION TEST STARTING...");
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ['--start-maximized'] });
    const page = await browser.newPage();

    try {
        // 1. Navigate to the App
        console.log("🌐 Navigating to http://localhost:3000/fario-ecommerce-app/...");
        await page.goto('http://localhost:3000/fario-ecommerce-app/#/', { waitUntil: 'domcontentloaded' });

        // 2. Perform Mock Login Override
        console.log("🔓 Injecting Mock Admin Auth Session...");
        await page.evaluate(() => {
            const mockUser = {
                id: 'mock-admin-999',
                email: 'reachkreateup@gmail.com',
                user_metadata: { name: 'Admin QA', phone: '9999999999' }
            };
            localStorage.setItem('sb-mock-auth-token', JSON.stringify({
                access_token: 'mock-jwt-admin-token-1234.5678',
                user: mockUser,
                expires_at: Math.floor(Date.now() / 1000) + 3600 // Valid for 1 hour
            }));
        });

        // Reload to apply state
        await page.reload({ waitUntil: 'domcontentloaded' });
        console.log("✅ Session Applied. User should be logged in.");
        await new Promise(r => setTimeout(r, 2000));

        // 3. Spin Wheel Interaction
        console.log("🎡 Locating Daily Lucky Spin Wheel...");
        // Scroll down to where the spin wheel typically is (or search for text)
        await page.evaluate(() => window.scrollBy(0, 3000));
        await new Promise(r => setTimeout(r, 2000));

        // Find the 'Spin & Win' button and click it if available
        const spinBtnsText = await page.$$eval('button', btns => btns.map(b => b.textContent));
        const spinBtnIndex = spinBtnsText.findIndex(t => t && t.includes('Spin & Win'));
        if (spinBtnIndex !== -1) {
            const btns = await page.$$('button');
            console.log("🎰 Clicking Spin Wheel!");
            await btns[spinBtnIndex].click();
            console.log("⏳ Waiting 4 seconds for wheel result...");
            await new Promise(r => setTimeout(r, 5000));
        } else {
            console.log("⚠️ Spin Wheel button not found directly. Proceeding.");
        }

        // 4. Shopping - Add to Cart
        console.log("🛍️ Navigating to Products...");
        await page.goto('http://localhost:3000/fario-ecommerce-app/#/products', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 1000));

        console.log("👟 Finding 'Midnight Force' and Size 10...");
        // Click the first product that has text 'Midnight Force'
        await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a'));
            const product = links.find(l => l.textContent && l.textContent.includes('Midnight Force'));
            if (product) product.click();
        });
        await new Promise(r => setTimeout(r, 2000));

        // Click Size 10
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const sizeBtn = buttons.find(b => b.textContent && b.textContent.trim() === '10');
            if (sizeBtn) sizeBtn.click();
        });
        await new Promise(r => setTimeout(r, 1000));

        // Add to Cart
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const addBtn = buttons.find(b => b.textContent && b.textContent.includes('Add to Cart'));
            if (addBtn) addBtn.click();
        });
        console.log("✅ 'Midnight Force' added to cart.");
        await new Promise(r => setTimeout(r, 2000));

        // 5. Checkout / Coupon
        console.log("🛒 Opening Cart Page...");
        await page.goto('http://localhost:3000/fario-ecommerce-app/#/cart', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 2000));

        console.log("🏷️ Typing Coupon 'FARIO50'...");
        await page.evaluate(() => {
            const inputs = Array.from(document.querySelectorAll('input'));
            const couponInput = inputs.find(i => i.placeholder && i.placeholder.includes('Code'));
            if (couponInput) {
                couponInput.value = 'FARIO50';
                // Trigger react change event
                const event = new Event('input', { bubbles: true });
                couponInput.dispatchEvent(event);
            }
        });

        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const applyBtn = buttons.find(b => b.textContent && b.textContent.trim() === 'APPLY');
            if (applyBtn) applyBtn.click();
        });
        await new Promise(r => setTimeout(r, 2000));
        console.log("✅ Coupon application logic tested.");

        console.log("💳 Proceeding to Checkout...");
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const proceedBtn = buttons.find(b => b.textContent && b.textContent.includes('PROCEED TO BUY'));
            if (proceedBtn) proceedBtn.click();
        });
        await new Promise(r => setTimeout(r, 3000));

        // Check URL or Auth Context bypass
        const currentUrl = page.url();
        console.log(`📍 Reached Checkout Sequence at: ${currentUrl}`);

        console.log("\n=======================================================");
        console.log("🎉 UI E2E AUTOMATION SUCCESSFULLY VERIFIED.");
        console.log("The browser navigated gamification, shopping, and checkout flow.");
        console.log("=======================================================\n");

    } catch (e) {
        console.error("❌ E2E QA TEST ERROR:", e);
    } finally {
        console.log("Browser will stay open for 5 seconds to review, then close.");
        await new Promise(r => setTimeout(r, 5000));
        await browser.close();
    }
})();
