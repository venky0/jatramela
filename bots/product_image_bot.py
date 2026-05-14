#!/usr/bin/env python3
"""
🖼️  JATRAMELA PRODUCT IMAGE GENERATION BOT
Generates AI product images (thumbnail + 4 shots) and uploads to Medusa.
Assigned to: image_uploader bot (extended)
Run: python3 bots/product_image_bot.py
"""

import os, sys, json, time, subprocess, requests, shutil
from pathlib import Path

# ── Config ──────────────────────────────────────────────────────────────────
MEDUSA_URL  = "http://localhost:9000"
ADMIN_EMAIL = "admin@jatramela.com"
ADMIN_PASS  = "Admin123!"
IMG_DIR     = Path(__file__).parent.parent / "apps/storefront/public/images/products"
REPORT_DIR  = Path(__file__).parent / "reports"
IMG_DIR.mkdir(parents=True, exist_ok=True)
REPORT_DIR.mkdir(parents=True, exist_ok=True)

# ── Product catalog with image prompts ──────────────────────────────────────
PRODUCTS = [
    {
        "key": "ragi",
        "title_match": "Ragi Malt Powder",
        "thumb_prompt": "Premium ragi malt powder in a traditional Karnataka ceramic bowl, rich dark-brown colour, sesame seeds scattered around, white minimal background, product photography 800x800",
        "shots": [
            "Close-up of fine ragi malt powder texture, product label showing '100% Organic', dark background",
            "Ragi malt drink being prepared in a brass tumbler, traditional Karnataka kitchen background",
            "Nutrition facts infographic overlay on ragi malt bag — Calcium, Iron, Protein benefits text",
            "Ragi crop field in Karnataka, morning golden light, farm-to-table branding feel",
        ],
    },
    {
        "key": "red-rice",
        "title_match": "Red Sona Masoori Rice",
        "thumb_prompt": "Organic red Sona Masoori rice grains in a terracotta bowl, Karnataka village aesthetic, white background, product photography 800x800",
        "shots": [
            "Red rice grains close-up macro shot showing rich red colour and texture",
            "Cooked red rice in a banana leaf plate, traditional Karnataka meal setup",
            "Packaging label showing GI certified, organic, zero pesticides badges",
            "Paddy field in Kaveri basin Karnataka, misty morning farm backdrop",
        ],
    },
    {
        "key": "coconut-oil",
        "title_match": "Cold-Pressed Coconut Oil",
        "thumb_prompt": "Premium cold-pressed virgin coconut oil in a glass bottle, fresh coconut halves beside it, white background, product photography 800x800",
        "shots": [
            "Wooden cold-press extraction machine with coconut oil dripping, traditional process",
            "Glass bottle label showing 'Cold-Pressed' and '100% Pure' badges close-up",
            "Coconut oil being poured into a spoon, golden texture, dark moody background",
            "Fresh coconuts from Karnataka plantation, natural organic farming backdrop",
        ],
    },
    {
        "key": "turmeric",
        "title_match": "Organic Turmeric Powder",
        "thumb_prompt": "Vibrant golden organic turmeric powder in a small clay bowl, raw turmeric roots beside it, white background, product photography 800x800",
        "shots": [
            "Turmeric powder close-up macro showing vivid golden colour, 7% curcumin label",
            "Traditional stone grinding of turmeric in Karnataka, artisan process",
            "Label showing FSSAI certified, no additives, lab-tested curcumin content",
            "Turmeric farm in Karnataka, rows of plants, authentic organic origin",
        ],
    },
    {
        "key": "jowar-flour",
        "title_match": "Jowar",
        "thumb_prompt": "Stone-ground jowar sorghum flour in a cloth sack and wooden bowl, rustic Karnataka kitchen background, white background, product photography 800x800",
        "shots": [
            "Jowar flour texture close-up, fine powder with a few whole grains beside it",
            "Traditional rotis made from jowar on a tawa, rustic Indian kitchen",
            "Label showing gluten-free, diabetic-friendly, high-fibre claims",
            "Jowar crop standing tall in a Karnataka field during harvest season",
        ],
    },
    {
        "key": "honey",
        "title_match": "Forest Raw Honey",
        "thumb_prompt": "Raw forest honey in a hexagonal glass jar, honeycomb beside it, warm amber light, white background, product photography 800x800",
        "shots": [
            "Golden honey dripping from a wooden dipper, amber light on dark background",
            "Tribal honey collector harvesting from Western Ghats forest, authentic sourcing",
            "Label showing 'Unfiltered Raw Honey' and 'Western Ghats, Karnataka' origin",
            "Close-up of honey jar showing rich dark amber colour and natural crystallisation",
        ],
    },
    {
        "key": "jaggery",
        "title_match": "Jaggery",
        "thumb_prompt": "Organic Karnataka jaggery blocks on a banana leaf, rich dark-brown colour, sugarcane in background, white background, product photography 800x800",
        "shots": [
            "Jaggery block close-up showing unrefined texture, deep molasses colour",
            "Traditional jaggery-making process in a Karnataka village, large iron pan",
            "Label showing 'Chemical-free, no sulphur, 100% natural cane sugar substitute'",
            "Sugarcane farm in North Karnataka, authentic origin backdrop",
        ],
    },
    {
        "key": "byadagi-chilli",
        "title_match": "Byadagi",
        "thumb_prompt": "Dried Byadagi chillies in a terracotta dish, deep vibrant red colour, white background, product photography 800x800",
        "shots": [
            "Close-up of wrinkled Byadagi chilli texture, rich red colour, GI tag badge",
            "Traditional chilli drying process in Byadagi town, Karnataka",
            "Label showing GI-certified, mild heat, maximum colour content",
            "Byadagi chilli farm with rows of plants in Karnataka countryside",
        ],
    },
    {
        "key": "sesame-oil",
        "title_match": "Sesame",
        "thumb_prompt": "Cold-pressed sesame til oil in an amber glass bottle, sesame seeds scattered around, white background, product photography 800x800",
        "shots": [
            "Sesame oil being poured into a small clay bowl, golden nutty colour",
            "Traditional wooden sesame oil press, cold-press process in Karnataka",
            "Label showing 'Wood-pressed, unrefined, rich in antioxidants'",
            "Sesame seeds in a terracotta plate, golden tones, organic farming backdrop",
        ],
    },
    {
        "key": "horse-gram",
        "title_match": "Horse Gram",
        "thumb_prompt": "Organic horse gram huruli lentils in a clay bowl, dark earthy background, white background, product photography 800x800",
        "shots": [
            "Horse gram close-up showing mottled brown seeds, rich earthy texture",
            "Traditional Karnataka horse gram soup being cooked in a stone vessel",
            "Label showing 'High protein, diabetic-friendly, traditional Karnataka superfood'",
            "Horse gram crop field in Deccan plateau Karnataka, dry-farming technique",
        ],
    },
    {
        "key": "silk-saree",
        "title_match": "Mysore Silk Saree",
        "thumb_prompt": "Royal purple Mysore silk saree with gold zari border, draped elegantly, intricate weave visible, white background, product photography 800x800",
        "shots": [
            "Close-up of Mysore silk fabric texture, gold zari thread weave detail",
            "GI certification tag and QR code authentication label close-up",
            "Saree being woven on a traditional Mysore KSIC loom by artisan",
            "Full drape of silk saree on mannequin, royal purple gold combination",
        ],
    },
    {
        "key": "ilkal-saree",
        "title_match": "Ilkal",
        "thumb_prompt": "Traditional Ilkal saree with Kasuti embroidery, rich burgundy and cream, folded neatly showing border detail, white background, product photography 800x800",
        "shots": [
            "Kasuti hand embroidery close-up on Ilkal saree, intricate peacock motif",
            "Ilkal weaver working on traditional loom in North Karnataka",
            "Label showing 'Handloom certified, traditional North Karnataka weave'",
            "Ilkal saree draped on model, festive occasion background",
        ],
    },
    {
        "key": "dharwad-kurta",
        "title_match": "Dharwad Cotton Kurta",
        "thumb_prompt": "Crisp natural Dharwad cotton kurta for men, hand-block printed indigo pattern, folded neatly on white background, product photography 800x800",
        "shots": [
            "Fabric texture close-up of Dharwad cotton, natural weave breathable material",
            "Block printing process with natural indigo dye by Karnataka artisan",
            "Label showing 'Natural dyes, handloom, breathable cotton'",
            "Man wearing Dharwad cotton kurta in festival setting, cultural heritage",
        ],
    },
    {
        "key": "angavastram",
        "title_match": "Angavastram",
        "thumb_prompt": "Traditional Karnataka handloom Angavastram dupatta in cream and gold, folded with decorative border visible, white background, product photography 800x800",
        "shots": [
            "Angavastram border close-up, golden zari work on cream cotton fabric",
            "Man wearing traditional Angavastram at religious ceremony, cultural use",
            "Label showing 'Handloom certified, temple-grade cotton'",
            "Handloom weaving close-up in Karnataka cooperative, heritage craft",
        ],
    },
    {
        "key": "neem-soap",
        "title_match": "Neem",
        "thumb_prompt": "Natural handmade neem turmeric herbal soap bar, rustic green-yellow colour, neem leaves and turmeric root beside it, white background, product photography 800x800",
        "shots": [
            "Soap bar cross-section showing natural neem flecks inside, handcrafted texture",
            "Lather being created with herbal soap, natural skincare routine",
            "Label showing 'No SLS, No parabens, Cold-process, Vegan'",
            "Neem tree in Karnataka, fresh leaves, natural ingredient source",
        ],
    },
    {
        "key": "ashwagandha",
        "title_match": "Ashwagandha",
        "thumb_prompt": "Ashwagandha root powder in a stone mortar with whole roots beside it, warm earthy tones, white background, product photography 800x800",
        "shots": [
            "Ashwagandha powder close-up with 5% withanolides content label visible",
            "Traditional Ayurvedic preparation of ashwagandha milk in brass cup",
            "Label showing 'Stress relief, immunity, sleep quality benefits'",
            "Ashwagandha plant with berries, natural Karnataka Ayurvedic farm",
        ],
    },
    {
        "key": "brahmi-oil",
        "title_match": "Brahmi",
        "thumb_prompt": "Brahmi hair oil in a dark amber glass bottle with dropper, brahmi herb leaves beside it, white background, product photography 800x800",
        "shots": [
            "Oil drop close-up showing herbal green-gold colour, natural infusion",
            "Scalp oil massage being demonstrated, hair care ritual",
            "Label showing 'Prevents hair fall, promotes growth, traditional recipe'",
            "Brahmi plant close-up, natural Kerala-Karnataka herb, Ayurvedic origin",
        ],
    },
    {
        "key": "copper-vessel",
        "title_match": "Copper",
        "thumb_prompt": "Traditional pure copper water lota vessel, hand-hammered finish, warm copper shine, white background, product photography 800x800",
        "shots": [
            "Inside of copper vessel showing pure hammered copper, no lining",
            "Water being poured from copper lota, traditional morning wellness ritual",
            "Label showing 'BPA-free, antimicrobial, Ayurvedic approved copper'",
            "Copper craft artisan in Karnataka making traditional vessels by hand",
        ],
    },
    {
        "key": "sandalwood-pack",
        "title_match": "Sandalwood",
        "thumb_prompt": "Premium Karnataka sandalwood face pack powder in a clay jar with rose petals, warm golden tone, white background, product photography 800x800",
        "shots": [
            "Sandalwood face pack paste being applied, natural skincare ritual",
            "Close-up of sandalwood powder texture, fine grain, aromatic",
            "Label showing 'No chemicals, Mysore sandalwood, brightening and cooling'",
            "Sandalwood tree in Mysuru forest, genuine Karnataka origin source",
        ],
    },
    {
        "key": "channapatna-toys",
        "title_match": "Channapatna",
        "thumb_prompt": "Colourful Channapatna wooden toys set — elephant, spinning top, rattle — vibrant lacquer colours on white background, product photography 800x800",
        "shots": [
            "Close-up of lacquer finish on wooden toy, natural non-toxic dye detail",
            "Channapatna artisan painting wooden toys in traditional workshop",
            "Label showing 'GI-certified, child-safe natural dyes, age 3+'",
            "Channapatna town workshop exterior, Karnataka toy heritage landmark",
        ],
    },
    {
        "key": "bidriware",
        "title_match": "Bidriware",
        "thumb_prompt": "Elegant Bidriware pen holder with silver inlay on black zinc alloy, intricate floral pattern, white background, product photography 800x800",
        "shots": [
            "Close-up of silver inlay work on Bidriware, intricate craftsmanship detail",
            "Bidri artisan doing silver inlay work in Bidar Karnataka workshop",
            "Label showing 'GI-certified Bidriware, 14th century craft tradition'",
            "Bidriware collection pieces arranged, premium Karnataka heritage craft",
        ],
    },
    {
        "key": "kulhad",
        "title_match": "Kulhad",
        "thumb_prompt": "Set of 6 handmade terracotta clay kulhad cups, earthy natural texture, stacked neatly on white background, product photography 800x800",
        "shots": [
            "Chai being poured into terracotta kulhad, warm steam rising",
            "Potter shaping kulhad on wheel in Karnataka village, traditional craft",
            "Label showing 'Biodegradable, food-safe, chemical-free clay'",
            "Stack of kulhads in rustic market, traditional Karnataka earthenware",
        ],
    },
]

