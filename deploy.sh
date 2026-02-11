#!/bin/bash

# Deployment Script for Hostinger
# Usage: ./deploy.sh

echo "Starting deployment..."

# Navigate to project directory
cd /var/www/html/tftr/lgu-traffic-transport

# Fix Git ownership issue (if needed)
echo "Checking Git configuration..."
git config --global --add safe.directory /var/www/html/tftr/lgu-traffic-transport 2>/dev/null

# Stash any local changes
echo "Stashing local changes..."
git stash

# Pull latest changes
echo "Pulling latest changes from repository..."
git pull

# Pop stashed changes
echo "Applying stashed changes..."
git stash pop

# Set file permissions (SAFE - only affects current directory)
echo "Setting file permissions..."
# Verify we're in the correct directory
if [ "$PWD" != "/var/www/html/tftr/lgu-traffic-transport" ]; then
    echo "ERROR: Not in the correct directory! Current: $PWD"
    echo "Please run this script from /var/www/html/tftr/lgu-traffic-transport"
    exit 1
fi

# Set permissions only for current directory (safe)
find . -maxdepth 10 -type d -exec chmod 755 {} \;
find . -maxdepth 10 -type f -exec chmod 644 {} \;

echo "Deployment complete!"
echo ""
echo "Nginx-specific notes:"
echo "- Nginx doesn't use .htaccess files"
echo "- PHP is handled via PHP-FPM"
echo "- Check logs: /var/log/nginx/error.log if issues occur"
echo ""
echo "Don't forget to:"
echo "1. Update database credentials in backend/config.php"
echo "2. Import database if needed: mysql -u user -p database_name < lgu4_traffic_transport.sql"
echo "3. Test the application at https://tftr.alertaraqc.com"
echo "4. If PHP not working, check PHP-FPM: systemctl status php-fpm"
