from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    
    page.on("pageerror", lambda err: print(f"PAGE ERROR: {err[:300]}"))
    page.on("console", lambda msg: print(f"CONSOLE [{msg.type}]: {msg.text[:300]}"))
    
    page.goto("http://127.0.0.1:8097")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(5000)
    
    result = page.evaluate("() => document.title")
    print(f"Title: {result}")
    
    scripts = page.evaluate("() => Array.from(document.querySelectorAll('script[src]')).map(s => s.src)")
    print(f"Scripts: {len(scripts)} loaded")
    
    body_text = page.evaluate("() => document.body.innerText.substring(0, 200)")
    print(f"Body: {body_text}")
    
    browser.close()