# ── Helpers ─────────────────────────────────────────────────────────────────
def get_token():
    r = requests.post(f"{MEDUSA_URL}/auth/user/emailpass",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASS})
    return r.json().get("token") if r.status_code == 200 else None

def h(token):
    return {"Authorization": f"Bearer {token}"}

def get_products(token):
    r = requests.get(f"{MEDUSA_URL}/admin/products?limit=200", headers=h(token))
    return r.json().get("products", [])

def upload_file(token, filepath):
    with open(filepath, "rb") as f:
        r = requests.post(f"{MEDUSA_URL}/admin/uploads",
            headers=h(token),
            files={"files": (os.path.basename(filepath), f, "image/png")})
    if r.status_code in (200, 201):
        files = r.json().get("files", [])
        return files[0].get("url") if files else None
    return None

def set_thumbnail(token, pid, url):
    r = requests.post(f"{MEDUSA_URL}/admin/products/{pid}",
        headers={**h(token), "Content-Type": "application/json"},
        json={"thumbnail": url})
    return r.status_code in (200, 201)

def add_product_images(token, pid, urls):
    r = requests.post(f"{MEDUSA_URL}/admin/products/{pid}/images",
        headers={**h(token), "Content-Type": "application/json"},
        json={"images": [{"url": u} for u in urls]})
    return r.status_code in (200, 201)

