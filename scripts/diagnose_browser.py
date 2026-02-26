try:
    from playwright.sync_api import sync_playwright
    
    print("🚀 Attempting to launch browser...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        print("navigation starting...")
        page.goto('https://example.com')
        print("✅ Browser working! Title:", page.title())
        browser.close()
except Exception as e:
    print(f"❌ Error: {type(e).__name__}: {str(e)}")
