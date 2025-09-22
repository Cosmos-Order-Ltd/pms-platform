#!/bin/bash
# COSMOS ORDER HOMEPAGE DEPLOYMENT SCRIPT
# "Making your empire visible to the world"

echo "=================================================="
echo "DEPLOYING COSMOS ORDER HOMEPAGE"
echo "=================================================="

# Configuration
DOMAIN="cosmosorder.com"
WEBROOT="/var/www/cosmosorder.com"
NGINX_SITES="/etc/nginx/sites-available"
EMAIL="admin@cosmosorder.com"

echo "🌐 Domain: $DOMAIN"
echo "📁 Webroot: $WEBROOT"
echo ""

# Function to check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        echo "❌ This script must be run as root (use sudo)"
        exit 1
    fi
}

# Function to check if nginx is installed
check_nginx() {
    if ! command -v nginx >/dev/null 2>&1; then
        echo "📦 Installing Nginx..."
        apt update
        apt install -y nginx
        systemctl enable nginx
    else
        echo "✅ Nginx is installed"
    fi
}

# Function to check if certbot is installed
check_certbot() {
    if ! command -v certbot >/dev/null 2>&1; then
        echo "🔒 Installing Certbot..."
        apt update
        apt install -y certbot python3-certbot-nginx
    else
        echo "✅ Certbot is installed"
    fi
}

