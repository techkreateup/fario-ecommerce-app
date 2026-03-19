
import fetch from 'node-fetch';

const API_URL = 'https://script.google.com/macros/s/AKfycbwr6_CdnWgCyRvouZ7cdprWa1nsDfRzm_6pUW2HlUlZt2yPuzYbK-fGomWT_kx6-CmcZQ/exec';

async function testConnection() {
    console.log("Testing connection to: " + API_URL);

    // Test 1: GET Products (Read)
    try {
        const res = await fetch(API_URL + '?action=getProducts');
        const data = await res.json();
        console.log("✅ GET Products: Success. Found " + (data.data ? data.data.length : 0) + " items.");
    } catch (e) {
        console.error("❌ GET Products Failed:", e.message);
    }

    // Test 2: POST Review (Write)
    try {
        const payload = {
            action: 'addReview',
            productId: 'test-p1',
            userEmail: 'test-bot@fario.com',
            rating: 5,
            comment: 'Test review from CLI ' + new Date().toISOString()
        };

        const res = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        console.log("✅ POST Review: " + JSON.stringify(data));
    } catch (e) {
        console.error("❌ POST Review Failed:", e.message);
    }
}

testConnection();
