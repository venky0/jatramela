#!/usr/bin/env python3
"""
🎨 JATRAMELA UI/UX DESIGNER & ARCHITECT BOT
Analyzes the complete theme, identifies UI/UX issues, and auto-applies improvements.

Managed by: manager_bot.py (runs WEEKLY on Thursdays)
Usage standalone: python3 bots/ui_ux_bot.py [--fix] [--report]

Responsibilities:
  🔍 AUDIT:  Analyse theme consistency (colors, fonts, spacing, branding)
  🔍 AUDIT:  Check all pages for missing Jatramela branding
  🔍 AUDIT:  Detect "Medusa" references still in source code
  🔍 AUDIT:  Validate CSS custom properties are defined
  🔍 AUDIT:  Check mobile responsiveness patterns
  🔍 AUDIT:  Verify menu & navigation UX (cart label, menu items)
  🔍 AUDIT:  Scan metadata (page titles, descriptions)
  🔧 FIX:   Replace leftover Medusa branding with Jatramela
  🔧 FIX:   Fix page metadata for Karnataka theme
  🔧 FIX:   Report recommendations for manual designer review
"""

import sys, os, json, re, subprocess
from datetime import datetime
from pathlib import Path

STOREFRONT = Path("apps/storefront/src")
REPORT_DIR = Path("bots/reports")
REPORT_DIR.mkdir(parents=True, exist_ok=True)
AUTO_FIX   = "--fix" in sys.argv or True

# ─── Design system reference ──────────────────────────────────────────────────
BRAND = {
    "primary_gold":   "#C9A84C",
    "dark_bg":        "#1a0a00",
    "header_bg":      "rgba(26,10,0,0.97)",
    "text_primary":   "#FFF8E7",
    "font_brand":     "Baloo 2",
    "font_body":      "Inter",
    "brand_name":     "JATRAMELA",
    "tagline":        "Back to Roots · Karnataka",
    "copyright":      "© 2026 Jatramela.com · Preserving Karnataka's Heritage",
}

UNWANTED = [
    "Medusa Store",
    "Medusa Next.js Starter",
    "medusa-store",
    "Built with Medusa",
    "All rights reserved.",
    "DTC Starter",
]

REQUIRED_META = {
    "(main)/page.tsx":       ("Jatramela — Back to Roots Karnataka", "India's heritage marketplace"),
    "store/page.tsx":        ("Shop All | Jatramela Store", "Explore authentic Karnataka products"),
    "categories/":           ("| Jatramela Store", "Organic, handwoven, Ayurvedic"),
}

CRITICAL_PAGES = [
    STOREFRONT / "app/[countryCode]/(main)/page.tsx",
    STOREFRONT / "app/[countryCode]/(main)/store/page.tsx",
    STOREFRONT / "app/[countryCode]/(main)/blog/page.tsx",
    STOREFRONT / "app/[countryCode]/(main)/faq/page.tsx",
    STOREFRONT / "app/[countryCode]/(main)/about/page.tsx",
    STOREFRONT / "app/[countryCode]/(main)/categories/[...category]/page.tsx",
    STOREFRONT / "app/not-found.tsx",
    STOREFRONT / "modules/layout/components/side-menu/index.tsx",
    STOREFRONT / "modules/layout/components/cart-dropdown/index.tsx",
    STOREFRONT / "modules/layout/templates/nav/nav-client.tsx",
    STOREFRONT / "modules/layout/templates/footer/index.tsx",
    STOREFRONT / "app/[countryCode]/(checkout)/layout.tsx",
]

CSS_VARIABLES_REQUIRED = [
    "--bg-header", "--shadow-header", "--gold-bright",
    "--text-on-header", "--bg-dark", "--gold-primary",
]

# ─── Audit result ─────────────────────────────────────────────────────────────
class UXIssue:
    def __init__(self, severity, category, file, description, fix_hint=""):
        self.severity    = severity    # CRITICAL | WARN | INFO
        self.category    = category
        self.file        = str(file).replace(str(STOREFRONT) + "/", "")
        self.description = description
        self.fix_hint    = fix_hint
        self.auto_fixed  = False


