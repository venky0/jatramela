#!/usr/bin/env python3
"""
🌾 JATRAMELA PRODUCT RESEARCH BOT
Automatically populates Medusa with Karnataka traditional products.
Run: python3 product_bot.py
"""
import requests, json, time, random, os
from datetime import datetime

MEDUSA_URL = "http://localhost:9000"
ADMIN_EMAIL = "admin@jatramela.com"
ADMIN_PASS  = "Admin123!"

# ── Curated Karnataka product database ──────────────────────────────────────
PRODUCTS = [
  # ORGANIC FOODS
  {"title":"Ragi Malt Powder","subtitle":"Traditional Karnataka Superfood","description":"Stone-ground finger millet from Hassan district. Rich in calcium (3x milk), iron, and fibre. Mix with warm water or milk. Ideal for diabetes management, bone health, and weight loss. Sourced from certified organic farmers. 500g pack.","price":249,"category":"organic-food","tags":["ragi","millet","superfood","calcium","organic"],"weight":500},
  {"title":"Red Sona Masoori Rice","subtitle":"Traditional Unpolished Karnataka Rice","description":"Heirloom red rice variety from Kaveri basin. Unpolished, retaining bran layer with 3x more nutrition than white rice. Rich in antioxidants, lowers blood sugar, supports heart health. 1kg pack.","price":189,"category":"organic-food","tags":["rice","red-rice","unpolished","heirloom","organic"],"weight":1000},
  {"title":"Cold-Pressed Coconut Oil","subtitle":"Wooden-Press Virgin Coconut Oil","description":"Traditional wooden-press extracted virgin coconut oil from coastal Karnataka. Zero heat applied — retains all MCTs and lauric acid. Ideal for cooking, hair, and skin. 500ml glass bottle.","price":399,"category":"organic-food","tags":["coconut-oil","cold-pressed","virgin","MCT","cooking"],"weight":600},
  {"title":"Organic Turmeric Powder","subtitle":"High-Curcumin Karnataka Turmeric","description":"Lakadong-variety turmeric grown in Kodagu district. 7%+ curcumin content (3x normal turmeric). No fillers, no additives. Anti-inflammatory, immunity booster, natural antiseptic. 200g.","price":149,"category":"organic-food","tags":["turmeric","curcumin","spice","anti-inflammatory","organic"],"weight":200},
  {"title":"Jowar (Sorghum) Flour","subtitle":"Ancient Grain Superfood Flour","description":"Stone-ground jowar from Bidar district. Gluten-free ancient grain, high in protein and fibre. Lower GI than wheat — ideal for diabetics. Use for bhakri, rotis, and baked goods. 1kg.","price":129,"category":"organic-food","tags":["jowar","sorghum","gluten-free","flour","diabetes"],"weight":1000},
  {"title":"Forest Raw Honey","subtitle":"Single-Origin Karnataka Forest Honey","description":"Raw, unfiltered honey harvested by tribal communities from Western Ghats forests. Never heated. Contains natural pollen, propolis, and enzymes. 500g ceramic jar.","price":549,"category":"organic-food","tags":["honey","raw","forest","western-ghats","unfiltered"],"weight":700},
  {"title":"Organic Jaggery Blocks","subtitle":"Traditional Cane Jaggery from Mandya","description":"Unrefined sugarcane jaggery from Mandya — Karnataka's sugar bowl. Made in traditional iron vessels without chemicals. Rich in iron and minerals. Replaces refined sugar. 500g.","price":89,"category":"organic-food","tags":["jaggery","sugarcane","mandya","unrefined","iron"],"weight":500},
  {"title":"Dried Red Byadagi Chilli","subtitle":"Karnataka's Signature Chilli","description":"Authentic Byadagi chilli from Haveri district — GI certified. Known for deep red colour and mild heat. Essential in Karnataka cuisine — use for sambhar, curries, and chutneys. 200g.","price":179,"category":"organic-food","tags":["chilli","byadagi","GI","spice","Karnataka"],"weight":200},
  {"title":"Sesame (Til) Oil","subtitle":"Traditional Cold-Pressed Sesame Oil","description":"Cold-pressed black sesame oil from Kalaburagi district. Rich in sesamol and sesamin antioxidants. Used for oil pulling, cooking, and Ayurvedic massage. 500ml.","price":349,"category":"organic-food","tags":["sesame","til","cold-pressed","oil","ayurvedic"],"weight":600},
  {"title":"Horse Gram (Huruli) Whole","subtitle":"Karnataka's Protein Powerhouse","description":"Organic whole horse gram (huruli kaalu) — a traditional Karnataka superfood. Highest protein content among legumes. Dissolves kidney stones, manages diabetes, aids weight loss. 500g.","price":99,"category":"organic-food","tags":["horsegram","huruli","protein","legume","weight-loss"],"weight":500},

  # CLOTHING
  {"title":"Mysore Silk Saree — Royal Purple","subtitle":"Pure Silk GI Certified Handwoven","description":"Authentic Mysore silk saree in royal purple with gold zari border. Woven by government-certified weavers at Mysore Silk Factory. GI certified. 6.3 metres. Comes with care card and wooden box.","price":4999,"category":"clothing","tags":["mysore-silk","saree","GI","zari","handwoven"],"weight":800},
  {"title":"Ilkal Saree — Traditional Kasuti","subtitle":"North Karnataka Heritage Weave","description":"Handwoven Ilkal saree from Bagalkot with traditional Kasuti embroidery. Characteristic tope teni pallu and chikki paras border. Cotton-silk blend. Certified GI product. 5.5 metres.","price":2499,"category":"clothing","tags":["ilkal","kasuti","saree","handwoven","GI"],"weight":600},
  {"title":"Dharwad Cotton Kurta — Men","subtitle":"Handloom Pure Cotton Traditional Kurta","description":"Breathable handloom cotton kurta from Dharwad, in natural indigo dye. Perfect for daily wear — keeps cool in Karnataka heat. Comes with matching pyjama. Sizes S to XXL.","price":899,"category":"clothing","tags":["cotton","kurta","handloom","dharwad","men"],"weight":400},
  {"title":"Traditional Angavastram (Dupatta)","subtitle":"Pure Cotton Handwoven Stole","description":"Handwoven cotton angavastram with temple-motif border. Traditional South Indian style worn by men for puja and formal occasions. Natural plant dyes. 2.5 metres.","price":499,"category":"clothing","tags":["angavastram","dupatta","cotton","handloom","temple"],"weight":200},

  # WELLNESS
  {"title":"Neem & Turmeric Herbal Soap","subtitle":"100% Natural Handcrafted Ayurvedic Soap","description":"Cold-process handcrafted soap with neem leaf powder, turmeric, and coconut oil base. No SLS, no parabens, no synthetic fragrance. Treats acne, fungal infections, and pigmentation. 100g.","price":89,"category":"wellness","tags":["neem","turmeric","soap","handmade","ayurvedic"],"weight":120},
  {"title":"Ashwagandha Root Powder","subtitle":"Pure Withania Somnifera — Stress Relief","description":"Organic ashwagandha root powder from certified farms. KSM-66 standard — 5%+ withanolides. Reduces cortisol, improves sleep, boosts testosterone and immunity. 200g.","price":299,"category":"wellness","tags":["ashwagandha","adaptogen","stress","sleep","immunity"],"weight":250},
  {"title":"Brahmi Hair Oil","subtitle":"Traditional Ayurvedic Brain Tonic Hair Oil","description":"Traditional Brahmi (Bacopa monnieri) infused in cold-pressed coconut oil with 12 Ayurvedic herbs. Prevents hair fall, improves memory, reduces anxiety. Apply warm before sleep. 200ml.","price":249,"category":"wellness","tags":["brahmi","hair-oil","ayurvedic","brain","hair-fall"],"weight":250},
  {"title":"Copper Water Vessel (Lota)","subtitle":"Pure Copper Drinking Vessel","description":"Hand-hammered pure copper vessel (500ml). Store water overnight — copper ions alkalise water, kill bacteria, aid thyroid function and joint health. Traditional South Indian practice. Lead-free certified.","price":449,"category":"wellness","tags":["copper","vessel","water","alkaline","traditional"],"weight":350},
  {"title":"Sandalwood Face Pack","subtitle":"Pure Mysore Sandalwood Powder","description":"100% pure Mysore sandalwood powder (Santalum album). Used for generations for cooling, skin brightening, and anti-ageing. Mix with rose water or milk. 50g box.","price":349,"category":"wellness","tags":["sandalwood","mysore","face-pack","skin","brightening"],"weight":80},

  # HANDICRAFTS
  {"title":"Channapatna Wooden Toy Set","subtitle":"GI Certified Lacquerware Toys","description":"Set of 5 colourful lacquerware toys from Channapatna — Karnataka's toy town. Made with non-toxic natural dyes and ivory wood (Wrightia tinctoria). GI certified. Safe for children 3+. Handmade by artisans.","price":349,"category":"handicrafts","tags":["channapatna","toys","GI","lacquerware","handmade"],"weight":400},
  {"title":"Bidriware Pen Holder","subtitle":"Silver-Inlaid Zinc-Alloy Craft — Bidar","description":"Authentic Bidriware pen holder from Bidar, Karnataka. Traditional zinc-alloy casting with pure silver inlay work. GI certified. Each piece unique. 15cm height. Gift boxed.","price":1299,"category":"handicrafts","tags":["bidriware","bidar","silver","craft","GI"],"weight":300},
  {"title":"Clay Terracotta Kulhad Set (6pcs)","subtitle":"Traditional Unglazed Clay Cups","description":"Set of 6 hand-thrown terracotta kulhads from Karnataka potters. Natural unglazed clay — keeps drinks cool, adds earthy flavour. Biodegradable. Ideal for chai, lassi, and buttermilk.","price":199,"category":"handicrafts","tags":["terracotta","kulhad","clay","traditional","biodegradable"],"weight":600},
]

