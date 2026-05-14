#!/usr/bin/env python3
"""
🤖 JATRAMELA MANAGER BOT — Chief Operating Officer
The human-like manager that orchestrates all bots, assigns daily tasks,
monitors the store 24/7, and escalates issues to the owner.

Usage:
  python3 bots/manager_bot.py              # Run once (dashboard + due tasks)
  python3 bots/manager_bot.py --watch      # Run continuously every hour
  python3 bots/manager_bot.py --force      # Force-run ALL bots now
  python3 bots/manager_bot.py --daily      # Run daily task set only
  python3 bots/manager_bot.py --qc         # Run quality check only

Bot Team Under Manager:
  🕵️  agent_bot      — Daily QC checker & auto-fixer (runs EVERY DAY at 6 AM)
  📦  product_bot    — Adds new Karnataka products (WEEKLY on Wednesdays)
  🖼️  image_uploader — Uploads product images (WEEKLY on Mondays)
  📁  category_setup — Syncs product categories (MONTHLY on 1st)
  📊  market_bot     — Market research & strategy (WEEKLY on Saturdays)
"""

import sys, os, json, time, requests, subprocess
from datetime import datetime, timedelta

# ─── Config ──────────────────────────────────────────────────────────────────
MEDUSA_URL  = "http://localhost:9000"
ADMIN_EMAIL = "admin@jatramela.com"
ADMIN_PASS  = "Admin123!"
LOG_FILE    = "bots/reports/manager_log.json"
REPORT_DIR  = "bots/reports"
os.makedirs(REPORT_DIR, exist_ok=True)

# ─── Bot Registry with full schedule ─────────────────────────────────────────
# schedule_type: "daily" | "weekly:<weekday 0=Mon>" | "monthly:<day>"
BOTS = {
    "agent_bot": {
        "script":        "bots/agent_bot.py",
        "desc":          "Quality audit & auto-fix (QC-1 thru QC-10)",
        "schedule_type": "daily",
        "priority":      1,   # runs first
        "emoji":         "🕵️ ",
    },
    "ui_ux_bot": {
        "script":        "bots/ui_ux_bot.py",
        "desc":          "UI/UX Designer & Architect — theme audit & branding fixes",
        "schedule_type": "weekly:3",  # Thursday
        "priority":      2,
        "emoji":         "🎨",
    },
    "image_uploader": {
        "script":        "bots/image_uploader.py",
        "desc":          "Upload/refresh product thumbnail images",
        "schedule_type": "weekly:0",  # Monday
        "priority":      3,
        "emoji":         "🖼️ ",
    },
    "product_bot": {
        "script":        "bots/product_bot.py",
        "desc":          "Add new Karnataka heritage products",
        "schedule_type": "weekly:2",  # Wednesday
        "priority":      4,
        "emoji":         "📦",
    },
    "market_bot": {
        "script":        "bots/market_bot.py",
        "desc":          "Market research & business intelligence report",
        "schedule_type": "weekly:5",  # Saturday
        "priority":      5,
        "emoji":         "📊",
    },
    "category_setup": {
        "script":        "bots/category_setup.py",
        "desc":          "Create/sync Karnataka product categories",
        "schedule_type": "monthly:1",  # 1st of month
        "priority":      6,
        "emoji":         "📁",
    },
}

# ─── Auth ─────────────────────────────────────────────────────────────────────
def get_token():
    try:
        r = requests.post(f"{MEDUSA_URL}/auth/user/emailpass",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASS}, timeout=8)
        return r.json().get("token")
    except: return None

def api(token, path):
    try:
        r = requests.get(f"{MEDUSA_URL}{path}",
            headers={"Authorization": f"Bearer {token}"}, timeout=8)
        return r.json() if r.status_code == 200 else {}
    except: return {}

