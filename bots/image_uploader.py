#!/usr/bin/env python3
"""
🖼️  JATRAMELA PRODUCT IMAGE UPLOAD BOT (v2)
Maps generated images to products and uploads thumbnail + extra shots to Medusa.
Run: python3 bots/image_uploader.py
"""

import os, json, time, requests
from pathlib import Path
from datetime import date

MEDUSA_URL  = "http://localhost:9000"
ADMIN_EMAIL = "admin@jatramela.com"
ADMIN_PASS  = "Admin123!"

BASE   = Path(__file__).parent.parent / "apps/storefront/public/images"
PROD   = BASE / "products"   # AI-generated specific product images
LEGACY = BASE                # Fallback generic category images

# ── Image map: title keyword → (thumb_path, [shot_paths]) ──────────────────
def img(name):
    """Return path if exists, else None."""
    p = PROD / name
    return str(p) if p.exists() else None

def cat(name):
    p = LEGACY / name
    return str(p) if p.exists() else None

IMAGE_MAP = {
    "Ragi Malt":         (img("ragi-thumb.jpg"),         [cat("karnataka-food.png")] * 2),
    "Red Sona":          (img("red-rice-thumb.jpg"),      [cat("karnataka-food.png")] * 2),
    "Cold-Pressed Coco": (img("coconut-oil-thumb.jpg"),   [cat("karnataka-food.png")] * 2),
    "Organic Turmeric":  (img("turmeric-thumb.jpg"),      [cat("karnataka-food.png")] * 2),
    "Jowar":             (cat("karnataka-food.png"),       [cat("karnataka-food.png")]),
    "Forest Raw Honey":  (img("honey-thumb.jpg"),         [cat("karnataka-food.png")] * 2),
    "Organic Jaggery":   (cat("karnataka-food.png"),      [cat("karnataka-food.png")]),
    "Byadagi":           (cat("karnataka-food.png"),      [cat("karnataka-food.png")]),
    "Sesame":            (cat("karnataka-food.png"),      [cat("karnataka-food.png")]),
    "Horse Gram":        (cat("karnataka-food.png"),      [cat("karnataka-food.png")]),
    "Mysore Silk":       (img("silk-saree-thumb.jpg"),    [cat("karnataka-clothing.png")] * 2),
    "Ilkal":             (cat("karnataka-clothing.png"),  [cat("karnataka-clothing.png")]),
    "Dharwad Cotton":    (cat("karnataka-clothing.png"),  [cat("karnataka-clothing.png")]),
    "Angavastram":       (cat("karnataka-clothing.png"),  [cat("karnataka-clothing.png")]),
    "Neem":              (img("neem-thumb.jpg"),          [cat("karnataka-wellness.png")] * 2),
    "Ashwagandha":       (img("ashwagandha-thumb.jpg"),   [cat("karnataka-wellness.png")] * 2),
    "Brahmi":            (cat("karnataka-wellness.png"),  [cat("karnataka-wellness.png")]),
    "Copper":            (cat("karnataka-wellness.png"),  [cat("karnataka-wellness.png")]),
    "Sandalwood":        (cat("karnataka-wellness.png"),  [cat("karnataka-wellness.png")]),
    "Channapatna":       (img("channapatna-thumb.jpg"),   [cat("karnataka-handicrafts.png")] * 2),
    "Bidriware":         (cat("karnataka-handicrafts.png"),[cat("karnataka-handicrafts.png")]),
    "Kulhad":            (cat("karnataka-handicrafts.png"),[cat("karnataka-handicrafts.png")]),
}

def get_token():
    r = requests.post(f"{MEDUSA_URL}/auth/user/emailpass",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASS})
    return r.json().get("token") if r.status_code == 200 else None

def hdr(token):
    return {"Authorization": f"Bearer {token}"}

def upload_file(token, path):
    if not path or not os.path.exists(path):
        return None
    with open(path, "rb") as f:
        mime = "image/jpeg" if path.endswith((".jpg",".jpeg")) else "image/png"
        r = requests.post(f"{MEDUSA_URL}/admin/uploads",
            headers=hdr(token),
            files={"files": (os.path.basename(path), f, mime)})
    if r.status_code in (200, 201):
        files = r.json().get("files", [])
        return files[0].get("url") if files else None
    return None

def set_thumbnail(token, pid, url):
    r = requests.post(f"{MEDUSA_URL}/admin/products/{pid}",
        headers={**hdr(token), "Content-Type": "application/json"},
        json={"thumbnail": url})
    return r.status_code in (200, 201)

def set_images(token, pid, urls):
    r = requests.post(f"{MEDUSA_URL}/admin/products/{pid}/images",
        headers={**hdr(token), "Content-Type": "application/json"},
        json={"images": [{"url": u} for u in urls]})
    return r.status_code in (200, 201)

def find_entry(title):
    for kw, val in IMAGE_MAP.items():
        if kw.lower() in title.lower():
            return val
    return (None, [])

def run():
    print("\n🖼️  JATRAMELA IMAGE UPLOADER BOT v2")
    print("=" * 50)

    token = get_token()
    if not token:
        print("❌ Auth failed — is Medusa running?")
        return

    products = requests.get(f"{MEDUSA_URL}/admin/products?limit=200",
                            headers=hdr(token)).json().get("products", [])
    print(f"📦 Found {len(products)} products\n")

    ok_count = 0
    results  = []

    for prod in products:
        pid, title = prod["id"], prod["title"]
        thumb_path, shot_paths = find_entry(title)

        if not thumb_path:
            print(f"  ⚠️  No image for: {title}")
            results.append({"title": title, "status": "no_image"})
            continue

        print(f"  🛒 {title}")

        # Upload thumbnail (force replace)
        thumb_url = upload_file(token, thumb_path)
        if thumb_url and set_thumbnail(token, pid, thumb_url):
            print(f"     ✅ Thumbnail set")
        else:
            print(f"     ❌ Thumbnail failed")
            results.append({"title": title, "status": "thumb_failed"})
            continue

        # Upload extra shots
        shot_urls = []
        for sp in shot_paths:
            u = upload_file(token, sp)
            if u:
                shot_urls.append(u)
        if shot_urls:
            set_images(token, pid, shot_urls)
            print(f"     ✅ {len(shot_urls)} extra shot(s) added")

        ok_count += 1
        results.append({"title": title, "status": "done", "shots": len(shot_urls)})
        time.sleep(0.3)

    print(f"\n{'='*50}")
    print(f"✅ Updated: {ok_count}/{len(products)} products")

    rpt = Path(__file__).parent / "reports" / f"image_upload_{date.today()}.json"
    rpt.parent.mkdir(exist_ok=True)
    with open(rpt, "w") as f:
        json.dump({"date": str(date.today()), "results": results}, f, indent=2)
    print(f"📄 Report: {rpt}")

if __name__ == "__main__":
    run()
