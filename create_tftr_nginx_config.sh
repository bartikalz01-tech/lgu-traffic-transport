#!/bin/bash

# Script to create Nginx configuration for tftr.alertaraqc.com

echo "Creating Nginx configuration for tftr.alertaraqc.com..."

# First, check PHP version to get correct FPM socket
PHP_VERSION=$(php -v | head -1 | grep -oP '\d+\.\d+' | head -1)
echo "Detected PHP version: $PHP_VERSION"

# Find PHP-FPM socket
PHP_SOCKET=""
if [ -f "/var/run/php/php${PHP_VERSION}-fpm.sock" ]; then
    PHP_SOCKET="/var/run/php/php${PHP_VERSION}-fpm.sock"
elif [ -f "/run/php/php${PHP_VERSION}-fpm.sock" ]; then
    PHP_SOCKET="/run/php/php${PHP_VERSION}-fpm.sock"
elif [ -f "/var/run/php/php-fpm.sock" ]; then
    PHP_SOCKET="/var/run/php/php-fpm.sock"
else
    echo "Warning: Could not find PHP-FPM socket. Checking available sockets..."
    ls -la /var/run/php/ 2>/dev/null || ls -la /run/php/ 2>/dev/null
    read -p "Enter PHP-FPM socket path (e.g., /var/run/php/php8.2-fpm.sock): " PHP_SOCKET
fi

echo "Using PHP-FPM socket: $PHP_SOCKET"

# Create Nginx config file
cat > /etc/nginx/sites-available/tftr.alertaraqc.com << EOF
server {
    listen 80;
    listen [::]:80;
    server_name tftr.alertaraqc.com;
    
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

echo "✅ Created /etc/nginx/sites-available/tftr.alertaraqc.com"

# Enable the site
ln -sf /etc/nginx/sites-available/tftr.alertaraqc.com /etc/nginx/sites-enabled/tftr.alertaraqc.com
echo "✅ Enabled site"

# Test Nginx configuration
echo ""
echo "Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    echo ""
    echo "Reloading Nginx..."
    systemctl reload nginx
    echo "✅ Nginx reloaded"
    echo ""
    echo "Configuration created successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Test the site: curl -I http://tftr.alertaraqc.com"
    echo "2. Set up SSL certificate (optional): certbot --nginx -d tftr.alertaraqc.com"
else
    echo "❌ Nginx configuration test failed!"
    echo "Please check the configuration file manually."
fi
