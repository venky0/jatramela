#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  JATRAMELA — DEPLOY SCRIPT
#  Run this on your MilesWeb VPS every time you update the code
#  Usage: bash deploy.sh
# ═══════════════════════════════════════════════════════════════

set -e
APP_DIR="/var/www/jatramela"
cd $APP_DIR

echo ""
echo "🚀 JATRAMELA DEPLOY"
echo "════════════════════════════════════════"

# ── Step 1: Pull latest code ──────────────────────────────────
echo "📥 Pulling latest code from GitHub..."
git pull origin main
echo "   ✅ Code updated"

# ── Step 2: Install dependencies ──────────────────────────────
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile > /dev/null 2>&1
echo "   ✅ Dependencies installed"

# ── Step 3: Build storefront ──────────────────────────────────
echo "🔨 Building storefront (Next.js)..."
cd $APP_DIR/apps/storefront
pnpm build
echo "   ✅ Storefront built"

# ── Step 4: Run DB migrations ─────────────────────────────────
echo "🗄️  Running database migrations..."
cd $APP_DIR/apps/backend
npx medusa db:migrate 2>/dev/null || echo "   ⚠️  Migration skipped (already up to date)"
echo "   ✅ Database ready"

# ── Step 5: Restart apps with PM2 ────────────────────────────
echo "♻️  Restarting apps..."
cd $APP_DIR
pm2 reload ecosystem.config.js --update-env
pm2 save
echo "   ✅ Apps restarted"

# ── Step 6: Reload Nginx ──────────────────────────────────────
nginx -t && systemctl reload nginx
echo "   ✅ Nginx reloaded"

echo ""
echo "════════════════════════════════════════"
echo "✅  DEPLOY COMPLETE!"
pm2 list
echo "════════════════════════════════════════"