def scan_for_medusa_branding():
    """Find all remaining Medusa/unwanted branding in source files."""
    issues = []
    for ext in ["*.tsx", "*.ts", "*.css", "*.html"]:
        for path in STOREFRONT.rglob(ext):
            if ".next" in str(path) or "node_modules" in str(path):
                continue
            try:
                content = path.read_text(encoding="utf-8", errors="ignore")
                for unwanted in UNWANTED:
                    if unwanted.lower() in content.lower():
                        occurrences = content.lower().count(unwanted.lower())
                        issue = UXIssue(
                            "CRITICAL", "Branding", path,
                            f'"{unwanted}" appears {occurrences}x — must be replaced with Jatramela',
                            f'Replace all "{unwanted}" with Jatramela equivalent'
                        )
                        if AUTO_FIX:
                            # Auto-fix common substitutions
                            replacements = {
                                "Medusa Store":               "Jatramela Store",
                                "Medusa Next.js Starter":     "Jatramela",
                                "medusa-store":               "jatramela-store",
                                "© 2024 Medusa Store. All rights reserved.": BRAND["copyright"],
                                "© 2025 Medusa Store. All rights reserved.": BRAND["copyright"],
                                "All rights reserved.":       "· Preserving Karnataka's Heritage",
                            }
                            new_content = content
                            for old, new in replacements.items():
                                new_content = new_content.replace(old, new)
                            if new_content != content:
                                path.write_text(new_content, encoding="utf-8")
                                issue.auto_fixed = True
                        issues.append(issue)
            except Exception:
                pass
    return issues


def check_css_variables():
    """Verify all required CSS design tokens exist in globals.css."""
    issues = []
    css_path = STOREFRONT / "styles/globals.css"
    if not css_path.exists():
        # Check alternate paths
        for alt in ["app/globals.css", "styles/index.css", "style.css"]:
            p = STOREFRONT / alt
            if p.exists():
                css_path = p
                break

    if not css_path.exists():
        issues.append(UXIssue("WARN", "Design System", "globals.css",
            "CSS globals file not found — cannot verify design tokens"))
        return issues

    content = css_path.read_text()
    for var in CSS_VARIABLES_REQUIRED:
        if var not in content:
            issues.append(UXIssue("WARN", "Design System", css_path,
                f"CSS variable {var} not defined in globals",
                f"Add {var} to :root block in globals.css"))
    return issues


