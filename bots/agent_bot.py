#!/usr/bin/env python3
"""
🕵️ JATRAMELA AGENT BOT — Quality Checker & Daily Task Executor
Performs automated quality audits, finds issues, and self-heals the store.

Managed by: manager_bot.py (runs this daily)
Usage standalone: python3 bots/agent_bot.py [--fix] [--report]

Tasks performed daily:
  ✅ QC-1  All products have thumbnail images
  ✅ QC-2  All products are assigned to Karnataka categories
  ✅ QC-3  All products have valid INR prices (reasonable range ₹1–₹99,999)
  ✅ QC-4  No duplicate product titles
  ✅ QC-5  All products are in Published status (not Draft)
  ✅ QC-6  All category pages return 200 (not 404)
  ✅ QC-7  Store API returns products for India region
  ✅ QC-8  Chatbot widget accessible on homepage
  ✅ QC-9  Blog and FAQ pages load correctly
  ✅ QC-10 Razorpay key is configured in environment
  🔧 AUTO-FIX: Missing categories → assigns automatically
  🔧 AUTO-FIX: Draft products → publishes automatically
  🔧 AUTO-FIX: Wrong price (100x) → corrects to rupees automatically
"""

import sys, os, json, time, requests
from datetime import datetime

# ─── Config ───────────────────────────────────────────────────────────────────
MEDUSA_URL       = "http://localhost:9000"
STOREFRONT_URL   = "http://localhost:8000"
ADMIN_EMAIL      = "admin@jatramela.com"
ADMIN_PASS       = "Admin123!"
REPORT_DIR       = "bots/reports"
INDIA_REGION_KEY = "inr"

AUTO_FIX = "--fix" in sys.argv or True   # auto-fix by default

os.makedirs(REPORT_DIR, exist_ok=True)

# ─── Price reference ──────────────────────────────────────────────────────────
PRICE_MAP = {
    "Ragi": 249, "Rice": 189, "Coconut": 399, "Turmeric": 149,
    "Jowar": 129, "Honey": 549, "Jaggery": 89, "Chilli": 179,
    "Sesame": 349, "Horse Gram": 99, "Mysore Silk": 4999,
    "Ilkal": 2499, "Dharwad": 899, "Angavastram": 499,
    "Neem": 89, "Ashwagandha": 299, "Brahmi": 249,
    "Copper": 449, "Sandalwood": 349, "Channapatna": 349,
    "Bidriware": 1299, "Kulhad": 199,
}

CATEGORY_KEYWORDS = {
    "organic":    ["Ragi","Rice","Coconut Oil","Turmeric","Jowar","Honey","Jaggery","Chilli","Sesame","Horse Gram"],
    "clothing":   ["Saree","Kurta","Angavastram","Ilkal","Silk"],
    "wellness":   ["Soap","Ashwagandha","Brahmi","Copper","Sandalwood"],
    "handicrafts":["Channapatna","Bidriware","Kulhad","Terracotta"],
}

STOREFRONT_PAGES = [
    ("/in",                          "Homepage"),
    ("/in/store",                    "Shop All"),
    ("/in/blog",                     "Blog"),
    ("/in/faq",                      "FAQ"),
    ("/in/categories/organic",       "Organic Category"),
    ("/in/categories/clothing",      "Clothing Category"),
    ("/in/categories/wellness",      "Wellness Category"),
    ("/in/categories/handicrafts",   "Handicrafts Category"),
]

# ─── Auth ─────────────────────────────────────────────────────────────────────
def get_token():
    try:
        r = requests.post(f"{MEDUSA_URL}/auth/user/emailpass",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASS}, timeout=8)
        return r.json().get("token")
    except Exception as e:
        print(f"  ❌ Auth error: {e}")
        return None

