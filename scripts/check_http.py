import requests
import sys

def check_page_without_browser(url):
    """
    Check if page is accessible without opening browser
    """
    try:
        print(f"🔍 Checking {url} via HTTP...")
        
        response = requests.get(url, timeout=10)
        
        print(f"✅ Status Code: {response.status_code}")
        print(f"📄 Content Length: {len(response.text)} bytes")
        print(f"📝 First 500 chars:\n{response.text[:500]}")
        
        # Check if it's a React app (SPA)
        if 'div id="root"' in response.text or 'div id="app"' in response.text or '<div id="root">' in response.text:
            print("ℹ️ This is a Single Page Application (React/Vue)")
            print("ℹ️ Actual content loads via JavaScript")
            print("✅ But the page HTML is being served correctly!")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

# Test it
url = 'https://techkreateup.github.io/fario-ecommerce-app/'
if len(sys.argv) > 1:
    url = sys.argv[1]

check_page_without_browser(url)