# ── Auth ─────────────────────────────────────────────────────────────────────
def get_token():
    r = requests.post(f"{MEDUSA_URL}/auth/user/emailpass",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASS})
    if r.status_code == 200:
        return r.json().get("token")
    print(f"❌ Auth failed: {r.status_code} {r.text[:200]}")
    return None

def headers(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

# ── Get or create sales channel ───────────────────────────────────────────────
def get_sales_channel(token):
    r = requests.get(f"{MEDUSA_URL}/admin/sales-channels", headers=headers(token))
    if r.status_code == 200:
        channels = r.json().get("sales_channels", [])
        if channels:
            return channels[0]["id"]
    return None

# ── Get India region ─────────────────────────────────────────────────────────
def get_region(token):
    r = requests.get(f"{MEDUSA_URL}/admin/regions", headers=headers(token))
    if r.status_code == 200:
        for reg in r.json().get("regions", []):
            if reg.get("currency_code") == "inr" or "india" in reg.get("name","").lower():
                return reg["id"]
        # Fallback to first region
        regions = r.json().get("regions", [])
        if regions: return regions[0]["id"]
    return None

# ── Create product in Medusa ──────────────────────────────────────────────────
def create_product(token, p, sales_channel_id, region_id=None):
    # Build prices — store in whole rupees (NOT paise)
    # Medusa's convertToLocale uses Intl.NumberFormat which handles INR decimal display
    prices = [{"amount": p["price"], "currency_code": "inr"}]
    if region_id:
        prices = [{"amount": p["price"], "currency_code": "inr",
                   "rules": {"region_id": region_id}}]

    payload = {
        "title": p["title"],
        "subtitle": p["subtitle"],
        "description": p["description"],
        "status": "published",
        "options": [{"title": "Type", "values": ["Standard"]}],
        "variants": [{
            "title": "Standard",
            "prices": prices,
            "options": {"Type": "Standard"},
        }],
    }
    if sales_channel_id:
        payload["sales_channels"] = [{"id": sales_channel_id}]

    r = requests.post(f"{MEDUSA_URL}/admin/products",
        headers=headers(token), json=payload)
    return r.status_code in (200, 201), r.json()

# ── Main ──────────────────────────────────────────────────────────────────────
def run():
    print("\n🌾 JATRAMELA PRODUCT RESEARCH BOT")
    print("=" * 50)
    print(f"⏰ Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    token = get_token()
    if not token:
        print("Cannot proceed without auth token.")
        return

    print("✅ Authenticated with Medusa Admin")

    sc_id = get_sales_channel(token)
    print(f"📦 Sales channel: {sc_id or 'none found'}")

    region_id = get_region(token)
    print(f"🌏 India region: {region_id or 'none found'}")

    # Check existing products
    r = requests.get(f"{MEDUSA_URL}/admin/products?limit=100", headers=headers(token))
    existing = set()
    if r.status_code == 200:
        for prod in r.json().get("products", []):
            existing.add(prod["title"])
    print(f"📋 Existing products: {len(existing)}")

    added = 0
    skipped = 0
    failed = 0

    for p in PRODUCTS:
        if p["title"] in existing:
            print(f"  ⏭️  Skip (exists): {p['title']}")
            skipped += 1
            continue

        ok, resp = create_product(token, p, sc_id, region_id)
        if ok:
            pid = resp.get("product", {}).get("id", "?")
            print(f"  ✅ Added [{p['category']}]: {p['title']} — ₹{p['price']} (id:{pid})")
            added += 1
        else:
            print(f"  ❌ Failed: {p['title']} — {str(resp)[:100]}")
            failed += 1
        time.sleep(0.3)

    print(f"\n{'='*50}")
    print(f"✅ Added:   {added}")
    print(f"⏭️  Skipped: {skipped}")
    print(f"❌ Failed:  {failed}")
    print(f"📊 Total products in DB: {len(existing) + added}")
    print(f"⏰ Done: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # Save report
    report = {
        "run_at": datetime.now().isoformat(),
        "added": added, "skipped": skipped, "failed": failed,
        "total_in_catalog": len(PRODUCTS)
    }
    os.makedirs("bots/reports", exist_ok=True)
    with open("bots/reports/product_bot_report.json", "w") as f:
        json.dump(report, f, indent=2)
    print("📄 Report saved: bots/reports/product_bot_report.json\n")

if __name__ == "__main__":
    run()