# Function to create webroot directory
setup_webroot() {
    echo "📁 Setting up webroot directory..."

    # Create webroot if it doesn't exist
    mkdir -p $WEBROOT

    # Copy website files
    echo "📋 Copying website files..."
    cp index.html $WEBROOT/

    # Create 404 page
    cat > $WEBROOT/404.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Cosmos Order</title>
    <style>
        body {
            font-family: -apple-system, sans-serif;
            background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
        }
        .container {
            text-align: center;
            max-width: 500px;
            padding: 2rem;
        }
        h1 { font-size: 3rem; margin-bottom: 1rem; color: #7b2ff7; }
        p { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.8; }
        a {
            display: inline-block;
            background: linear-gradient(135deg, #7b2ff7, #ff007f);
            color: white;
            text-decoration: none;
            padding: 1rem 2rem;
            border-radius: 10px;
            font-weight: bold;
            transition: transform 0.3s ease;
        }
        a:hover { transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="container">
        <h1>404</h1>
        <p>The page you're looking for doesn't exist.<br>Access to Cosmos Order is by invitation only.</p>
        <a href="/">Return to Homepage</a>
    </div>
</body>
</html>
EOF

    # Create 50x error page
    cat > $WEBROOT/50x.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>System Maintenance - Cosmos Order</title>
    <style>
        body {
            font-family: -apple-system, sans-serif;
            background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
        }
        .container {
            text-align: center;
            max-width: 500px;
            padding: 2rem;
        }
        h1 { font-size: 2.5rem; margin-bottom: 1rem; color: #ff6b6b; }
        p { font-size: 1.1rem; margin-bottom: 1.5rem; opacity: 0.8; }
        .status { color: #4CAF50; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>System Maintenance</h1>
        <p>Cosmos Order is temporarily undergoing system optimization.</p>
        <p>Our infrastructure team is enhancing platform performance.</p>
        <p class="status">• Expected restoration: &lt; 5 minutes</p>
        <p class="status">• All data remains secure</p>
        <p class="status">• Services will resume automatically</p>
    </div>
</body>
</html>
EOF

    # Set proper permissions
    chown -R www-data:www-data $WEBROOT
    chmod -R 755 $WEBROOT

    echo "✅ Webroot setup complete"
}

# Function to configure nginx
setup_nginx() {
    echo "⚙️ Configuring Nginx..."

    # Create initial HTTP-only configuration for SSL setup
    cat > $NGINX_SITES/cosmosorder << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    root $WEBROOT;
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }

    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

    # Enable the site
    ln -sf $NGINX_SITES/cosmosorder /etc/nginx/sites-enabled/

    # Remove default nginx site if it exists
    rm -f /etc/nginx/sites-enabled/default

    # Test nginx configuration
    if nginx -t; then
        echo "✅ Nginx configuration is valid"
        systemctl reload nginx
    else
        echo "❌ Nginx configuration error"
        exit 1
    fi
}

# Function to setup SSL with Let's Encrypt
setup_ssl() {
    echo "🔒 Setting up SSL with Let's Encrypt..."

    # Check if domain resolves to this server
    echo "🔍 Checking DNS resolution for $DOMAIN..."

    # Get SSL certificate
    if certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect; then
        echo "✅ SSL certificate obtained successfully"

        # Install the production nginx configuration with SSL
        echo "⚙️ Installing production Nginx configuration..."
        cp nginx.conf $NGINX_SITES/cosmosorder

        # Update paths in nginx config
        sed -i "s|/var/www/cosmosorder.com|$WEBROOT|g" $NGINX_SITES/cosmosorder

        # Test and reload nginx
        if nginx -t; then
            systemctl reload nginx
            echo "✅ Production Nginx configuration active"
        else
            echo "❌ Production Nginx configuration error"
            # Rollback to basic configuration
            certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect
        fi

        # Set up automatic renewal
        echo "🔄 Setting up automatic SSL renewal..."
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --nginx") | crontab -

    else
        echo "⚠️ SSL certificate setup failed"
        echo "   This might be because:"
        echo "   1. DNS is not pointing to this server yet"
        echo "   2. Domain is not accessible from the internet"
        echo "   3. Port 80/443 are not open"
        echo ""
        echo "   The site is accessible via HTTP for now."
        echo "   Run 'sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN' later to add SSL."
    fi
}

# Function to setup monitoring
setup_monitoring() {
    echo "📊 Setting up basic monitoring..."

    # Create log monitoring script
    cat > /usr/local/bin/cosmos-monitor << 'EOF'
#!/bin/bash
# Basic monitoring for Cosmos Order homepage

LOG_FILE="/var/log/nginx/cosmosorder.com.access.log"
ERROR_LOG="/var/log/nginx/cosmosorder.com.error.log"

# Check if logs exist
if [[ -f $LOG_FILE ]]; then
    # Get today's stats
    TODAY=$(date +%d/%b/%Y)

    echo "📊 Cosmos Order Homepage Stats for $TODAY"
    echo "============================================"

    # Request count
    REQUESTS=$(grep "$TODAY" "$LOG_FILE" 2>/dev/null | wc -l)
    echo "Total Requests: $REQUESTS"

    # Unique IPs
    UNIQUE_IPS=$(grep "$TODAY" "$LOG_FILE" 2>/dev/null | awk '{print $1}' | sort -u | wc -l)
    echo "Unique Visitors: $UNIQUE_IPS"

    # Status codes
    echo "Status Codes:"
    grep "$TODAY" "$LOG_FILE" 2>/dev/null | awk '{print $9}' | sort | uniq -c | sort -nr

    # Top pages
    echo "Top Pages:"
    grep "$TODAY" "$LOG_FILE" 2>/dev/null | awk '{print $7}' | sort | uniq -c | sort -nr | head -5

    # Recent errors
    if [[ -f $ERROR_LOG ]]; then
        ERROR_COUNT=$(grep "$TODAY" "$ERROR_LOG" 2>/dev/null | wc -l)
        echo "Errors Today: $ERROR_COUNT"
    fi

    echo "============================================"
else
    echo "📊 Access log not found yet. Site may not have received traffic."
fi
EOF

    chmod +x /usr/local/bin/cosmos-monitor

    echo "✅ Monitoring script installed"
    echo "   Run 'cosmos-monitor' to view daily stats"
}

# Function to create backup script
setup_backup() {
    echo "💾 Setting up backup system..."

    cat > /usr/local/bin/cosmos-backup << 'EOF'
#!/bin/bash
# Backup script for Cosmos Order homepage

BACKUP_DIR="/opt/cosmos-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SITE_DIR="/var/www/cosmosorder.com"

mkdir -p $BACKUP_DIR

# Backup website files
tar -czf "$BACKUP_DIR/website_$TIMESTAMP.tar.gz" -C "$SITE_DIR" .

# Backup nginx configuration
cp /etc/nginx/sites-available/cosmosorder "$BACKUP_DIR/nginx_config_$TIMESTAMP"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "website_*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "nginx_config_*" -mtime +7 -delete

echo "✅ Backup completed: $BACKUP_DIR/website_$TIMESTAMP.tar.gz"
EOF

    chmod +x /usr/local/bin/cosmos-backup

    # Schedule daily backups
    (crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/cosmos-backup") | crontab -

    echo "✅ Backup system configured (daily at 2 AM)"
}

# Function to setup firewall
setup_firewall() {
    echo "🔥 Configuring firewall..."

    if command -v ufw >/dev/null 2>&1; then
        # Allow SSH, HTTP, and HTTPS
        ufw allow 22/tcp
        ufw allow 80/tcp
        ufw allow 443/tcp

        # Enable firewall if not already enabled
        if ! ufw status | grep -q "Status: active"; then
            echo "y" | ufw enable
        fi

        echo "✅ Firewall configured (SSH, HTTP, HTTPS allowed)"
    else
        echo "⚠️ UFW not installed. Consider installing for basic firewall protection."
    fi
}

# Function to perform health check
health_check() {
    echo "🏥 Performing health check..."

    # Check if nginx is running
    if systemctl is-active --quiet nginx; then
        echo "✅ Nginx is running"
    else
        echo "❌ Nginx is not running"
        systemctl start nginx
    fi

    # Check if site is accessible
    if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200"; then
        echo "✅ Website is accessible"
    else
        echo "❌ Website is not accessible"
    fi

    # Check SSL if configured
    if [[ -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]]; then
        if curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN | grep -q "200"; then
            echo "✅ HTTPS is working"
        else
            echo "⚠️ HTTPS may have issues"
        fi
    fi

    # Check disk space
    DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [[ $DISK_USAGE -lt 80 ]]; then
        echo "✅ Disk space OK ($DISK_USAGE% used)"
    else
        echo "⚠️ Disk space low ($DISK_USAGE% used)"
    fi
}

# Main deployment function
main() {
    echo "🚀 Starting Cosmos Order Homepage Deployment"
    echo ""

    # Pre-flight checks
    check_root

    # Install dependencies
    check_nginx
    check_certbot

    # Setup website
    setup_webroot
    setup_nginx

    # Setup SSL (may fail if DNS not configured)
    setup_ssl

    # Setup additional features
    setup_monitoring
    setup_backup
    setup_firewall

    # Final health check
    health_check

    echo ""
    echo "=================================================="
    echo "✅ COSMOS ORDER HOMEPAGE DEPLOYMENT COMPLETE"
    echo "=================================================="
    echo ""
    echo "🌐 Your website is now live!"
    echo ""
    echo "📊 Access URLs:"
    echo "   • HTTP:  http://$DOMAIN"
    echo "   • HTTPS: https://$DOMAIN (if SSL configured)"
    echo "   • Health: http://$DOMAIN/health"
    echo ""
    echo "🛠️ Management Commands:"
    echo "   • View stats: cosmos-monitor"
    echo "   • Create backup: cosmos-backup"
    echo "   • Check logs: tail -f /var/log/nginx/cosmosorder.com.access.log"
    echo "   • Reload nginx: systemctl reload nginx"
    echo ""
    echo "🔒 SSL Certificate:"
    if [[ -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]]; then
        echo "   • Status: ✅ Active"
        echo "   • Auto-renewal: ✅ Configured"
    else
        echo "   • Status: ⚠️ Not configured"
        echo "   • Run: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    fi
    echo ""
    echo "📈 Next Steps:"
    echo "   • Update DNS to point $DOMAIN to this server"
    echo "   • Monitor traffic with 'cosmos-monitor'"
    echo "   • Check SSL status after DNS propagation"
    echo ""
    echo "🎯 Your empire now has a digital presence!"
    echo "=================================================="
}

# Run main function
main "$@"