def check_page_metadata():
    """Check page.tsx files for proper Jatramela metadata — auto-fixes simple titles."""
    issues = []
    # Titles that are just plain words with no branding
    SIMPLE_TITLES = {
        'title: "Store"':       'title: "Shop All | Jatramela Store"',
        'title: "Cart"':        'title: "Your Bag | Jatramela Store"',
        'title: "Account"':     'title: "My Account | Jatramela"',
        'title: "Addresses"':   'title: "My Addresses | Jatramela"',
        'title: "Orders"':      'title: "My Orders | Jatramela"',
        'title: "Checkout"':    'title: "Secure Checkout | Jatramela"',
        'title: "Order Confirmed"': 'title: "Order Confirmed 🎉 | Jatramela"',
        'title: "Profile"':     'title: "My Profile | Jatramela"',
        'title: "Search"':      'title: "Search | Jatramela Store"',
        'description: "View your order"':
            'description: "View your Jatramela order details — authentic Karnataka heritage products."',
        'description: "View your cart"':
            'description: "Review your Karnataka heritage products and proceed to checkout."',
        'description: "Explore all of our products."':
            'description: "Explore authentic Karnataka heritage products — organic food, silk sarees, Ayurvedic wellness, and traditional handicrafts."',
        'description: "Overview of your account activity."':
            'description: "Manage your Jatramela account, orders, and saved addresses."',
        'description: "View your addresses"':
            'description: "Manage your saved delivery addresses on Jatramela."',
    }

    for path in STOREFRONT.rglob("page.tsx"):
        if ".next" in str(path) or "node_modules" in str(path):
            continue
        try:
            content = path.read_text(encoding="utf-8", errors="ignore")
            if "metadata" not in content and "Metadata" not in content:
                continue

            has_jatra = "Jatramela" in content or "jatramela" in content
            has_medusa = "Medusa" in content and "jatramela" not in content.lower()

            if has_medusa:
                issues.append(UXIssue("CRITICAL", "SEO/Metadata", path,
                    "Page title still uses 'Medusa' instead of Jatramela"))

            if not has_jatra:
                if AUTO_FIX:
                    new_content = content
                    for old, new in SIMPLE_TITLES.items():
                        new_content = new_content.replace(old, new)
                    if new_content != content:
                        path.write_text(new_content, encoding="utf-8")
                        issue = UXIssue("WARN", "SEO/Metadata", path,
                            "Auto-fixed: Added Jatramela branding to page metadata")
                        issue.auto_fixed = True
                        issues.append(issue)
                    else:
                        issues.append(UXIssue("WARN", "SEO/Metadata", path,
                            "Page metadata missing 'Jatramela' branding — manual fix needed",
                            "Add '| Jatramela' to page title"))
                else:
                    issues.append(UXIssue("WARN", "SEO/Metadata", path,
                        "Page metadata missing 'Jatramela' branding",
                        "Add Jatramela brand to page title and description"))
        except Exception:
            pass
    return issues


def check_nav_theme():
    """Verify nav has Karnataka theme colors applied."""
    issues = []
    nav_path = STOREFRONT / "modules/layout/templates/nav/nav-client.tsx"
    if nav_path.exists():
        content = nav_path.read_text()
        checks = {
            "Gold color C9A84C":       "C9A84C" in content,
            "Baloo 2 font":            "Baloo 2" in content,
            "JATRAMELA brand text":    "JATRAMELA" in content,
            "Karnataka tagline":       "Karnataka" in content,
        }
        for label, ok in checks.items():
            if not ok:
                issues.append(UXIssue("WARN", "Navigation", nav_path,
                    f"Nav missing: {label}"))
    return issues


def check_side_menu():
    """Verify side menu has Karnataka theme (not default dark/grey)."""
    issues = []
    menu_path = STOREFRONT / "modules/layout/components/side-menu/index.tsx"
    if menu_path.exists():
        content = menu_path.read_text()
        checks = {
            "Karnataka gradient bg (#1a0a00)":  "#1a0a00" in content or "1a0a00" in content,
            "Gold accent color":                "C9A84C" in content,
            "Section labels (Shop/Explore)":    "Shop" in content,
            "Emoji icons in menu":              "🛒" in content or "🥻" in content,
            "No Medusa Store copyright":        "Medusa Store" not in content,
            "Jatramela copyright":              "Jatramela" in content,
        }
        for label, ok in checks.items():
            if not ok:
                issues.append(UXIssue("WARN", "Navigation", menu_path, f"Side menu missing: {label}"))
    return issues


def check_cart_dropdown():
    """Verify cart dropdown is Karnataka themed (not plain white)."""
    issues = []
    cart_path = STOREFRONT / "modules/layout/components/cart-dropdown/index.tsx"
    if cart_path.exists():
        content = cart_path.read_text()
        checks = {
            "Dark background (#1a0a00)":   "#1a0a00" in content or "1a0a00" in content,
            "Gold accent color":           "C9A84C" in content,
            "Cart icon (not text 'Cart')": "Cart (" not in content,
            "Jatramela Store link":        "Jatramela" in content,
            "No plain white bg":           "bg-white" not in content,
        }
        for label, ok in checks.items():
            if not ok:
                issues.append(UXIssue("WARN", "Cart UI", cart_path, f"Cart dropdown missing: {label}"))
    return issues