# ─── Schedule logic ───────────────────────────────────────────────────────────
def is_due(bot_name, bot_info, log, force=False):
    """Determine if a bot should run now based on its schedule."""
    if force: return True, "force flag"

    schedule = bot_info["schedule_type"]
    last_str  = log.get("last_run", {}).get(bot_name)
    now       = datetime.now()

    # Never ran → always run
    if not last_str:
        return True, "first run ever"

    last = datetime.fromisoformat(last_str)
    hours_since = (now - last).total_seconds() / 3600

    if schedule == "daily":
        if hours_since >= 22:    # 22h buffer for daily
            return True, f"daily schedule ({int(hours_since)}h since last run)"
        return False, f"daily — last ran {int(hours_since)}h ago (next: {(last + timedelta(hours=24)).strftime('%d %b %I:%M %p')})"

    elif schedule.startswith("weekly:"):
        target_weekday = int(schedule.split(":")[1])
        if hours_since >= 167:   # ~7 days
            return True, f"weekly schedule ({int(hours_since)}h since last)"
        # Also run if today is the scheduled day and we haven't run this week
        if now.weekday() == target_weekday and hours_since >= 20:
            day_names = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
            return True, f"scheduled {day_names[target_weekday]}"
        return False, f"weekly — next run on {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][target_weekday]}"

    elif schedule.startswith("monthly:"):
        target_day = int(schedule.split(":")[1])
        if hours_since >= 700:   # ~29 days
            return True, f"monthly schedule"
        if now.day == target_day and hours_since >= 20:
            return True, f"scheduled day {target_day} of month"
        return False, f"monthly — next run on the {target_day}st of next month"

    return False, "unknown schedule"


# ─── Store health ─────────────────────────────────────────────────────────────
def store_health(token):
    products   = api(token, "/admin/products?limit=200").get("products", [])
    orders     = api(token, "/admin/orders?limit=100").get("orders", [])
    categories = api(token, "/admin/product-categories?limit=50").get("product_categories", [])
    customers  = api(token, "/admin/customers?limit=100").get("customers", [])

    karnataka  = [p for p in products if "Medusa" not in p.get("title","")]
    no_image   = [p["title"] for p in karnataka if not p.get("thumbnail")]
    no_cat     = [p["title"] for p in karnataka if not p.get("categories")]
    revenue    = sum(float(o.get("total",0))/100 for o in orders
                     if o.get("payment_status") == "captured")

    # Load last QC score if available
    qc_score = "N/A"
    qc_path  = f"{REPORT_DIR}/agent_last_result.json"
    if os.path.exists(qc_path):
        with open(qc_path) as f:
            qc_data = json.load(f)
        qc_score = f"{qc_data.get('score', 0)}%"

    return {
        "total_products":     len(products),
        "karnataka_products": len(karnataka),
        "categories":         len(categories),
        "orders":             len(orders),
        "customers":          len(customers),
        "revenue":            revenue,
        "no_image_count":     len(no_image),
        "no_image_list":      no_image[:3],
        "no_cat_count":       len(no_cat),
        "no_cat_list":        no_cat[:3],
        "published":          sum(1 for p in karnataka if p.get("status") == "published"),
        "draft":              sum(1 for p in karnataka if p.get("status") == "draft"),
        "qc_score":           qc_score,
    }

# ─── Log helpers ──────────────────────────────────────────────────────────────
def load_log():
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE) as f:
            return json.load(f)
    return {"runs": [], "last_run": {}, "task_history": []}

def save_log(log):
    log["runs"] = log.get("runs", [])[-200:]          # keep last 200 entries
    log["task_history"] = log.get("task_history", [])[-500:]
    with open(LOG_FILE, "w") as f:
        json.dump(log, f, indent=2, default=str)

# ─── Run a single bot ─────────────────────────────────────────────────────────
def run_bot(bot_name, bot_info):
    info = bot_info
    print(f"\n  {info['emoji']} [{bot_name}] {info['desc']}")
    print(f"      → Assigning task at {datetime.now().strftime('%I:%M:%S %p')}...")

    start   = time.time()
    result  = subprocess.run(["python3", info["script"]], capture_output=True, text=True)
    elapsed = round(time.time() - start, 1)
    ok      = result.returncode == 0
    output  = (result.stdout + result.stderr).strip()[-600:]

    icon = "✅" if ok else "❌"
    print(f"      {icon} {'Completed' if ok else 'FAILED'} in {elapsed}s")
    if not ok:
        print(f"      Error: {output[-200:]}")

    return {
        "bot":       bot_name,
        "ran_at":    datetime.now().isoformat(),
        "success":   ok,
        "elapsed_s": elapsed,
        "output":    output,
        "assigned_by": "manager_bot",
    }

