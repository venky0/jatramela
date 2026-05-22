#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  JATRAMELA — FIRST-TIME CODE UPLOAD TO MILESWEB VPS
#  Run this on YOUR MAC after getting VPS IP from MilesWeb email
#  Usage: bash upload-to-server.sh YOUR_VPS_IP yourdomain.in
# ═══════════════════════════════════════════════════════════════

VPS_IP=${1:-"YOUR_MILESWEB_VPS_IP"}
DOMAIN=${2:-"jatramela.com"}
APP_DIR="/var/www/jatramela"

echo ""
echo "📤 UPLOADING JATRAMELA TO MILESWEB VPS"
echo "════════════════════════════════════════"
echo "VPS IP:  $VPS_IP"
echo "Domain:  $DOMAIN"
echo ""

# Step 1: Run server setup on VPS
echo "⚙️  Step 1: Setting up server software on VPS..."
ssh root@$VPS_IP "bash -s" < setup-server.sh $DOMAIN
echo "✅ Server software installed"

# Step 2: Upload the code via rsync
echo ""
echo "📦 Step 2: Uploading Jatramela code..."
rsync -avz --progress \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='.env' \
  --exclude='.env.local' \
  --exclude='bots/reports' \
  /Users/venky/Desktop/venky/jatramela/ \
  root@$VPS_IP:$APP_DIR/
echo "✅ Code uploaded"

# Step 3: Upload env files separately (not in rsync exclude)
echo ""
echo "🔒 Step 3: You need to manually set up .env files on server."
echo "   SSH into server: ssh root@$VPS_IP"
echo "   Then edit:       nano $APP_DIR/apps/backend/.env"
echo "   And:             nano $APP_DIR/apps/storefront/.env.production"
echo ""
echo "   Use the values from:"
echo "   - /root/jatramela-credentials.txt (for DB_URL)"
echo "   - apps/backend/.env.production.template"
echo "   - apps/storefront/.env.production.template"

echo ""
echo "════════════════════════════════════════"
echo "✅ Upload complete!"
echo ""
echo "NEXT STEPS (run on VPS):"
echo "  1. ssh root@$VPS_IP"
echo "  2. cat /root/jatramela-credentials.txt"
echo "  3. nano /var/www/jatramela/apps/backend/.env"
echo "  4. nano /var/www/jatramela/apps/storefront/.env.production"
echo "  5. bash /var/www/jatramela/deploy.sh"
echo "  6. certbot --nginx -d $DOMAIN -d www.$DOMAIN -d api.$DOMAIN"
echo "════════════════════════════════════════"
