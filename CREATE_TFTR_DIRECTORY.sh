#!/bin/bash

# Script to create tftr directory and set it up for deployment
# Run this after creating the subdomain in Hostinger hPanel

echo "=========================================="
echo "Creating tftr Directory for Deployment"
echo "=========================================="
echo ""

# Check if directory already exists
if [ -d "/var/www/html/tftr" ]; then
    echo "⚠️  Directory /var/www/html/tftr already exists!"
    echo "Contents:"
    ls -la /var/www/html/tftr
    echo ""
    read -p "Continue anyway? (yes/no): " CONTINUE
    if [ "$CONTINUE" != "yes" ]; then
        echo "Exiting..."
        exit 0
    fi
else
    echo "Creating directory /var/www/html/tftr..."
    mkdir -p /var/www/html/tftr
    if [ $? -eq 0 ]; then
        echo "✅ Directory created successfully"
    else
        echo "❌ Failed to create directory"
        exit 1
    fi
fi

# Set permissions
echo ""
echo "Setting permissions..."
chmod 755 /var/www/html/tftr
chown -R www-data:www-data /var/www/html/tftr

# Verify
echo ""
echo "Verifying directory..."
ls -ld /var/www/html/tftr
echo ""

# Check Nginx config
echo "=========================================="
echo "Checking Nginx Configuration"
echo "=========================================="
if grep -r "tftr.alertaraqc.com" /etc/nginx/ 2>/dev/null | head -1; then
    echo "✅ Nginx configuration found for tftr.alertaraqc.com"
    echo ""
    echo "Nginx config:"
    grep -r "tftr.alertaraqc.com" /etc/nginx/ 2>/dev/null | head -3
else
    echo "⚠️  Nginx configuration not found"
    echo "Make sure you created the subdomain in Hostinger hPanel"
    echo "It may take a few minutes for Nginx config to be created"
fi

echo ""
echo "=========================================="
echo "Next Steps"
echo "=========================================="
echo "1. If subdomain not created yet:"
echo "   - Go to Hostinger hPanel → Domains → Subdomains"
echo "   - Create subdomain: tftr.alertaraqc.com"
echo "   - Set Document Root to: /var/www/html/tftr"
echo ""
echo "2. Deploy your code:"
echo "   cd /var/www/html/tftr"
echo "   git clone <your-repo-url> ."
echo "   # Or upload files via SCP/FTP"
echo ""
echo "3. Set file permissions:"
echo "   chmod -R 755 /var/www/html/tftr"
echo "   chmod -R 644 /var/www/html/tftr/*.php"
echo ""
echo "4. Import database (see DEPLOYMENT.md)"
echo ""
echo "5. Update backend/config.php with database credentials"
echo ""
echo "✅ Directory is ready for deployment!"