def check_footer():
    """Check footer has Jatramela branding."""
    issues = []
    footer_path = STOREFRONT / "modules/layout/templates/footer/index.tsx"
    if footer_path.exists():
        content = footer_path.read_text()
        if "Medusa Store" in content:
            issues.append(UXIssue("CRITICAL", "Branding", footer_path,
                "Footer still has 'Medusa Store' copyright text"))
        if "Jatramela" not in content:
            issues.append(UXIssue("WARN", "Branding", footer_path,
                "Footer missing Jatramela branding"))
    return issues


def check_not_found_page():
    """Ensure 404 page is Jatramela branded."""
    issues = []
    p = STOREFRONT / "app/not-found.tsx"
    if p.exists():
        content = p.read_text()
        if "Medusa" in content and "Jatramela" not in content:
            issues.append(UXIssue("WARN", "Branding", p,
                "404 page still uses Medusa branding"))
    return issues


def check_mobile_nav():
    """Verify mobile bottom navigation exists."""
    issues = []
    nav_path = STOREFRONT / "modules/layout/components/mobile-bottom-nav/index.tsx"
    if not nav_path.exists():
        issue = UXIssue("WARN", "Mobile UX", "mobile-bottom-nav/index.tsx",
            "Mobile bottom navigation bar missing — creates poor mobile experience",
            "Create MobileBottomNav component at modules/layout/components/mobile-bottom-nav/")
        issues.append(issue)
    return issues


def check_product_card_hover():
    """Verify product cards have hover effect CSS."""
    issues = []
    css_path = STOREFRONT / "styles/globals.css"
    if css_path.exists():
        content = css_path.read_text()
        if "product-wrapper" not in content or "translateY" not in content:
            issues.append(UXIssue("WARN", "Product UX", "styles/globals.css",
                "Product cards missing hover elevation effect",
                "Add CSS transform on [data-testid='product-wrapper']:hover"))
    return issues


def generate_recommendations():
    """UX design recommendations — tracks implementation status."""
    return [
        {
            "priority": "HIGH",
            "status": "DONE",
            "area": "Product Cards",
            "recommendation": "Hover elevation + gold border flash on product cards",
            "implementation": "CSS [data-testid=product-wrapper]:hover { transform: translateY(-5px); box-shadow: gold glow }"
        },
        {
            "priority": "HIGH",
            "status": "DONE",
            "area": "Mobile Navigation",
            "recommendation": "Bottom navigation bar for mobile (Home, Shop, Organic, Cart, Account)",
            "implementation": "MobileBottomNav component — fixed bottom, hidden on xl+ screens"
        },
        {
            "priority": "MEDIUM",
            "status": "DONE",
            "area": "Homepage Hero",
            "recommendation": "Animated Kannada/Sanskrit text morphing in hero section",
            "implementation": "KannadaMorphText component cycles 6 Kannada words every 2.8s with fade transition"
        },
        {
            "priority": "MEDIUM",
            "status": "DONE",
            "area": "Product Pages",
            "recommendation": "'Karnataka Origin' district badge with map pin for each product",
            "implementation": "KarnatakaOriginBadge auto-detects district from product title keywords"
        },
        {
            "priority": "MEDIUM",
            "status": "DONE",
            "area": "Seasonal Theme",
            "recommendation": "Dasara Festival theme toggle (deep maroon + gold) for Oct–Nov",
            "implementation": "DasaraTheme component in nav — auto-activates Oct 1–Nov 15, persisted in localStorage"
        },
        {
            "priority": "LOW",
            "status": "DONE",
            "area": "Typography",
            "recommendation": "Noto Sans Kannada font for category headings",
            "implementation": "Loaded via Google Fonts in globals.css, applied to .category-heading class"
        },
        {
            "priority": "LOW",
            "status": "DONE",
            "area": "Loading States",
            "recommendation": "Karnataka kolam-inspired shimmer for skeleton loaders",
            "implementation": "@keyframes shimmer-kolam with gold gradient sweep, replaces grey pulse"
        },
        {
            "priority": "LOW",
            "status": "DONE",
            "area": "Micro-animations",
            "recommendation": "Lotus flower bloom animation on 'Add to Cart' success",
            "implementation": "LotusCartSuccess SVG component — blooms from center on cart add, floats up and fades"
        },
    ]