# ─── Print dashboard ──────────────────────────────────────────────────────────
def print_dashboard(health, log):
    now = datetime.now()
    day_name = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][now.weekday()]
    print("\n" + "═"*62)
    print("  🌾 JATRAMELA MANAGER BOT  ·  DAILY OPERATIONS CENTRE")
    print(f"  📅 {now.strftime('%d %B %Y, %I:%M %p')} ({day_name})")
    print("═"*62)

    print(f"\n  📊 STORE HEALTH")
    print(f"  ┌{'─'*40}┐")
    print(f"  │  Karnataka Products : {health['karnataka_products']:>4}  ({health['published']} published, {health['draft']} draft)")
    print(f"  │  Categories         : {health['categories']:>4}")
    print(f"  │  Orders             : {health['orders']:>4}")
    print(f"  │  Customers          : {health['customers']:>4}")
    print(f"  │  Revenue (INR)      : ₹{health['revenue']:>10,.2f}")
    print(f"  │  QC Score           : {health['qc_score']:>8}")
    print(f"  └{'─'*40}┘")

    if health["no_image_count"] or health["no_cat_count"]:
        print(f"\n  ⚠️  ACTION ITEMS")
        if health["no_image_count"]:
            print(f"  • {health['no_image_count']} products missing images")
        if health["no_cat_count"]:
            print(f"  • {health['no_cat_count']} products missing categories")

    print(f"\n  🤖 BOT TASK SCHEDULE")
    print(f"  {'Bot':<20} {'Schedule':<20} {'Last Run':<22} {'Next Due'}")
    print(f"  {'─'*78}")
    for name, info in sorted(BOTS.items(), key=lambda x: x[1]["priority"]):
        last_str = log.get("last_run", {}).get(name)
        if last_str:
            last_dt  = datetime.fromisoformat(last_str)
            last_fmt = last_dt.strftime("%d %b %I:%M %p")
        else:
            last_fmt = "Never run"
        due, reason = is_due(name, info, log)
        due_marker  = " ← DUE NOW" if due else ""
        sched = info["schedule_type"].replace("weekly:","").replace("monthly:","1st ")
        day_map = {"0":"Mon","1":"Tue","2":"Wed","3":"Thu","4":"Fri","5":"Sat","6":"Sun"}
        sched_label = {
            "daily": "Daily",
        }.get(info["schedule_type"],
            f"Weekly/{day_map.get(sched, sched)}" if "weekly" in info["schedule_type"]
            else f"Monthly/1st")
        print(f"  {info['emoji']} {name:<17} {sched_label:<20} {last_fmt:<22}{due_marker}")

