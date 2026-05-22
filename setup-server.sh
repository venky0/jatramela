#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  JATRAMELA — ONE-CLICK SERVER SETUP SCRIPT
#  Run on a fresh MilesWeb VPS (Ubuntu 22.04 LTS)
#  Usage: bash setup-server.sh yourdomain.com
# ═══════════════════════════════════════════════════════════════

set -e  # Exit on any error
DOMAIN=${1:-"jatramela.com"}
API_DOMAIN="api.$DOMAIN"
APP_DIR="/var/www/jatramela"
DB_NAME="jatramela"
DB_USER="jatramela_user"
DB_PASS=$(openssl rand -hex 16)

echo ""
echo "🚀 JATRAMELA SERVER SETUP"
echo "════════════════════════════════════════"
echo "Domain:     $DOMAIN"
echo "API Domain: $API_DOMAIN"
echo "App Dir:    $APP_DIR"
echo "════════════════════════════════════════"
echo ""

# ── 1. System Update ──────────────────────────────────────────
echo "📦 Step 1/10: Updating system..."
apt-get update -qq && apt-get upgrade -y -qq

# ── 2. Install Node.js 20 ─────────────────────────────────────
echo "⚙️  Step 2/10: Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1
apt-get install -y nodejs > /dev/null 2>&1
npm install -g pm2 pnpm > /dev/null 2>&1
echo "   ✅ Node $(node -v) | pnpm $(pnpm -v) | pm2 $(pm2 -v)"

# ── 3. Install PostgreSQL ─────────────────────────────────────
echo "🗄️  Step 3/10: Installing PostgreSQL..."
apt-get install -y postgresql postgresql-contrib > /dev/null 2>&1
systemctl enable postgresql --now > /dev/null 2>&1

# Create DB and user
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null || true
echo "   ✅ PostgreSQL ready | DB: $DB_NAME | User: $DB_USER"

# ── 4. Install Redis ──────────────────────────────────────────
echo "⚡ Step 4/10: Installing Redis..."
apt-get install -y redis-server > /dev/null 2>&1
systemctl enable redis-server --now > /dev/null 2>&1
echo "   ✅ Redis running on 127.0.0.1:6379"

# ── 5. Install Nginx ──────────────────────────────────────────
echo "🌐 Step 5/10: Installing Nginx..."
apt-get install -y nginx > /dev/null 2>&1
systemctl enable nginx --now > /dev/null 2>&1
echo "   ✅ Nginx installed"

# ── 6. Install Git & Certbot ──────────────────────────────────
echo "🔒 Step 6/10: Installing Git + SSL tools..."
apt-get install -y git certbot python3-certbot-nginx > /dev/null 2>&1
echo "   ✅ Git & Certbot installed"

# ── 7. Create app directory ───────────────────────────────────
echo "📁 Step 7/10: Setting up app directory..."
mkdir -p $APP_DIR
cd $APP_DIR
echo "   ✅ App directory: $APP_DIR"

# ── 8. Setup Nginx config ─────────────────────────────────────
echo "🔧 Step 8/10: Configuring Nginx..."

cat > /etc/nginx/sites-available/jatramela << NGINX
# ── Storefront (Next.js on port 3000) ────────────────────────
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    # Gzip
    gzip on;
    gzip_types text/plain application/json application/javascript text/css;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 60s;
    }

    # Static files — cached aggressively
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /images/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }
}

# ── Medusa Backend (port 9000) ────────────────────────────────
server {
    listen 80;
    server_name $API_DOMAIN;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 120s;
    }
}
NGINX

# Enable site
ln -sf /etc/nginx/sites-available/jatramela /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
echo "   ✅ Nginx configured for $DOMAIN and $API_DOMAIN"

# ── 9. Setup PM2 ecosystem file ───────────────────────────────
echo "⚙️  Step 9/10: Creating PM2 config..."

cat > $APP_DIR/ecosystem.config.js << PM2
module.exports = {
  apps: [
    {
      name: "jatramela-backend",
      cwd: "$APP_DIR/apps/backend",
      script: "npm",
      args: "run start",
      env: { NODE_ENV: "production", PORT: 9000 },
      max_memory_restart: "512M",
      restart_delay: 3000,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
    {
      name: "jatramela-storefront",
      cwd: "$APP_DIR/apps/storefront",
      script: "npm",
      args: "run start",
      env: { NODE_ENV: "production", PORT: 3000 },
      max_memory_restart: "512M",
      restart_delay: 3000,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
}
PM2

# Setup PM2 to start on boot
pm2 startup systemd -u root --hp /root > /dev/null 2>&1
echo "   ✅ PM2 ecosystem config created"

# ── 10. Save credentials ──────────────────────────────────────
echo "📋 Step 10/10: Saving credentials..."

cat > /root/jatramela-credentials.txt << CREDS
═══════════════════════════════════════════════════
  JATRAMELA SERVER CREDENTIALS — KEEP PRIVATE!
═══════════════════════════════════════════════════
Domain:           $DOMAIN
API Domain:       $API_DOMAIN
App Directory:    $APP_DIR

Database:
  Host:           localhost
  Port:           5432
  Name:           $DB_NAME
  User:           $DB_USER
  Password:       $DB_PASS
  Connection URL: postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME

Redis:            redis://localhost:6379

PM2 Commands:
  pm2 list           — see running apps
  pm2 logs           — see all logs
  pm2 restart all    — restart both apps
  pm2 monit          — live dashboard

Next Steps:
  1. Upload your code to $APP_DIR
  2. Fill in .env files (see /root/env-templates/)
  3. Run: cd $APP_DIR && bash deploy.sh
  4. Run: certbot --nginx -d $DOMAIN -d www.$DOMAIN -d $API_DOMAIN
═══════════════════════════════════════════════════
CREDS

chmod 600 /root/jatramela-credentials.txt

echo ""
echo "════════════════════════════════════════════════════"
echo "✅  SERVER SETUP COMPLETE!"
echo "════════════════════════════════════════════════════"
echo ""
echo "  Database URL: postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME"
echo "  Credentials saved to: /root/jatramela-credentials.txt"
echo ""
echo "  NEXT STEP: Upload your code, then run deploy.sh"
echo "════════════════════════════════════════════════════"