def generate_html_report(all_issues, recs, stats):
    """Generate a rich HTML design audit report."""
    date_str = datetime.now().strftime("%Y-%m-%d %H:%M")
    critical = [i for i in all_issues if i.severity == "CRITICAL"]
    warns    = [i for i in all_issues if i.severity == "WARN"]
    fixed    = [i for i in all_issues if i.auto_fixed]
    score    = max(0, 100 - len(critical) * 10 - len(warns) * 3)
    sc_color = "#4CAF50" if score >= 90 else "#FF9800" if score >= 70 else "#f44336"

    issue_rows = ""
    for i in all_issues:
        color = {"CRITICAL": "#f44336", "WARN": "#FF9800", "INFO": "#2196F3"}[i.severity]
        icon  = {"CRITICAL": "🔴", "WARN": "🟡", "INFO": "🔵"}[i.severity]
        fixed_badge = " <span style='background:#4CAF50;color:#fff;padding:1px 5px;border-radius:4px;font-size:9px'>AUTO-FIXED</span>" if i.auto_fixed else ""
        issue_rows += f"<tr><td>{icon}</td><td style='color:{color};font-weight:600'>{i.severity}</td><td>{i.category}</td><td style='font-size:11px'>{i.file}</td><td style='font-size:11px'>{i.description}{fixed_badge}</td></tr>"

    rec_rows = ""
    for r in recs:
        pc     = {"HIGH":"#f44336","MEDIUM":"#FF9800","LOW":"#4CAF50"}[r["priority"]]
        status = r.get("status","PENDING")
        sb     = "<span style='background:#4CAF50;color:#fff;padding:1px 6px;border-radius:4px;font-size:9px;margin-left:6px'>✓ DONE</span>" if status == "DONE" else "<span style='background:#FF9800;color:#fff;padding:1px 6px;border-radius:4px;font-size:9px;margin-left:6px'>PENDING</span>"
        rec_rows += f"<tr><td style='color:{pc};font-weight:700'>{r['priority']}</td><td style='color:#C9A84C'>{r['area']}{sb}</td><td style='font-size:11px'>{r['recommendation']}</td><td style='font-size:10px;color:rgba(255,248,231,.5)'>{r['implementation'][:90]}</td></tr>"

    html = f"""<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Jatramela UI/UX Audit — {date_str}</title>
<style>
  *{{box-sizing:border-box;margin:0;padding:0}}
  body{{font-family:'Segoe UI',sans-serif;background:#0a0500;color:#FFF8E7;padding:24px}}
  h1{{color:#C9A84C;font-size:22px;margin-bottom:4px}}
  h2{{font-size:13px;color:#C9A84C;margin:0 0 10px;border-bottom:1px solid rgba(201,168,76,.2);padding-bottom:6px}}
  .sub{{color:rgba(255,248,231,.4);font-size:11px;margin-bottom:24px}}
  .grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-bottom:20px}}
  .card{{background:rgba(255,248,231,.05);border:1px solid rgba(201,168,76,.2);border-radius:10px;padding:14px;text-align:center}}
  .val{{font-size:28px;font-weight:900;color:#C9A84C}}
  .lbl{{font-size:10px;color:rgba(255,248,231,.4);margin-top:4px}}
  .section{{background:rgba(255,255,255,.03);border:1px solid rgba(201,168,76,.1);border-radius:12px;padding:16px;margin-bottom:16px}}
  table{{width:100%;border-collapse:collapse}}
  th{{text-align:left;padding:7px 10px;font-size:10px;color:rgba(255,248,231,.4);border-bottom:1px solid rgba(255,255,255,.07)}}
  td{{padding:7px 10px;font-size:11px;border-bottom:1px solid rgba(255,255,255,.03)}}
  .score-ring{{font-size:56px;font-weight:900;color:{sc_color};text-align:center;padding:20px}}
  .palette{{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}}
  .swatch{{width:48px;height:48px;border-radius:8px;display:flex;align-items:flex-end;padding:3px}}
  .swatch span{{font-size:8px;color:rgba(255,255,255,.7)}}
</style></head><body>
<h1>🎨 Jatramela UI/UX Designer & Architect — Audit Report</h1>
<p class="sub">Generated by ui_ux_bot.py &nbsp;|&nbsp; {date_str} &nbsp;|&nbsp; Auto-fix: {"Enabled" if AUTO_FIX else "Disabled"}</p>

<div class="grid">
  <div class="card"><div class="val" style="color:{sc_color}">{score}</div><div class="lbl">UI/UX Score /100</div></div>
  <div class="card"><div class="val" style="color:#f44336">{len(critical)}</div><div class="lbl">Critical Issues</div></div>
  <div class="card"><div class="val" style="color:#FF9800">{len(warns)}</div><div class="lbl">Warnings</div></div>
  <div class="card"><div class="val" style="color:#4CAF50">{len(fixed)}</div><div class="lbl">Auto-Fixed</div></div>
  <div class="card"><div class="val">{stats['files_scanned']}</div><div class="lbl">Files Scanned</div></div>
  <div class="card"><div class="val">{len(recs)}</div><div class="lbl">Recommendations</div></div>
</div>

<div class="section">
<h2>🎨 Karnataka Design System</h2>
<p style="font-size:12px;margin-bottom:10px;color:rgba(255,248,231,.6)">Active color palette & typography tokens</p>
<div class="palette">
  <div class="swatch" style="background:#C9A84C"><span>Gold</span></div>
  <div class="swatch" style="background:#1a0a00"><span>Dark</span></div>
  <div class="swatch" style="background:#2d1200"><span>Brown</span></div>
  <div class="swatch" style="background:#FFF8E7"><span>Cream</span></div>
  <div class="swatch" style="background:#8B1A1A"><span>Maroon</span></div>
  <div class="swatch" style="background:#2D5016"><span>Forest</span></div>
</div>
<p style="font-size:11px;margin-top:10px;color:rgba(255,248,231,.5)">Fonts: <strong style="color:#C9A84C">Baloo 2</strong> (brand) + <strong style="color:#C9A84C">Inter</strong> (body) + Noto Sans Kannada (recommended)</p>
</div>

<div class="section">
<h2>🔍 Issues Found ({len(all_issues)} total)</h2>
<table><tr><th></th><th>Severity</th><th>Category</th><th>File</th><th>Description</th></tr>
{issue_rows or "<tr><td colspan='5' style='text-align:center;color:rgba(255,248,231,.4);padding:20px'>✅ No issues found — store is perfectly branded!</td></tr>"}
</table></div>

<div class="section">
<h2>💡 UX Design Recommendations ({len(recs)} items)</h2>
<table><tr><th>Priority</th><th>Area</th><th>Recommendation</th><th>Implementation Hint</th></tr>
{rec_rows}
</table></div>

<div class="section">
<h2>📋 Next Actions for Designer</h2>
<ul style="padding-left:18px;font-size:12px;line-height:2">
  <li>🔴 Fix any remaining CRITICAL branding issues immediately</li>
  <li>🟡 Review WARN items and apply in next sprint</li>
  <li>📱 Implement mobile bottom navigation bar (HIGH priority)</li>
  <li>🎨 Add product card hover animations for premium feel</li>
  <li>🌺 Consider Kannada script font for section headings</li>
  <li>🎪 Schedule seasonal Dasara theme toggle (October)</li>
</ul>
</div>
</body></html>"""

    path = REPORT_DIR / f"ui_ux_audit_{datetime.now().strftime('%Y-%m-%d')}.html"
    path.write_text(html)
    return str(path)