# ─── Generate HTML manager dashboard ─────────────────────────────────────────
def generate_html_dashboard(health, log, ran_bots):
    date_str = datetime.now().strftime("%Y-%m-%d %H:%M")
    runs = log.get("runs", [])[-20:]

    task_rows = ""
    for name, info in sorted(BOTS.items(), key=lambda x: x[1]["priority"]):
        last_str = log.get("last_run", {}).get(name, "Never")
        due, reason = is_due(name, info, log)
        status_html = f'<span style="color:#FF9800">⏰ DUE</span>' if due else f'<span style="color:#4CAF50">✅ OK</span>'
        task_rows += f"<tr><td>{info['emoji']}</td><td>{name}</td><td>{info['desc']}</td><td>{info['schedule_type']}</td><td>{last_str[:16] if last_str != 'Never' else 'Never'}</td><td>{status_html}</td></tr>"

    run_rows = ""
    for r in reversed(runs):
        color = "#4CAF50" if r["success"] else "#f44336"
        icon  = "✅" if r["success"] else "❌"
        run_rows += f"<tr><td>{r['ran_at'][:16]}</td><td>{r['bot']}</td><td style='color:{color}'>{icon}</td><td>{r['elapsed_s']}s</td></tr>"

    # Load QC data if available
    qc_html = ""
    qc_path  = f"{REPORT_DIR}/agent_last_result.json"
    if os.path.exists(qc_path):
        with open(qc_path) as f: qc = json.load(f)
        score = qc.get("score", 0)
        sc    = "#4CAF50" if score >= 90 else "#FF9800" if score >= 70 else "#f44336"
        qc_html = f"""<div class="section"><h2>🕵️ Latest QC Report (agent_bot)</h2>
<div class="grid" style="grid-template-columns:repeat(4,1fr);gap:12px;margin-top:8px">
  <div class="card"><div class="val" style="color:{sc}">{score}%</div><div class="lbl">Score</div></div>
  <div class="card"><div class="val" style="color:#4CAF50">{qc.get('passed',0)}</div><div class="lbl">Passed</div></div>
  <div class="card"><div class="val" style="color:#FF9800">{qc.get('warned',0)}</div><div class="lbl">Warned</div></div>
  <div class="card"><div class="val" style="color:#f44336">{qc.get('failed',0)}</div><div class="lbl">Failed</div></div>
</div>
{"<p style='font-size:11px;color:#4CAF50;margin-top:8px'>🔧 Auto-fixed: " + "; ".join(qc.get('fixes',[])[:3]) + "</p>" if qc.get('fixes') else ""}
<p style='font-size:10px;color:rgba(255,248,231,.4);margin-top:6px'>Last run: {qc.get('ran_at','')[:16]}</p>
</div>"""

    # Load UI/UX data if available
    uiux_html = ""
    uiux_path = f"{REPORT_DIR}/ui_ux_last_result.json"
    if os.path.exists(uiux_path):
        with open(uiux_path) as f: uiux = json.load(f)
        us   = uiux.get("score", 0)
        usc  = "#4CAF50" if us >= 90 else "#FF9800" if us >= 70 else "#f44336"
        uiux_html = f"""<div class="section"><h2>🎨 Latest UI/UX Audit (ui_ux_bot)</h2>
<div class="grid" style="grid-template-columns:repeat(4,1fr);gap:12px;margin-top:8px">
  <div class="card"><div class="val" style="color:{usc}">{us}/100</div><div class="lbl">UI/UX Score</div></div>
  <div class="card"><div class="val" style="color:#f44336">{uiux.get('critical',0)}</div><div class="lbl">Critical</div></div>
  <div class="card"><div class="val" style="color:#FF9800">{uiux.get('warnings',0)}</div><div class="lbl">Warnings</div></div>
  <div class="card"><div class="val" style="color:#4CAF50">{uiux.get('auto_fixed',0)}</div><div class="lbl">Auto-Fixed</div></div>
</div>
<p style='font-size:10px;color:rgba(255,248,231,.4);margin-top:6px'>Files scanned: {uiux.get('files_scanned',0)} &nbsp;|&nbsp; Recommendations: {uiux.get('recommendations',0)} &nbsp;|&nbsp; Last run: {uiux.get('ran_at','')[:16]}</p>
<p style='font-size:10px;margin-top:4px'><a href='{uiux.get("report","")}' style='color:#C9A84C'>→ View Full UI/UX Report</a></p>
</div>"""

    html = f"""<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="refresh" content="3600">
<title>Jatramela Manager Dashboard — {date_str}</title>
<style>
  *{{box-sizing:border-box;margin:0;padding:0}}
  body{{font-family:'Segoe UI',sans-serif;background:#0d0600;color:#FFF8E7;padding:24px}}
  h1{{color:#C9A84C;font-size:22px;margin-bottom:4px}}
  h2{{font-size:13px;color:#C9A84C;margin:0 0 10px;border-bottom:1px solid rgba(201,168,76,.2);padding-bottom:5px}}
  .sub{{color:rgba(255,248,231,.4);font-size:11px;margin-bottom:24px}}
  .grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-bottom:20px}}
  .card{{background:rgba(255,248,231,.05);border:1px solid rgba(201,168,76,.2);border-radius:10px;padding:14px;text-align:center}}
  .val{{font-size:28px;font-weight:900;color:#C9A84C}}
  .lbl{{font-size:10px;color:rgba(255,248,231,.4);margin-top:4px}}
  .section{{background:rgba(255,255,255,.03);border:1px solid rgba(201,168,76,.1);border-radius:12px;padding:16px;margin-bottom:16px}}
  table{{width:100%;border-collapse:collapse}}
  th{{text-align:left;padding:7px 10px;font-size:10px;color:rgba(255,248,231,.4);border-bottom:1px solid rgba(255,255,255,.07)}}
  td{{padding:7px 10px;font-size:11px;border-bottom:1px solid rgba(255,255,255,.03)}}
  .badge{{display:inline-block;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:700}}
</style></head><body>
<h1>🌾 Jatramela Manager Bot — Operations Dashboard</h1>
<p class="sub">Last updated: {date_str} &nbsp;|&nbsp; Auto-refreshes hourly &nbsp;|&nbsp; Bots run by: manager_bot.py</p>

<div class="grid">
  <div class="card"><div class="val">{health['karnataka_products']}</div><div class="lbl">Karnataka Products</div></div>
  <div class="card"><div class="val">{health['published']}</div><div class="lbl">Published</div></div>
  <div class="card"><div class="val">{health['categories']}</div><div class="lbl">Categories</div></div>
  <div class="card"><div class="val">{health['orders']}</div><div class="lbl">Orders</div></div>
  <div class="card"><div class="val">{health['customers']}</div><div class="lbl">Customers</div></div>
  <div class="card"><div class="val">₹{health['revenue']:,.0f}</div><div class="lbl">Revenue (INR)</div></div>
</div>

{qc_html}

{uiux_html}

<div class="section">
<h2>🤖 Bot Task Assignments</h2>
<table><tr><th></th><th>Bot</th><th>Responsibility</th><th>Schedule</th><th>Last Run</th><th>Status</th></tr>
{task_rows}
</table></div>

<div class="section">
<h2>📋 Recent Bot Activity Log</h2>
<table><tr><th>Time</th><th>Bot</th><th>Result</th><th>Duration</th></tr>
{run_rows}
</table></div>

<div class="section">
<h2>📅 Today's Completed Tasks ({date_str[:10]})</h2>
{"<ul style='padding-left:18px;font-size:12px'>" + "".join(f"<li style='margin-bottom:4px;color:#4CAF50'>✅ {b} completed successfully</li>" for b in ran_bots) + "</ul>" if ran_bots else "<p style='font-size:12px;color:rgba(255,248,231,.4)'>No bots ran today yet.</p>"}
</div>
</body></html>"""

    path = f"{REPORT_DIR}/manager_dashboard_{datetime.now().strftime('%Y-%m-%d')}.html"
    with open(path, "w") as f:
        f.write(html)
    return path

