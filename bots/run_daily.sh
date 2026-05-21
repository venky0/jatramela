#!/bin/bash
# ============================================================
# JATRAMELA BOT AUTOMATION — Daily Runner Script
# Runs manager_bot.py which assigns all daily tasks
# Setup: chmod +x bots/run_daily.sh && ./bots/run_daily.sh --setup
# ============================================================

BOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$BOT_DIR")"
PYTHON="$(which python3)"
LOG="$BOT_DIR/reports/cron.log"

# Auto-detect python path
if [ -z "$PYTHON" ]; then
    PYTHON="/usr/local/bin/python3"
fi

# ── Run manager (called by cron) ─────────────────────────────
run_manager() {
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> "$LOG"
    echo "▶ $(date '+%Y-%m-%d %H:%M:%S') — Manager Bot starting" >> "$LOG"
    cd "$PROJECT_DIR" || exit 1
    $PYTHON bots/manager_bot.py --daily >> "$LOG" 2>&1
    echo "◀ $(date '+%Y-%m-%d %H:%M:%S') — Done" >> "$LOG"
}

# ── Setup macOS LaunchAgent for daily automation ──────────────
setup_launchd() {
    PLIST_DIR="$HOME/Library/LaunchAgents"
    PLIST="$PLIST_DIR/com.jatramela.managerbot.plist"
    mkdir -p "$PLIST_DIR"

    cat > "$PLIST" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.jatramela.managerbot</string>

    <key>ProgramArguments</key>
    <array>
        <string>$PYTHON</string>
        <string>$PROJECT_DIR/bots/manager_bot.py</string>
        <string>--daily</string>
    </array>

    <key>WorkingDirectory</key>
    <string>$PROJECT_DIR</string>

    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>6</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>

    <key>StandardOutPath</key>
    <string>$BOT_DIR/reports/manager_stdout.log</string>

    <key>StandardErrorPath</key>
    <string>$BOT_DIR/reports/manager_stderr.log</string>

    <key>RunAtLoad</key>
    <false/>

    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin</string>
    </dict>
</dict>
</plist>
EOF

    # Load the agent
    launchctl unload "$PLIST" 2>/dev/null
    launchctl load "$PLIST"

    echo "✅ LaunchAgent installed: Manager Bot runs daily at 6:00 AM"
    echo "   Plist: $PLIST"
    echo ""
    echo "   Commands:"
    echo "   Start now:  launchctl start com.jatramela.managerbot"
    echo "   Stop:       launchctl stop com.jatramela.managerbot"
    echo "   Remove:     launchctl unload $PLIST && rm $PLIST"
    echo "   View logs:  tail -f $BOT_DIR/reports/manager_stdout.log"
}

# ── Setup Linux Crontab for automation ───────────────────────
setup_cron() {
    CRON_TEMP=$(mktemp)
    crontab -l > "$CRON_TEMP" 2>/dev/null || true
    
    # 1. Run manager bot daily at 6:00 AM (runs daily QC agent_bot and daily due items)
    MANAGER_JOB="0 6 * * * $PYTHON $PROJECT_DIR/bots/manager_bot.py --daily >> $PROJECT_DIR/reports/manager_cron.log 2>&1"
    # 2. Run realtime bot hourly (updates weather, crowd levels, rituals for all temples)
    REALTIME_JOB="0 * * * * $PYTHON $PROJECT_DIR/bots/realtime_bot.py >> $PROJECT_DIR/reports/realtime_cron.log 2>&1"
    
    # Remove existing entries to prevent duplication
    sed -i '/manager_bot.py --daily/d' "$CRON_TEMP" 2>/dev/null || sed -i '' '/manager_bot.py --daily/d' "$CRON_TEMP" 2>/dev/null || true
    sed -i '/realtime_bot.py/d' "$CRON_TEMP" 2>/dev/null || sed -i '' '/realtime_bot.py/d' "$CRON_TEMP" 2>/dev/null || true
    
    # Append new jobs
    echo "$MANAGER_JOB" >> "$CRON_TEMP"
    echo "$REALTIME_JOB" >> "$CRON_TEMP"
    
    # Install new crontab
    crontab "$CRON_TEMP"
    rm "$CRON_TEMP"
    
    echo "✅ Linux Crontab configured successfully:"
    echo "   1. Manager Bot (daily QC) runs every day at 6:00 AM"
    echo "   2. Realtime Bot (live updates) runs every hour"
    echo "   View logs in: $PROJECT_DIR/bots/reports/"
}

# ── Remove daily automation ───────────────────────────────────
remove_launchd() {
    PLIST="$HOME/Library/LaunchAgents/com.jatramela.managerbot.plist"
    if [ -f "$PLIST" ]; then
        launchctl unload "$PLIST" 2>/dev/null
        rm "$PLIST"
        echo "✅ LaunchAgent removed. Daily automation stopped."
    else
        echo "⚠️  No LaunchAgent found."
    fi
}

remove_cron() {
    CRON_TEMP=$(mktemp)
    crontab -l > "$CRON_TEMP" 2>/dev/null || true
    
    sed -i '/manager_bot.py --daily/d' "$CRON_TEMP" 2>/dev/null || sed -i '' '/manager_bot.py --daily/d' "$CRON_TEMP" 2>/dev/null || true
    sed -i '/realtime_bot.py/d' "$CRON_TEMP" 2>/dev/null || sed -i '' '/realtime_bot.py/d' "$CRON_TEMP" 2>/dev/null || true
    
    crontab "$CRON_TEMP"
    rm "$CRON_TEMP"
    echo "✅ Linux Crontab automation removed."
}

# ── Main ─────────────────────────────────────────────────────
OS_TYPE="$(uname)"

case "${1}" in
    --setup)
        echo "🤖 Setting up Jatramela automation ($OS_TYPE)..."
        if [ "$OS_TYPE" = "Darwin" ]; then
            setup_launchd
        else
            setup_cron
        fi
        ;;
    --remove)
        echo "🤖 Removing Jatramela automation ($OS_TYPE)..."
        if [ "$OS_TYPE" = "Darwin" ]; then
            remove_launchd
        else
            remove_cron
        fi
        ;;
    --status)
        if [ "$OS_TYPE" = "Darwin" ]; then
            launchctl list | grep jatramela || echo "Not running (launchd)"
        else
            crontab -l | grep -E "manager_bot|realtime_bot" || echo "Not running (cron)"
        fi
        echo "Log: $LOG"
        tail -20 "$LOG" 2>/dev/null || echo "(no log yet)"
        ;;
    --run-now)
        echo "Running manager bot now..."
        run_manager
        ;;
    *)
        run_manager
        ;;
esac