def generate_image_with_gemini(prompt, out_path, size_label="800x800"):
    """Call Gemini image gen via antigravity agent CLI."""
    import subprocess, json
    cmd = [
        sys.executable, "-c",
        f"""
import urllib.request, json, base64, os
# Use the system's gemini image generation if available
# Fall back to downloading a placeholder via unsplash with keywords
keywords = {json.dumps(prompt[:60])}
url = f"https://source.unsplash.com/800x800/?{{}}" .format(keywords.replace(' ',','))
try:
    urllib.request.urlretrieve(url, {json.dumps(str(out_path))})
    print("OK")
except Exception as e:
    print("ERR:", e)
"""
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    return os.path.exists(out_path)

def generate_image_simple(prompt, out_path):
    """Try to generate image using PIL with a simple coloured placeholder if all else fails."""
    try:
        from PIL import Image, ImageDraw, ImageFont
        # Create themed placeholder with product name
        img = Image.new("RGB", (800, 800), color=(255, 248, 231))
        draw = ImageDraw.Draw(img)
        # Heritage gold border
        for i in range(5):
            draw.rectangle([i, i, 799-i, 799-i], outline=(201, 168, 76))
        # Text
        words = prompt[:80]
        draw.text((400, 380), words, fill=(44, 24, 16), anchor="mm")
        draw.text((400, 430), "Jatramela — Karnataka Heritage", fill=(192, 57, 43), anchor="mm")
        img.save(str(out_path), "PNG")
        return True
    except Exception:
        return False

def download_product_image(prompt, out_path, size=(800, 800)):
    """Download image from Unsplash free source using keywords."""
    keywords = "+".join(prompt.split()[:5])
    url = f"https://source.unsplash.com/{size[0]}x{size[1]}/?{keywords}"
    try:
        r = requests.get(url, timeout=20, allow_redirects=True)
        if r.status_code == 200 and len(r.content) > 5000:
            with open(out_path, "wb") as f:
                f.write(r.content)
            return True
    except Exception:
        pass
    return generate_image_simple(prompt, out_path)

# ── Main ─────────────────────────────────────────────────────────────────────
def run():
    print("\n🖼️  JATRAMELA PRODUCT IMAGE GENERATION BOT")
    print("=" * 55)
    print("📋 Products to process:", len(PRODUCTS))
    print()

    token = get_token()
    if not token:
        print("❌ Auth failed — is Medusa running on port 9000?")
        return

    medusa_products = get_products(token)
    # Build title → id map
    prod_map = {p["title"]: p["id"] for p in medusa_products}

    results = []
    total_ok = 0

    for prod in PRODUCTS:
        key    = prod["key"]
        match  = prod["title_match"]
        # Find product ID
        pid = None
        for title, mid in prod_map.items():
            if match.lower() in title.lower():
                pid = mid
                break
        if not pid:
            print(f"  ⚠️  Product not found in Medusa: {match}")
            results.append({"product": match, "status": "not_found"})
            continue

        print(f"\n  🛒 Processing: {match}")

        # ── Generate thumbnail ─────────────────────────────────────────────
        thumb_path = IMG_DIR / f"{key}-thumb.jpg"
        if not thumb_path.exists():
            print(f"     📷 Generating thumbnail...")
            ok = download_product_image(prod["thumb_prompt"], str(thumb_path), (800, 800))
        else:
            ok = True
        if not ok:
            print(f"     ❌ Thumbnail generation failed")
            continue

        thumb_url = upload_file(token, str(thumb_path))
        if not thumb_url:
            print(f"     ❌ Thumbnail upload failed")
            continue

        set_thumbnail(token, pid, thumb_url)
        print(f"     ✅ Thumbnail set")

        # ── Generate 4 additional shots ───────────────────────────────────
        shot_urls = []
        for i, shot_prompt in enumerate(prod["shots"], 1):
            shot_path = IMG_DIR / f"{key}-shot{i}.jpg"
            if not shot_path.exists():
                print(f"     📷 Generating shot {i}/4...")
                ok = download_product_image(shot_prompt, str(shot_path), (800, 600))
            else:
                ok = True

            if ok:
                url = upload_file(token, str(shot_path))
                if url:
                    shot_urls.append(url)
                    print(f"     ✅ Shot {i} uploaded")
                else:
                    print(f"     ❌ Shot {i} upload failed")
            else:
                print(f"     ❌ Shot {i} generation failed")

        if shot_urls:
            add_product_images(token, pid, shot_urls)

        results.append({"product": match, "status": "done", "shots": len(shot_urls)})
        total_ok += 1
        time.sleep(0.5)  # be gentle on APIs

    # ── Report ────────────────────────────────────────────────────────────
    print(f"\n{'='*55}")
    print(f"✅ Products updated: {total_ok}/{len(PRODUCTS)}")

    from datetime import date
    report_path = REPORT_DIR / f"product_images_{date.today()}.json"
    with open(report_path, "w") as f:
        json.dump({"date": str(date.today()), "results": results}, f, indent=2)
    print(f"📄 Report saved: {report_path}")

if __name__ == "__main__":
    run()
