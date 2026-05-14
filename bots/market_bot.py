#!/usr/bin/env python3
"""
📊 JATRAMELA MARKET RESEARCH BOT
Generates business intelligence, competitor analysis, and revenue projections.
Run: python3 market_bot.py
Outputs: bots/reports/market_research_YYYY-MM-DD.md
"""
import json, os
from datetime import datetime

# ── Market Data (research-based) ─────────────────────────────────────────────

MARKET_DATA = {
    "market_size": {
        "organic_food_india_2024_cr": 5600,
        "organic_food_india_2030_cr": 19000,
        "cagr_pct": 22,
        "karnataka_share_pct": 8,
        "karnataka_market_cr": 448,
        "traditional_textiles_india_cr": 65000,
        "mysore_silk_annual_cr": 2200,
        "ayurveda_market_india_2025_cr": 9000,
    },
    "target_audience": [
        {"segment": "Health-conscious urban Indians", "size_M": 120, "age": "28-45",   "cities": "Bengaluru, Mumbai, Delhi, Hyderabad", "spend_pm": 3000,  "priority": "HIGH"},
        {"segment": "NRI Karnataka diaspora",         "size_M": 3,   "age": "30-55",   "cities": "USA, UK, UAE, Australia",            "spend_pm": 8000,  "priority": "HIGH"},
        {"segment": "Wedding & gifting buyers",       "size_M": 45,  "age": "25-50",   "cities": "Pan India",                          "spend_pm": 5000,  "priority": "HIGH"},
        {"segment": "Yoga & wellness community",      "size_M": 25,  "age": "22-40",   "cities": "Bengaluru, Pune, Mysuru",            "spend_pm": 2500,  "priority": "MEDIUM"},
        {"segment": "Rural Karnataka consumers",      "size_M": 8,   "age": "All ages","cities": "Tier 2/3 Karnataka",                 "spend_pm": 800,   "priority": "MEDIUM"},
        {"segment": "Diabetic/lifestyle disease",     "size_M": 77,  "age": "35-65",   "cities": "Pan India",                          "spend_pm": 2000,  "priority": "HIGH"},
    ],
    "competitors": [
        {"name": "Organic India",     "url": "organicindia.com",     "monthly_visitors_K": 450, "products": 200, "avg_price": 350,  "strengths": "Brand trust, wide distribution", "gap": "Not Karnataka-specific"},
        {"name": "Two Brothers",      "url": "twobrothersorganicfarms.com", "monthly_visitors_K": 380, "products": 120, "avg_price": 420, "strengths": "Storytelling, farm-to-fork", "gap": "Maharashtra-centric"},
        {"name": "Maati Crafts",      "url": "maati.co",             "monthly_visitors_K": 85,  "products": 300, "avg_price": 600,  "strengths": "Artisan focus", "gap": "No food products"},
        {"name": "iKraft",            "url": "ikraft.in",            "monthly_visitors_K": 120, "products": 400, "avg_price": 800,  "strengths": "GI products", "gap": "Not Karnataka-specific"},
        {"name": "Amazon Karnataka",  "url": "amazon.in",            "monthly_visitors_K": 500000, "products": 9999, "avg_price": 300, "strengths": "Traffic, trust", "gap": "Not curated, no heritage story"},
        {"name": "Nykaa Fashion",     "url": "nykaafashion.com",     "monthly_visitors_K": 12000, "products": 5000, "avg_price": 1200, "strengths": "Silk sarees listed", "gap": "No organic food, no regional focus"},
    ],
    "revenue_projections": {
        "month_1":  {"orders": 50,   "avg_order": 800,  "revenue": 40000,    "notes": "Friends, family, soft launch"},
        "month_3":  {"orders": 200,  "avg_order": 950,  "revenue": 190000,   "notes": "Instagram + WhatsApp campaign"},
        "month_6":  {"orders": 800,  "avg_order": 1100, "revenue": 880000,   "notes": "SEO traffic + Google Ads"},
        "month_12": {"orders": 2500, "avg_order": 1300, "revenue": 3250000,  "notes": "Brand recognition, repeat buyers"},
        "month_24": {"orders": 8000, "avg_order": 1500, "revenue": 12000000, "notes": "NRI + B2B + wholesale channel"},
    },
    "business_opportunities": [
        {
            "name": "B2B Corporate Gift Hampers",
            "potential_cr_year1": 0.5,
            "effort": "LOW",
            "description": "Curated Karnataka heritage gift boxes for Diwali, Ugadi, and year-end corporate gifting. Price: ₹1,500–₹5,000/hamper. Target: 500 Bengaluru tech companies.",
            "action": "Create 5 gift box SKUs. Hire 1 BD executive. LinkedIn outreach to HR managers.",
        },
        {
            "name": "Subscription Box — Monthly Wellness",
            "potential_cr_year1": 0.8,
            "effort": "MEDIUM",
            "description": "Monthly curated box of 6-8 Karnataka organic products. ₹799/month. Builds recurring revenue and loyalty. Model: Nourish Box, Farmizen.",
            "action": "Design 3 subscription tiers. Integrate Razorpay subscriptions. Target 1,000 subscribers in 6 months.",
        },
        {
            "name": "NRI Delivery — Karnataka Taste of Home",
            "potential_cr_year1": 1.2,
            "effort": "MEDIUM",
            "description": "Ship Karnataka organic foods and silk to USA/UK/UAE NRIs. 3cr+ Karnataka NRIs globally. Average order ₹4,000-₹8,000. Partner with Shiprocket International.",
            "action": "Enable international shipping. Add NRI wishlist items (Bisi Bele Bath mix, filter coffee, silk). WhatsApp NRI groups.",
        },
        {
            "name": "Artisan SHG Marketplace (Seller Platform)",
            "potential_cr_year1": 0.3,
            "effort": "HIGH",
            "description": "Allow Self Help Groups (SHGs) and NGOs across Karnataka to list products. Take 12% commission. Empowers women, increases catalog to 2000+ SKUs.",
            "action": "Build seller onboarding flow. Partner with NABARD, DIC Karnataka, WCD Karnataka.",
        },
        {
            "name": "Live Farm/Artisan Video Commerce",
            "potential_cr_year1": 0.6,
            "effort": "MEDIUM",
            "description": "Weekly Instagram/YouTube Live from farms and artisan workshops. Direct sale links. Gen-Z audience loves behind-the-scenes content. 40% higher conversion.",
            "action": "Buy Reel production kit ₹15,000. Create weekly content calendar. 2 live sessions/week.",
        },
        {
            "name": "Offline Pop-up Markets — Bengaluru",
            "potential_cr_year1": 0.4,
            "effort": "LOW",
            "description": "Monthly pop-up markets in Indiranagar, Koramangala, Whitefield. Target ₹2–5L per event. Builds brand trust and drives online signups.",
            "action": "Partner with venues: UB City, Church Street, weekend markets. ₹10,000 stall cost.",
        },
        {
            "name": "Hotel & Resort Amenity Supply",
            "potential_cr_year1": 0.9,
            "effort": "MEDIUM",
            "description": "Supply eco-lodges, heritage hotels, and Ayurvedic resorts with branded Karnataka wellness products. B2B pricing, recurring orders.",
            "action": "Target: Coorg Estate, Orange County, Evolve Back, Kabini lodges. Create B2B catalogue PDF.",
        },
        {
            "name": "Karnataka Food Export (APEDA Tie-up)",
            "potential_cr_year1": 2.0,
            "effort": "HIGH",
            "description": "Export certified organic Karnataka products to EU, USA under APEDA/organic certification. ₹60,000 Cr Indian organic export market. High margins.",
            "action": "Get APEDA registration. Partner with export house. Start with turmeric, coffee, spices.",
        },
    ],
    "marketing_channels": [
        {"channel": "Instagram Reels",         "cost_pm": 10000,  "expected_orders_pm": 150, "roi": "HIGH",   "notes": "Farm/artisan stories, recipe videos"},
        {"channel": "WhatsApp Broadcast",       "cost_pm": 2000,   "expected_orders_pm": 80,  "roi": "HIGH",   "notes": "Weekly health tips + product drops"},
        {"channel": "Google Search Ads",        "cost_pm": 15000,  "expected_orders_pm": 120, "roi": "MEDIUM", "notes": "Target: organic ragi, mysore silk, etc."},
        {"channel": "YouTube Farm Stories",     "cost_pm": 5000,   "expected_orders_pm": 60,  "roi": "MEDIUM", "notes": "Long-form, builds authority + SEO"},
        {"channel": "Facebook Community Group", "cost_pm": 3000,   "expected_orders_pm": 40,  "roi": "MEDIUM", "notes": "Karnataka health & culture groups"},
        {"channel": "NRI WhatsApp Groups",      "cost_pm": 1000,   "expected_orders_pm": 30,  "roi": "HIGH",   "notes": "High AOV, low competition"},
        {"channel": "Health Influencers",       "cost_pm": 20000,  "expected_orders_pm": 200, "roi": "HIGH",   "notes": "Barter + affiliate for ayurveda creators"},
        {"channel": "SEO / Blog Content",       "cost_pm": 8000,   "expected_orders_pm": 90,  "roi": "HIGH",   "notes": "Builds organic traffic over 6-12 months"},
    ],
    "legal_requirements": [
        {"item": "GST Registration",          "status": "Required", "cost_approx": "FREE",   "timeline": "3-5 days"},
        {"item": "FSSAI License",             "status": "Required for food", "cost_approx": "₹2,000-₹7,500", "timeline": "30-60 days"},
        {"item": "Shop & Establishment Act",  "status": "Required", "cost_approx": "₹1,000-₹5,000", "timeline": "7 days"},
        {"item": "MSME / Udyam Registration", "status": "Recommended", "cost_approx": "FREE", "timeline": "1 day"},
        {"item": "Trademark (JATRAMELA)",     "status": "Recommended", "cost_approx": "₹4,500/class", "timeline": "18-24 months"},
        {"item": "Company Registration (OPC/Pvt Ltd)", "status": "Recommended", "cost_approx": "₹6,000-₹12,000", "timeline": "7-15 days"},
        {"item": "Bank Current Account",      "status": "Required", "cost_approx": "Varies", "timeline": "3-7 days"},
        {"item": "Payment Gateway KYC",       "status": "Required (Razorpay)", "cost_approx": "FREE", "timeline": "1-3 days"},
    ],
}