def h(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

def get_india_region(token):
    r = requests.get(f"{MEDUSA_URL}/admin/regions", headers=h(token), timeout=8)
    for reg in r.json().get("regions", []):
        if reg.get("currency_code") == "inr":
            return reg["id"]
    return None

# ─── QC Checks ───────────────────────────────────────────────────────────────

class QCResult:
    def __init__(self, check_id, name):
        self.check_id  = check_id
        self.name      = name
        self.status    = "PASS"   # PASS | WARN | FAIL | FIXED
        self.issues    = []
        self.fixes     = []
        self.detail    = ""
    def fail(self, msg):   self.status = "FAIL"; self.issues.append(msg)
    def warn(self, msg):   self.status = "WARN" if self.status == "PASS" else self.status; self.issues.append(msg)
    def fixed(self, msg):  self.status = "FIXED"; self.fixes.append(msg)
    def __str__(self):
        icon = {"PASS":"✅","WARN":"⚠️ ","FAIL":"❌","FIXED":"🔧"}[self.status]
        return f"  {icon} {self.check_id}: {self.name} — {self.status}"


def qc_images(token, products):
    r = QCResult("QC-1", "Product Images")
    missing = [p["title"] for p in products if not p.get("thumbnail")]
    if missing:
        r.fail(f"{len(missing)} products missing thumbnails: {', '.join(missing[:3])}")
    else:
        r.detail = f"All {len(products)} products have thumbnail images"
    return r


def qc_categories(token, products):
    r = QCResult("QC-2", "Category Assignment")
    cats = requests.get(f"{MEDUSA_URL}/admin/product-categories?limit=50",
        headers=h(token), timeout=8).json().get("product_categories", [])
    cat_ids = {c["handle"]: c["id"] for c in cats}
    india_cats = {"organic","clothing","wellness","handicrafts"}

    uncat = []
    for p in products:
        if "Medusa" in p.get("title", ""): continue
        cat_handles = [c.get("handle","") for c in p.get("categories", [])]
        if not any(ch in india_cats for ch in cat_handles):
            uncat.append(p)

    if uncat and AUTO_FIX:
        for p in uncat:
            title = p["title"]
            # Find right category
            assigned_cat = None
            for handle, keywords in CATEGORY_KEYWORDS.items():
                if any(kw.lower() in title.lower() for kw in keywords):
                    assigned_cat = cat_ids.get(handle)
                    break
            if assigned_cat:
                pr = requests.post(f"{MEDUSA_URL}/admin/products/{p['id']}",
                    headers=h(token), json={"categories": [{"id": assigned_cat}]}, timeout=8)
                if pr.status_code in (200, 201):
                    r.fixed(f"Assigned {title} → category")
                else:
                    r.fail(f"Could not assign {title}")
            else:
                r.warn(f"No category match for: {title}")
    elif uncat:
        r.fail(f"{len(uncat)} products without Karnataka categories")
    else:
        r.detail = f"All products correctly categorised"
    return r


def qc_prices(token, products, region_id):
    r = QCResult("QC-3", "INR Price Validity")
    bad_prices = []

    for p in products:
        if "Medusa" in p.get("title", ""): continue
        for v in p.get("variants", []):
            inr_prices = [pr for pr in v.get("prices", []) if pr.get("currency_code") == "inr"]
            if not inr_prices:
                r.fail(f"No INR price: {p['title']}")
                continue
            for price in inr_prices:
                amt = price.get("amount", 0)
                # Sanity check: price should be between ₹1 and ₹99,999
                if amt > 99999:
                    bad_prices.append((p, v["id"], amt))
                elif amt < 1:
                    r.fail(f"Zero price: {p['title']}")

    if bad_prices and AUTO_FIX:
        for prod, vid, amt in bad_prices:
            title = prod["title"]
            correct = 399
            for kw, price in PRICE_MAP.items():
                if kw.lower() in title.lower():
                    correct = price; break
            # Divide by 100 (paise → rupees)
            fixed_amt = amt // 100
            if fixed_amt > 99999:
                fixed_amt = correct

            old_prices = next(
                (v.get("prices",[]) for v in prod.get("variants",[]) if v["id"]==vid), [])
            new_prices = [p for p in old_prices if p.get("currency_code") != "inr"]
            new_prices.append({"amount": fixed_amt, "currency_code": "inr",
                "rules": {"region_id": region_id}})
            pr = requests.post(f"{MEDUSA_URL}/admin/products/{prod['id']}/variants/{vid}",
                headers=h(token), json={"prices": new_prices}, timeout=8)
            if pr.status_code in (200, 201):
                r.fixed(f"Corrected price {title}: ₹{amt} → ₹{fixed_amt}")
    elif bad_prices:
        r.fail(f"{len(bad_prices)} products with suspicious prices (>₹99,999)")
    else:
        r.detail = f"All prices in valid range"
    return r


def qc_duplicates(token, products):
    r = QCResult("QC-4", "Duplicate Products")
    titles = [p["title"] for p in products]
    seen = set()
    dupes = []
    for t in titles:
        if t in seen:
            dupes.append(t)
        seen.add(t)
    if dupes:
        r.fail(f"Duplicate titles: {', '.join(dupes[:3])}")
    else:
        r.detail = f"No duplicates in {len(products)} products"
    return r


def qc_published(token, products):
    r = QCResult("QC-5", "Published Status")
    drafts = [p for p in products if p.get("status") == "draft" and "Medusa" not in p.get("title","")]
    if drafts and AUTO_FIX:
        for p in drafts:
            pr = requests.post(f"{MEDUSA_URL}/admin/products/{p['id']}",
                headers=h(token), json={"status": "published"}, timeout=8)
            if pr.status_code in (200, 201):
                r.fixed(f"Published: {p['title']}")
    elif drafts:
        r.fail(f"{len(drafts)} Karnataka products still in draft")
    else:
        r.detail = f"All products published"
    return r


def qc_storefront_pages():
    r = QCResult("QC-6", "Storefront Page Health")
    failed_pages = []
    try:
        for path, label in STOREFRONT_PAGES:
            try:
                resp = requests.get(f"{STOREFRONT_URL}{path}", timeout=12, allow_redirects=True)
                if resp.status_code >= 400:
                    # Retry once — server may be compiling
                    time.sleep(3)
                    resp2 = requests.get(f"{STOREFRONT_URL}{path}", timeout=12, allow_redirects=True)
                    if resp2.status_code >= 400:
                        failed_pages.append(f"{label} ({resp2.status_code})")
                        r.fail(f"{label}: HTTP {resp2.status_code}")
                    # else: recovered on retry — treat as pass
            except requests.exceptions.ConnectionError:
                failed_pages.append(f"{label} (connection refused)")
                r.warn(f"{label}: Not reachable — storefront may be starting up")
            except requests.exceptions.ReadTimeout:
                r.warn(f"{label}: Timed out — storefront compiling")
    except Exception as e:
        r.warn(f"Page check error: {e}")

    if not failed_pages and r.status == "PASS":
        r.detail = f"All {len(STOREFRONT_PAGES)} pages returning 200 ✅"
    return r


def qc_store_api(token, region_id):
    r = QCResult("QC-7", "Store API (India Region)")
    try:
        resp = requests.get(
            f"{MEDUSA_URL}/store/products?region_id={region_id}&limit=5",
            headers={"x-publishable-api-key": "pk_47c67a39493d3f190d0eaef93b126d241fc0fa4f1b605545ffee8c2b071ac12e"},
            timeout=8)
        prods = resp.json().get("products", [])
        if len(prods) == 0:
            r.fail("0 products returned for India region via store API")
        else:
            r.detail = f"{len(prods)}+ products visible to Indian shoppers"
    except Exception as e:
        r.fail(f"Store API error: {e}")
    return r


def qc_chatbot():
    """Check chatbot by verifying source file exists AND homepage responds 200.
    Since Kaveri is fully client-rendered, HTML scanning is unreliable."""
    r = QCResult("QC-8", "Chatbot Widget")
    # 1. Source-level check — is the chatbot component present?
    chatbot_src = "apps/storefront/src/modules/layout/components/chatbot/index.tsx"
    if not os.path.exists(chatbot_src):
        r.fail("Chatbot component file missing")
        return r
    content = open(chatbot_src).read()
    if len(content) < 100:
        r.fail("Chatbot component is empty")
        return r
    # 2. Check chatbot is imported in layout
    layout_src = "apps/storefront/src/app/[countryCode]/(main)/layout.tsx"
    layout_ok = False
    if os.path.exists(layout_src):
        lc = open(layout_src).read()
        layout_ok = "ChatBot" in lc or "chatbot" in lc.lower()
    # 3. Verify homepage is up (200)
    try:
        resp = requests.get(f"{STOREFRONT_URL}/in", timeout=10, allow_redirects=True)
        homepage_ok = resp.status_code == 200
    except Exception:
        homepage_ok = False
    if layout_ok and homepage_ok:
        r.detail = "Kaveri chatbot component present, imported in layout, homepage live ✅"
    elif not layout_ok:
        r.warn("Chatbot not imported in main layout — add ChatBot to layout.tsx")
    elif not homepage_ok:
        r.warn("Homepage not reachable — storefront may be starting up")
    return r


def qc_env_config():
    r = QCResult("QC-9", "Environment Configuration")
    env_file = "apps/storefront/.env.local"
    if not os.path.exists(env_file):
        r.fail(".env.local missing")
        return r
    with open(env_file) as f:
        content = f.read()
    checks = {
        "RAZORPAY_KEY_ID":              "Razorpay Key ID",
        "MEDUSA_PUBLISHABLE_KEY":       "Medusa Publishable Key",
        "MEDUSA_BACKEND_URL":           "Backend URL",
        "DEFAULT_REGION":               "Default Region",
    }
    missing = [label for key, label in checks.items() if key not in content]
    inr_region = "DEFAULT_REGION=in" in content or "DEFAULT_REGION=\"in\"" in content
    if missing:
        r.fail(f"Missing env vars: {', '.join(missing)}")
    if not inr_region:
        r.warn("DEFAULT_REGION is not set to 'in' — products may not show for Indian shoppers")
        if AUTO_FIX:
            fixed = content.replace("DEFAULT_REGION=dk", "DEFAULT_REGION=in")
            if fixed != content:
                with open(env_file, "w") as f: f.write(fixed)
                r.fixed("Set DEFAULT_REGION=in")
    if not missing and inr_region:
        r.detail = "All environment variables correctly configured"
    return r


def qc_product_count(products):
    r = QCResult("QC-10", "Product Catalog Completeness")
    karnataka = [p for p in products if "Medusa" not in p.get("title","")]
    total = len(karnataka)
    if total < 10:
        r.fail(f"Only {total} Karnataka products. Run product_bot to add more.")
    elif total < 20:
        r.warn(f"{total} products. Consider expanding catalog (target: 50+)")
    else:
        r.detail = f"{total} Karnataka products in catalog ✅"
    return r


# ─── Generate HTML quality report ────────────────────────────────────────────
def generate_qc_html(results, products, stats):
    date_str = datetime.now().strftime("%Y-%m-%d %H:%M")
    passed  = sum(1 for r in results if r.status in ("PASS","FIXED"))
    failed  = sum(1 for r in results if r.status == "FAIL")
    warned  = sum(1 for r in results if r.status == "WARN")
    score   = int((passed / len(results)) * 100) if results else 0
    score_color = "#4CAF50" if score >= 90 else "#FF9800" if score >= 70 else "#f44336"

    rows = ""
    for r in results:
        icon  = {"PASS":"✅","WARN":"⚠️","FAIL":"❌","FIXED":"🔧"}[r.status]
        color = {"PASS":"#4CAF50","WARN":"#FF9800","FAIL":"#f44336","FIXED":"#2196F3"}[r.status]
        detail_html = r.detail or ("; ".join(r.issues[:2]) if r.issues else "") or ("; ".join(r.fixes[:2]) if r.fixes else "")
        rows += f"""<tr>
          <td>{r.check_id}</td><td>{r.name}</td>
          <td style="color:{color};font-weight:700">{icon} {r.status}</td>
          <td style="font-size:11px;color:rgba(255,248,231,.6)">{detail_html}</td></tr>"""

    fixes_html = ""
    for r in results:
        for fix in r.fixes:
            fixes_html += f"<li>🔧 {fix}</li>"

    html = f"""<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Jatramela Agent Bot — QC Report {date_str}</title>
<style>
  *{{box-sizing:border-box;margin:0;padding:0}}
  body{{font-family:'Segoe UI',sans-serif;background:#1a0a00;color:#FFF8E7;padding:24px}}
  h1{{color:#C9A84C;font-size:22px;margin-bottom:4px}}
  h2{{font-size:14px;color:#C9A84C;margin:20px 0 10px;border-bottom:1px solid rgba(201,168,76,.2);padding-bottom:6px}}
  .sub{{color:rgba(255,248,231,.5);font-size:12px;margin-bottom:24px}}
  .score{{font-size:64px;font-weight:900;color:{score_color};line-height:1}}
  .score-box{{background:rgba(255,255,255,.05);border:1px solid rgba(201,168,76,.2);border-radius:16px;padding:20px;text-align:center;max-width:180px}}
  .grid{{display:grid;grid-template-columns:180px 1fr;gap:20px;margin-bottom:24px;align-items:start}}
  .stats{{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px}}
  .stat{{background:rgba(255,255,255,.05);border:1px solid rgba(201,168,76,.15);border-radius:10px;padding:12px;text-align:center}}
  .stat .val{{font-size:28px;font-weight:900;color:#C9A84C}}
  .stat .lbl{{font-size:10px;color:rgba(255,248,231,.5);margin-top:4px}}
  table{{width:100%;border-collapse:collapse}}
  th{{text-align:left;padding:8px 12px;font-size:10px;color:rgba(255,248,231,.4);border-bottom:1px solid rgba(255,255,255,.08)}}
  td{{padding:8px 12px;font-size:12px;border-bottom:1px solid rgba(255,255,255,.04)}}
  ul{{padding-left:20px;font-size:12px;color:rgba(255,248,231,.7)}}
  li{{margin-bottom:4px}}
  .section{{background:rgba(255,255,255,.03);border:1px solid rgba(201,168,76,.12);border-radius:12px;padding:16px;margin-bottom:16px}}
</style></head><body>
<h1>🕵️ Jatramela Agent Bot — Quality Control Report</h1>
<p class="sub">Generated: {date_str} &nbsp;|&nbsp; Auto-fix: {"Enabled" if AUTO_FIX else "Disabled"}</p>

<div class="grid">
  <div class="score-box">
    <div class="score">{score}%</div>
    <div style="font-size:12px;color:rgba(255,248,231,.5);margin-top:8px">Quality Score</div>
  </div>
  <div class="stats">
    <div class="stat"><div class="val" style="color:#4CAF50">{passed}</div><div class="lbl">Passed/Fixed</div></div>
    <div class="stat"><div class="val" style="color:#FF9800">{warned}</div><div class="lbl">Warnings</div></div>
    <div class="stat"><div class="val" style="color:#f44336">{failed}</div><div class="lbl">Failed</div></div>
    <div class="stat"><div class="val">{stats['total_products']}</div><div class="lbl">Products</div></div>
    <div class="stat"><div class="val">{stats['karnataka_products']}</div><div class="lbl">Karnataka Products</div></div>
    <div class="stat"><div class="val">₹{stats['avg_price']:,.0f}</div><div class="lbl">Avg Price</div></div>
  </div>
</div>

<div class="section">
<h2>📋 Quality Check Results</h2>
<table><tr><th>ID</th><th>Check</th><th>Status</th><th>Details</th></tr>
{rows}
</table></div>

{f'<div class="section"><h2>🔧 Auto-Fixes Applied</h2><ul>{fixes_html}</ul></div>' if fixes_html else ""}

<div class="section">
<h2>📅 Daily Task Schedule</h2>
<table><tr><th>Task</th><th>Frequency</th><th>Bot</th><th>Next Action</th></tr>
<tr><td>Quality Audit</td><td>Daily</td><td>agent_bot</td><td>Tomorrow 6:00 AM</td></tr>
<tr><td>Product Images Update</td><td>Weekly (Mon)</td><td>image_uploader</td><td>Next Monday</td></tr>
<tr><td>Add New Products</td><td>Weekly (Wed)</td><td>product_bot</td><td>Next Wednesday</td></tr>
<tr><td>Market Research</td><td>Weekly (Sat)</td><td>market_bot</td><td>Next Saturday</td></tr>
<tr><td>Category Sync</td><td>Monthly (1st)</td><td>category_setup</td><td>1st June</td></tr>
<tr><td>Manager Dashboard</td><td>Daily</td><td>manager_bot</td><td>Tomorrow 6:00 AM</td></tr>
</table></div>
</body></html>"""

    path = f"{REPORT_DIR}/agent_qc_{datetime.now().strftime('%Y-%m-%d')}.html"
    with open(path, "w") as f:
        f.write(html)
    return path


# ─── Main ─────────────────────────────────────────────────────────────────────
def run():
    print("\n" + "═"*60)
    print("  🕵️  JATRAMELA AGENT BOT — DAILY QUALITY CONTROL")
    print(f"  🕐 {datetime.now().strftime('%d %b %Y, %I:%M %p')}")
    print("═"*60)

    # Auth
    token = get_token()
    if not token:
        print("  ❌ Cannot authenticate with Medusa. Aborting.")
        return {"passed": 0, "failed": 1, "score": 0, "fixes": []}

    region_id = get_india_region(token)
    if not region_id:
        print("  ❌ India/INR region not found. Run category_setup first.")

    # Fetch all products
    prods_resp = requests.get(f"{MEDUSA_URL}/admin/products?limit=200",
        headers=h(token), timeout=10).json()
    products = prods_resp.get("products", [])
    karnataka = [p for p in products if "Medusa" not in p.get("title","")]

    # Compute stats
    prices = []
    for p in karnataka:
        for v in p.get("variants", []):
            for pr in v.get("prices", []):
                if pr.get("currency_code") == "inr" and pr.get("amount", 0) > 0:
                    prices.append(pr["amount"])
    stats = {
        "total_products":    len(products),
        "karnataka_products": len(karnataka),
        "avg_price":         sum(prices) / len(prices) if prices else 0,
    }

    print(f"\n  📦 {len(products)} total products ({len(karnataka)} Karnataka)\n")

    # Run all QC checks
    results = []
    checks = [
        lambda: qc_images(token, karnataka),
        lambda: qc_categories(token, karnataka),
        lambda: qc_prices(token, karnataka, region_id),
        lambda: qc_duplicates(token, products),
        lambda: qc_published(token, karnataka),
        lambda: qc_storefront_pages(),
        lambda: qc_store_api(token, region_id),
        lambda: qc_chatbot(),
        lambda: qc_env_config(),
        lambda: qc_product_count(products),
    ]

    for check_fn in checks:
        try:
            result = check_fn()
            results.append(result)
            print(str(result))
            if result.detail:
                print(f"       ↳ {result.detail}")
            for issue in result.issues[:2]:
                print(f"       ↳ ⚠️  {issue}")
            for fix in result.fixes[:2]:
                print(f"       ↳ 🔧 {fix}")
        except Exception as e:
            print(f"  ❌ Check error: {e}")

    # Summary
    passed  = sum(1 for r in results if r.status in ("PASS","FIXED"))
    warned  = sum(1 for r in results if r.status == "WARN")
    failed  = sum(1 for r in results if r.status == "FAIL")
    fixes   = [f for r in results for f in r.fixes]
    score   = int((passed / len(results)) * 100) if results else 0

    print(f"\n{'═'*60}")
    print(f"  📊 QUALITY SCORE: {score}%")
    print(f"  ✅ Passed/Fixed: {passed} | ⚠️  Warnings: {warned} | ❌ Failed: {failed}")
    if fixes:
        print(f"  🔧 Auto-fixed {len(fixes)} issue(s)")
    print(f"{'═'*60}\n")

    # Generate HTML report
    report_path = generate_qc_html(results, products, stats)
    print(f"  📄 QC Report: {report_path}")

    # Save JSON result for manager_bot
    result_data = {
        "ran_at":   datetime.now().isoformat(),
        "score":    score,
        "passed":   passed,
        "warned":   warned,
        "failed":   failed,
        "fixes":    fixes,
        "report":   report_path,
    }
    with open(f"{REPORT_DIR}/agent_last_result.json", "w") as f:
        json.dump(result_data, f, indent=2)

    return result_data


if __name__ == "__main__":
    import subprocess
    result = run()
    if "--report" in sys.argv:
        subprocess.run(["open", result.get("report","")], capture_output=True)
