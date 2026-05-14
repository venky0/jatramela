#!/usr/bin/env python3
"""
🏪 JATRAMELA CATEGORY SETUP + PRODUCT ASSIGNMENT BOT
Creates Karnataka product categories and assigns all products to them.
Run: python3 bots/category_setup.py
"""
import requests, time

MEDUSA_URL  = "http://localhost:9000"
ADMIN_EMAIL = "admin@jatramela.com"
ADMIN_PASS  = "Admin123!"

# Category definitions
CATEGORIES = [
    {"name": "Organic Food",     "handle": "organic",      "description": "Certified organic Karnataka farm products — millets, rice, oils, spices, honey, and traditional superfoods."},
    {"name": "Clothing",         "handle": "clothing",     "description": "Authentic Karnataka handloom textiles — Mysore silk sarees, Ilkal weaves, Dharwad cotton, and traditional Indian clothing."},
    {"name": "Wellness",         "handle": "wellness",     "description": "Ayurvedic wellness products — herbal powders, natural soaps, traditional oils, and copper vessels from Karnataka."},
    {"name": "Handicrafts",      "handle": "handicrafts",  "description": "GI-certified Karnataka handicrafts — Channapatna toys, Bidriware, terracotta pottery, and traditional artisan items."},
]

# Keyword → category handle mapping
PRODUCT_CATEGORY_MAP = {
    "organic":     ["Ragi","Rice","Coconut Oil","Turmeric","Jowar","Honey","Jaggery","Chilli","Sesame","Horse Gram"],
    "clothing":    ["Saree","Kurta","Angavastram","Ilkal","Silk","Mysore Silk"],
    "wellness":    ["Soap","Ashwagandha","Brahmi","Copper","Sandalwood"],
    "handicrafts": ["Channapatna","Bidriware","Kulhad","Terracotta"],
}

def get_token():
    r = requests.post(f"{MEDUSA_URL}/auth/user/emailpass",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASS})
    return r.json().get("token")

def h(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

def create_category(token, cat):
    # Check if already exists
    r = requests.get(f"{MEDUSA_URL}/admin/product-categories?handle={cat['handle']}", headers=h(token))
    existing = r.json().get("product_categories", [])
    if existing:
        print(f"  ⏭️  Exists: {cat['name']} ({existing[0]['id']})")
        return existing[0]["id"]
    
    r = requests.post(f"{MEDUSA_URL}/admin/product-categories",
        headers=h(token),
        json={"name": cat["name"], "handle": cat["handle"], "description": cat["description"], "is_active": True})
    
    if r.status_code in (200, 201):
        cat_id = r.json().get("product_category", {}).get("id")
        print(f"  ✅ Created: {cat['name']} ({cat_id})")
        return cat_id
    else:
        print(f"  ❌ Failed: {cat['name']} — {r.text[:100]}")
        return None

def find_category_for_product(title, cat_ids):
    """Find which category a product belongs to based on title keywords."""
    for handle, keywords in PRODUCT_CATEGORY_MAP.items():
        for kw in keywords:
            if kw.lower() in title.lower():
                return cat_ids.get(handle)
    return None

def assign_product_to_category(token, product_id, category_id):
    r = requests.post(f"{MEDUSA_URL}/admin/products/{product_id}",
        headers=h(token),
        json={"categories": [{"id": category_id}]})
    return r.status_code in (200, 201)

def run():
    print("\n🏪 JATRAMELA CATEGORY SETUP BOT")
    print("=" * 50)
    
    token = get_token()
    if not token:
        print("❌ Auth failed"); return

    # Step 1: Create categories
    print("\n📁 Creating Karnataka categories...")
    cat_ids = {}
    for cat in CATEGORIES:
        cid = create_category(token, cat)
        if cid:
            cat_ids[cat["handle"]] = cid
        time.sleep(0.3)

    print(f"\n✅ Categories ready: {list(cat_ids.keys())}")

    # Step 2: Get all products
    r = requests.get(f"{MEDUSA_URL}/admin/products?limit=100", headers=h(token))
    products = r.json().get("products", [])
    print(f"\n📦 Assigning {len(products)} products to categories...")

    assigned = 0
    skipped  = 0
    unmatched = []

    for prod in products:
        pid   = prod["id"]
        title = prod["title"]

        # Skip if already has categories
        if prod.get("categories") and len(prod["categories"]) > 0:
            # Check if it's a real Karnataka category (not default ones)
            existing_handles = [c.get("handle","") for c in prod["categories"]]
            if any(h_ in ["organic","clothing","wellness","handicrafts"] for h_ in existing_handles):
                print(f"  ⏭️  Already assigned: {title}")
                skipped += 1
                continue

        cat_id = find_category_for_product(title, cat_ids)
        if not cat_id:
            print(f"  ⚠️  No category match: {title}")
            unmatched.append(title)
            continue

        ok = assign_product_to_category(token, pid, cat_id)
        if ok:
            # Find category name
            cat_name = next((c["name"] for c in CATEGORIES if cat_ids.get(c["handle"]) == cat_id), "?")
            print(f"  ✅ {title} → {cat_name}")
            assigned += 1
        else:
            print(f"  ❌ Failed: {title}")
        time.sleep(0.2)

    print(f"\n{'='*50}")
    print(f"✅ Assigned:  {assigned}")
    print(f"⏭️  Skipped:   {skipped}")
    print(f"⚠️  Unmatched: {len(unmatched)}")
    if unmatched:
        print(f"   → {', '.join(unmatched[:5])}")
    print("\n🎉 Category setup complete! Visit /store or /categories/organic to verify.\n")

if __name__ == "__main__":
    run()