# ── Generate Markdown Report ──────────────────────────────────────────────────

def generate_report():
    d   = MARKET_DATA
    now = datetime.now()
    date_str = now.strftime("%Y-%m-%d")

    lines = [
        f"# 📊 Jatramela Market Research Report",
        f"**Generated:** {now.strftime('%d %B %Y, %I:%M %p')}  |  **Analyst Bot v1.0**\n",
        "---\n",

        "## 🌏 Market Opportunity",
        f"| Category | 2024 Size | 2030 Projection | CAGR |",
        f"|----------|-----------|-----------------|------|",
        f"| India Organic Food | ₹{d['market_size']['organic_food_india_2024_cr']:,} Cr | ₹{d['market_size']['organic_food_india_2030_cr']:,} Cr | {d['market_size']['cagr_pct']}% |",
        f"| Karnataka Share ({d['market_size']['karnataka_share_pct']}%) | ₹{d['market_size']['karnataka_market_cr']} Cr | — | — |",
        f"| Mysore Silk Market | ₹{d['market_size']['mysore_silk_annual_cr']:,} Cr | — | — |",
        f"| India Ayurveda Market | ₹{d['market_size']['ayurveda_market_india_2025_cr']:,} Cr | — | 15% |",
        "",

        "## 🎯 Target Audience Segments",
        "| Segment | Size | Age | Avg Spend/Month | Priority |",
        "|---------|------|-----|-----------------|----------|",
    ]
    for t in d["target_audience"]:
        lines.append(f"| {t['segment']} | {t['size_M']}M | {t['age']} | ₹{t['spend_pm']:,} | **{t['priority']}** |")

    lines += [
        "",
        "## 🏆 Competitor Analysis",
        "| Competitor | Monthly Visitors | Products | Avg Price | Key Gap for Jatramela |",
        "|-----------|-----------------|----------|-----------|----------------------|",
    ]
    for c in d["competitors"]:
        visitors = f"{c['monthly_visitors_K']}K" if c['monthly_visitors_K'] < 1000 else f"{c['monthly_visitors_K']//1000}M+"
        lines.append(f"| {c['name']} | {visitors} | {c['products']} | ₹{c['avg_price']} | {c['gap']} |")

    lines += [
        "",
        "> **🟢 Jatramela's Edge:** Only Karnataka-specific platform combining organic food + handloom silk + Ayurveda + handicrafts with direct farmer linkage and storytelling.\n",

        "## 💰 Revenue Projections (INR)",
        "| Milestone | Orders/Month | Avg Order | Monthly Revenue | Strategy |",
        "|-----------|-------------|-----------|-----------------|---------|",
    ]
    for k, v in d["revenue_projections"].items():
        lines.append(f"| {k.replace('_',' ').title()} | {v['orders']:,} | ₹{v['avg_order']:,} | ₹{v['revenue']:,} | {v['notes']} |")

    lines += [
        "",
        "## 🚀 Business Opportunities (Priority Order)",
    ]
    sorted_opps = sorted(d["business_opportunities"], key=lambda x: x["potential_cr_year1"], reverse=True)
    for i, o in enumerate(sorted_opps, 1):
        lines += [
            f"\n### {i}. {o['name']}",
            f"**Revenue Potential (Year 1):** ₹{o['potential_cr_year1']} Cr  |  **Effort:** {o['effort']}",
            f"\n{o['description']}",
            f"\n**Action:** {o['action']}",
        ]

    lines += [
        "\n---",
        "## 📣 Marketing Channels — ROI Analysis",
        "| Channel | Monthly Budget | Expected Orders | ROI | Notes |",
        "|---------|---------------|----------------|-----|-------|",
    ]
    for m in d["marketing_channels"]:
        lines.append(f"| {m['channel']} | ₹{m['cost_pm']:,} | {m['expected_orders_pm']} | **{m['roi']}** | {m['notes']} |")

    lines += [
        "",
        "## ⚖️ Legal Requirements",
        "| Requirement | Status | Approx Cost | Timeline |",
        "|-------------|--------|-------------|---------|",
    ]
    for l in d["legal_requirements"]:
        lines.append(f"| {l['item']} | {l['status']} | {l['cost_approx']} | {l['timeline']} |")

    lines += [
        "\n---",
        "## 🔑 Top 5 Immediate Actions",
        "1. **Register GST + FSSAI** — Can't legally sell food without these",
        "2. **Add 50+ products** — Run product_bot.py, then add real photos via Admin",
        "3. **Launch Instagram** — 3 reels/week: farm stories, recipes, product demos",
        "4. **Corporate gifting campaign** — Email 50 Bengaluru HR contacts with hamper catalogue",
        "5. **WhatsApp NRI groups** — Share Karnataka food products with homesick diaspora\n",
        f"*Report generated by Jatramela Market Research Bot on {date_str}*",
    ]

    return "\n".join(lines)


def run():
    print("\n📊 JATRAMELA MARKET RESEARCH BOT")
    print("=" * 50)
    os.makedirs("bots/reports", exist_ok=True)
    date_str = datetime.now().strftime("%Y-%m-%d")
    report = generate_report()
    path = f"bots/reports/market_research_{date_str}.md"
    with open(path, "w") as f:
        f.write(report)
    print(f"✅ Report saved: {path}")
    print(report[:500] + "\n...[truncated — open the file to read the full report]")

if __name__ == "__main__":
    run()
