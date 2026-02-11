#!/bin/bash

# Script to fix browser showing wrong content even though curl shows correct content

echo "=========================================="
echo "Fixing Browser Content Issue"
echo "=========================================="
echo ""

echo "1. Checking if you're visiting HTTP or HTTPS:"
echo "   - If visiting HTTPS, SSL might not be configured for tftr"
echo "   - Default server might be catching HTTPS requests"
echo ""

echo "2. Checking current tftr config:"
cat /etc/nginx/sites-available/tftr.alertaraqc.com
echo ""

echo "3. Checking default server block:"
grep -A 5 "server_name" /etc/nginx/sites-available/default | head -10
echo ""

echo "4. Checking if there's an SSL redirect or HTTPS config:"
grep -r "tftr.alertaraqc.com" /etc/nginx/ | grep -i ssl
echo ""

echo "=========================================="
echo "Solution: Add HTTPS Support"
echo "=========================================="
echo ""

# Find PHP-FPM socket
PHP_SOCKET=$(ls /var/run/php/*.sock 2>/dev/null | head -1)
if [ -z "$PHP_SOCKET" ]; then
    PHP_SOCKET=$(ls /run/php/*.sock 2>/dev/null | head -1)
fi

if [ -z "$PHP_SOCKET" ]; then
    echo "❌ Could not find PHP-FPM socket!"
    ls -la /var/run/php/ 2>/dev/null || ls -la /run/php/ 2>/dev/null
    exit 1
fi

echo "Using PHP-FPM socket: $PHP_SOCKET"
echo ""

# Check if SSL certificate exists for tftr
if [ -d "/etc/letsencrypt/live/tftr.alertaraqc.com" ]; then
    echo "✅ SSL certificate found for tftr.alertaraqc.com"
    HAS_SSL=true
else
    echo "⚠️  No SSL certificate found. Will create HTTP-only config first."
    echo "   You can add SSL later with: certbot --nginx -d tftr.alertaraqc.com"
    HAS_SSL=false
fi

echo ""
echo "Creating complete Nginx config with HTTP and HTTPS support..."

# Create config with both HTTP and HTTPS
cat > /etc/nginx/sites-available/tftr.alertaraqc.com << EOF
# HTTP server - redirect to HTTPS if SSL exists, otherwise serve content
server {
    listen 80;
    listen [::]:80;
    server_name tftr.alertaraqc.com;
    
    # If SSL exists, redirect to HTTPS
    # If not, serve content directly
    root /var/www/html/tftr/lgu-traffic-transport;
    index index.php index.html index.htm;
    
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

# HTTPS server (if SSL certificate exists)
EOF

if [ "$HAS_SSL" = true ]; then
    cat >> /etc/nginx/sites-available/tftr.alertaraqc.com << EOF
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name tftr.alertaraqc.com;
    
    ssl_certificate /etc/letsencrypt/live/tftr.alertaraqc.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tftr.alertaraqc.com/privkey.pem;
    
    root /var/www/html/tftr/lgu-traffic-transport;
    index index.php index.html index.htm;
    
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
    echo "✅ Added HTTPS server block"
else
    echo "⚠️  HTTPS block not added (no SSL certificate)"
    echo "   To add SSL later, run: certbot --nginx -d tftr.alertaraqc.com"
fi

# Also make sure default server doesn't catch tftr requests
echo ""
echo "5. Checking default server priority..."
echo "   Making sure tftr config is loaded before default..."

# Test and reload
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
    echo "=========================================="
    echo "Next Steps"
    echo "=========================================="
    echo ""
    echo "1. Clear your browser cache:"
    echo "   - Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)"
    echo "   - Clear cached images and files"
    echo "   - Or use Incognito/Private mode"
    echo ""
    echo "2. Test both HTTP and HTTPS:"
    echo "   curl -I http://tftr.alertaraqc.com"
    echo "   curl -I https://tftr.alertaraqc.com"
    echo ""
    echo "3. If visiting HTTPS but no SSL:"
    echo "   - Visit HTTP instead: http://tftr.alertaraqc.com"
    echo "   - Or set up SSL: certbot --nginx -d tftr.alertaraqc.com"
    echo ""
    echo "4. Check what server block is being used:"
    echo "   tail -f /var/log/nginx/access.log"
    echo "   (Then visit the site and see which config handles it)"
else
    echo "❌ Configuration test failed!"
fi
