#!/bin/bash

# Script to find the correct deployment directory
# Run this on your server via SSH

echo "=========================================="
echo "Finding Deployment Directory"
echo "=========================================="
echo ""

# Check if /var/www/html exists
echo "1. Checking /var/www/html directory..."
if [ -d "/var/www/html" ]; then
    echo "✅ /var/www/html exists"
    echo ""
    echo "Contents of /var/www/html:"
    ls -la /var/www/html/
    echo ""
else
    echo "❌ /var/www/html does not exist"
    echo "Checking alternative locations..."
    ls -la /var/www/ 2>/dev/null
    ls -la /home/ 2>/dev/null
fi

echo ""
echo "=========================================="
echo "2. Searching for existing project files..."
echo "=========================================="

# Search for SQL file
echo "Searching for lgu4_traffic_transport.sql..."
find /var/www -name "lgu4_traffic_transport.sql" -type f 2>/dev/null
find /home -name "lgu4_traffic_transport.sql" -type f 2>/dev/null

# Search for index.php with ALERTARA
echo ""
echo "Searching for index.php with ALERTARA..."
find /var/www -name "index.php" -type f -exec grep -l "ALERTARA" {} \; 2>/dev/null | head -5
find /home -name "index.php" -type f -exec grep -l "ALERTARA" {} \; 2>/dev/null | head -5

# Search for backend/config.php
echo ""
echo "Searching for backend/config.php..."
find /var/www -path "*/backend/config.php" -type f 2>/dev/null
find /home -path "*/backend/config.php" -type f 2>/dev/null

echo ""
echo "=========================================="
echo "3. Checking Nginx configuration..."
echo "=========================================="

# Check Nginx config for tftr subdomain
if [ -d "/etc/nginx" ]; then
    echo "Searching for tftr.alertaraqc.com in Nginx config..."
    grep -r "tftr.alertaraqc.com" /etc/nginx/ 2>/dev/null | head -10
    
    echo ""
    echo "Checking Nginx sites-available..."
    ls -la /etc/nginx/sites-available/ 2>/dev/null
    
    echo ""
    echo "Checking Nginx sites-enabled..."
    ls -la /etc/nginx/sites-enabled/ 2>/dev/null
else
    echo "❌ /etc/nginx not found"
fi

echo ""
echo "=========================================="
echo "4. Checking common Hostinger directories..."
echo "=========================================="

# Check common Hostinger paths
PATHS=(
    "/var/www/html"
    "/home/*/public_html"
    "/home/*/domains/*/public_html"
    "/var/www"
)

for path in "${PATHS[@]}"; do
    if [ -d "$path" ] 2>/dev/null || ls -d $path 2>/dev/null | head -1; then
        echo "Checking: $path"
        ls -la $path 2>/dev/null | head -10
        echo ""
    fi
done

echo ""
echo "=========================================="
echo "5. Checking for git repositories..."
echo "=========================================="

# Search for .git directories
echo "Searching for .git directories in /var/www..."
find /var/www -name ".git" -type d 2>/dev/null | head -10

echo ""
echo "=========================================="
echo "Summary"
echo "=========================================="
echo "Look for:"
echo "1. Directory containing lgu4_traffic_transport.sql"
echo "2. Directory with index.php containing ALERTARA"
echo "3. Nginx config showing root directory for tftr.alertaraqc.com"
echo ""
echo "If nothing found, you may need to CREATE the directory:"
echo "  mkdir -p /var/www/html/tftr"
echo "  cd /var/www/html/tftr"
echo "  git clone <your-repo-url> ."