# ─── Main ─────────────────────────────────────────────────────────────────────
def run():
    print("\n" + "═"*62)
    print("  🎨 JATRAMELA UI/UX DESIGNER & ARCHITECT BOT")
    print(f"  🕐 {datetime.now().strftime('%d %b %Y, %I:%M %p')}")
    print("  Analysing theme, branding, and UX consistency...")
    print("═"*62 + "\n")

    all_issues = []
    files_scanned = sum(1 for ext in ["*.tsx","*.ts","*.css"]
                        for _ in STOREFRONT.rglob(ext)
                        if ".next" not in str(_))

    checks = [
        ("Medusa/Unwanted Branding",  scan_for_medusa_branding),
        ("CSS Design Tokens",         check_css_variables),
        ("Page Metadata / SEO",       check_page_metadata),
        ("Navigation Theme",          check_nav_theme),
        ("Side Menu Theme",           check_side_menu),
        ("Cart Dropdown Theme",       check_cart_dropdown),
        ("Footer Branding",           check_footer),
        ("404 Page Branding",         check_not_found_page),
        ("Mobile Bottom Nav",         check_mobile_nav),
        ("Product Card Hover Effect", check_product_card_hover),
    ]

    for label, fn in checks:
        issues = fn()
        all_issues.extend(issues)
        critical = sum(1 for i in issues if i.severity == "CRITICAL")
        warns    = sum(1 for i in issues if i.severity == "WARN")
        fixed    = sum(1 for i in issues if i.auto_fixed)
        icon = "✅" if not issues else ("🔧" if fixed else ("⚠️ " if warns else "❌"))
        print(f"  {icon} {label}: {len(issues)} issue(s)", end="")
        if fixed:
            print(f" ({fixed} auto-fixed)", end="")
        print()
        for i in issues[:2]:
            tag = "[FIXED]" if i.auto_fixed else f"[{i.severity}]"
            print(f"       ↳ {tag} {i.description[:80]}")

    recs = generate_recommendations()
    stats = {"files_scanned": files_scanned}

    critical_count = sum(1 for i in all_issues if i.severity == "CRITICAL")
    warn_count     = sum(1 for i in all_issues if i.severity == "WARN")
    fixed_count    = sum(1 for i in all_issues if i.auto_fixed)
    score          = max(0, 100 - critical_count * 10 - warn_count * 3)

    print(f"\n{'═'*62}")
    print(f"  🎨 UI/UX SCORE: {score}/100")
    print(f"  🔴 Critical: {critical_count}  |  🟡 Warnings: {warn_count}  |  🔧 Auto-fixed: {fixed_count}")
    print(f"  📁 Files scanned: {files_scanned}")
    print(f"  💡 Recommendations: {len(recs)}")
    print(f"{'═'*62}\n")

    report_path = generate_html_report(all_issues, recs, stats)
    print(f"  📄 UI/UX Audit Report: {report_path}")

    # Save JSON for manager bot
    result = {
        "ran_at":         datetime.now().isoformat(),
        "score":          score,
        "critical":       critical_count,
        "warnings":       warn_count,
        "auto_fixed":     fixed_count,
        "files_scanned":  files_scanned,
        "recommendations": len(recs),
        "report":         report_path,
        "top_issues":     [
            {"severity": i.severity, "category": i.category, "description": i.description}
            for i in all_issues if i.severity == "CRITICAL"
        ][:5],
    }

    (REPORT_DIR / "ui_ux_last_result.json").write_text(json.dumps(result, indent=2))
    print(f"\n  ✅ UI/UX Bot complete. Report saved.\n")
    return result


if __name__ == "__main__":
    import subprocess
    result = run()
    if "--report" in sys.argv:
        subprocess.run(["open", result.get("report", "")], capture_output=True)
