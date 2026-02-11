#!/bin/bash

# Script to fix Nginx config for tftr.alertaraqc.com

echo "=========================================="
echo "Fixing Nginx Configuration for tftr.alertaraqc.com"
echo "=========================================="
echo ""

# Check current config
echo "1. Checking current tftr.alertaraqc.com config:"
if [ -f "/etc/nginx/sites-available/tftr.alertaraqc.com" ]; then
    echo "Config file exists:"
    cat /etc/nginx/sites-available/tftr.alertaraqc.com
    echo ""
    
    # Check root directive
    ROOT_PATH=$(grep -E "^\s*root" /etc/nginx/sites-available/tftr.alertaraqc.com | awk '{print $2}' | tr -d ';')
    echo "Current root path: $ROOT_PATH"
    echo ""
    
    if [ "$ROOT_PATH" != "/var/www/html/tftr/lgu-traffic-transport" ]; then
        echo "⚠️  Root path is incorrect! Updating..."
    else
        echo "✅ Root path is correct"
    fi
else
    echo "❌ Config file not found!"
fi

echo ""
echo "2. Checking if config is enabled:"
if [ -L "/etc/nginx/sites-enabled/tftr.alertaraqc.com" ]; then
    echo "✅ Config is enabled (symlink exists)"
    ls -la /etc/nginx/sites-enabled/tftr.alertaraqc.com
else
    echo "⚠️  Config is NOT enabled"
fi

echo ""
echo "3. Checking default config (might be catching the request):"
grep -A 5 "server_name" /etc/nginx/sites-available/default | head -10

echo ""
echo "=========================================="
echo "Creating/Updating Config"
echo "=========================================="

# Find PHP-FPM socket
PHP_SOCKET=""
if [ -f "/var/run/php/php8.2-fpm.sock" ]; then
    PHP_SOCKET="/var/run/php/php8.2-fpm.sock"
elif [ -f "/var/run/php/php8.1-fpm.sock" ]; then
    PHP_SOCKET="/var/run/php/php8.1-fpm.sock"
elif [ -f "/var/run/php/php8.0-fpm.sock" ]; then
    PHP_SOCKET="/var/run/php/php8.0-fpm.sock"
else
    echo "Finding PHP-FPM socket..."
    PHP_SOCKET=$(ls /var/run/php/*.sock 2>/dev/null | head -1)
    if [ -z "$PHP_SOCKET" ]; then
        PHP_SOCKET=$(ls /run/php/*.sock 2>/dev/null | head -1)
    fi
fi

if [ -z "$PHP_SOCKET" ]; then
    echo "❌ Could not find PHP-FPM socket!"
    echo "Available sockets:"
    ls -la /var/run/php/ 2>/dev/null || ls -la /run/php/ 2>/dev/null
    exit 1
fi

echo "Using PHP-FPM socket: $PHP_SOCKET"
echo ""

# Create/update config with correct root
cat > /etc/nginx/sites-available/tftr.alertaraqc.com << EOF
server {
    listen 80;
    listen [::]:80;
    server_name tftr.alertaraqc.com;
    
    root /var/www/html/tftr/lgu-traffic-transport;
    index index.php index.html index.htm;
    
    # Logging
    access_log /var/log/nginx/tftr.alertaraqc.com.access.log;
    error_log /var/log/nginx/tftr.alertaraqc.com.error.log;
    
    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:${PHP_SOCKET};
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
        include fastcgi_params;
    }
    
    location ~ /\.ht {
        deny all;
    }
}
EOF

echo "✅ Created/updated config file"

# Remove existing symlink if it's a file (not symlink)
if [ -f "/etc/nginx/sites-enabled/tftr.alertaraqc.com" ] && [ ! -L "/etc/nginx/sites-enabled/tftr.alertaraqc.com" ]; then
    echo "Removing existing file (not symlink)..."
    rm /etc/nginx/sites-enabled/tftr.alertaraqc.com
fi

# Create/enable symlink
ln -sf /etc/nginx/sites-available/tftr.alertaraqc.com /etc/nginx/sites-enabled/tftr.alertaraqc.com
echo "✅ Enabled site"

# Test configuration
echo ""
echo "Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuration is valid"
    echo ""
    echo "Reloading Nginx..."
    systemctl reload nginx
    echo "✅ Nginx reloaded"
    echo ""
    echo "Verifying config:"
    grep -A 2 "server_name tftr.alertaraqc.com" /etc/nginx/sites-available/tftr.alertaraqc.com
    echo ""
    echo "Root directory:"
    grep "root" /etc/nginx/sites-available/tftr.alertaraqc.com
    echo ""
    echo "✅ Configuration updated successfully!"
    echo ""
    echo "Test the site:"
    echo "  curl -I http://tftr.alertaraqc.com"
    echo "  curl http://tftr.alertaraqc.com | head -20"
else
    echo "❌ Configuration test failed!"
    echo "Please check the error above."
fi