# ─── Daily briefing message ───────────────────────────────────────────────────
def print_daily_briefing(log):
    now = datetime.now()
    print(f"\n  📋 MANAGER BOT DAILY BRIEFING — {now.strftime('%A, %d %B %Y')}")
    print(f"  {'─'*55}")
    
    due_bots = []
    for name, info in sorted(BOTS.items(), key=lambda x: x[1]["priority"]):
        due, reason = is_due(name, info, log)
        if due:
            due_bots.append((name, info, reason))

    if due_bots:
        print(f"  📌 Tasks assigned for today ({len(due_bots)} bots scheduled):")
        for name, info, reason in due_bots:
            print(f"     {info['emoji']} {name} — {reason}")
    else:
        print(f"  💤 All bots are up to date. No tasks due today.")
    print()

# ─── Main orchestration loop ──────────────────────────────────────────────────
def run(force=False, watch=False, daily_only=False, qc_only=False):
    print("\n" + "═"*62)
    print("  🤖 JATRAMELA MANAGER BOT STARTING")
    print(f"  Mode: {'--watch (continuous)' if watch else '--force (run all)' if force else 'standard'}")
    print("═"*62)

    log = load_log()

    while True:
        token = get_token()
        if not token:
            print("  ❌ Medusa server not reachable. Is it running on port 9000?")
            if not watch:
                break
            print("  ⏳ Retrying in 5 minutes...")
            time.sleep(300)
            continue

        health = store_health(token)
        print_dashboard(health, log)
        print_daily_briefing(log)

        ran_bots = []

        if qc_only:
            # Only run agent_bot
            result = run_bot("agent_bot", BOTS["agent_bot"])
            log.setdefault("runs", []).append(result)
            if result["success"]:
                log.setdefault("last_run", {})["agent_bot"] = result["ran_at"]
                ran_bots.append("agent_bot")
        else:
            # Determine which bots are due
            due = [(name, info) for name, info in
                   sorted(BOTS.items(), key=lambda x: x[1]["priority"])
                   if is_due(name, info, log, force=force)[0]]

            if daily_only:
                # Only run daily-scheduled bots
                due = [(n, i) for n, i in due if i["schedule_type"] == "daily"]

            if not due:
                print("  💤 No bots due. All tasks are up to date.\n")
            else:
                print(f"  🚀 Manager is assigning {len(due)} task(s) to the bot team:\n")
                for bot_name, bot_info in due:
                    result = run_bot(bot_name, bot_info)
                    log.setdefault("runs", []).append(result)
                    log.setdefault("task_history", []).append({
                        "bot":        bot_name,
                        "assigned":   datetime.now().isoformat(),
                        "success":    result["success"],
                        "duration_s": result["elapsed_s"],
                    })
                    if result["success"]:
                        log.setdefault("last_run", {})[bot_name] = result["ran_at"]
                        ran_bots.append(bot_name)

                save_log(log)

        # Generate HTML dashboard
        report = generate_html_dashboard(health, log, ran_bots)
        print(f"\n  📊 Dashboard: {report}")

        if not watch:
            # Open dashboard in browser
            subprocess.run(["open", report], capture_output=True)
            print(f"\n  ✅ Manager Bot complete. {len(ran_bots)} bot(s) executed.\n")
            break

        print(f"\n  ⏰ Watching... next check in 1 hour (Ctrl+C to stop)\n")
        time.sleep(3600)


if __name__ == "__main__":
    run(
        force      = "--force"  in sys.argv,
        watch      = "--watch"  in sys.argv,
        daily_only = "--daily"  in sys.argv,
        qc_only    = "--qc"     in sys.argv,
    )
