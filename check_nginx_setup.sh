#!/bin/bash

# Script to diagnose Nginx configuration for tftr.alertaraqc.com

echo "=========================================="
echo "Nginx Configuration Diagnostic"
echo "=========================================="
echo ""

echo "1. Checking Nginx sites-available:"
ls -la /etc/nginx/sites-available/ 2>/dev/null | grep -E "tftr|alertaraqc" || echo "No tftr/alertaraqc configs found"
echo ""

echo "2. Checking Nginx sites-enabled:"
ls -la /etc/nginx/sites-enabled/ 2>/dev/null | grep -E "tftr|alertaraqc" || echo "No tftr/alertaraqc configs enabled"
echo ""

echo "3. Searching all Nginx configs for 'tftr':"
grep -r "tftr" /etc/nginx/ 2>/dev/null | head -10 || echo "No 'tftr' found in Nginx configs"
echo ""

echo "4. Searching all Nginx configs for 'alertaraqc':"
grep -r "alertaraqc" /etc/nginx/ 2>/dev/null | head -10 || echo "No 'alertaraqc' found in Nginx configs"
echo ""

echo "5. Checking alternative config locations:"
[ -d "/etc/nginx/conf.d" ] && echo "conf.d exists:" && ls -la /etc/nginx/conf.d/ | head -5 || echo "conf.d not found"
[ -d "/etc/nginx/vhosts" ] && echo "vhosts exists:" && ls -la /etc/nginx/vhosts/ | head -5 || echo "vhosts not found"
echo ""

echo "6. Testing subdomain response:"
curl -I https://tftr.alertaraqc.com 2>&1 | head -5
echo ""

echo "7. Checking PHP-FPM sockets:"
ls -la /var/run/php/ 2>/dev/null || ls -la /run/php/ 2>/dev/null || echo "PHP-FPM socket directory not found"
echo ""

echo "8. Checking Nginx status:"
systemctl status nginx --no-pager | head -5
echo ""

echo "=========================================="
echo "Summary"
echo "=========================================="
echo ""
echo "If no config found:"
echo "  1. Check Hostinger hPanel → Domains → Subdomains"
echo "  2. Configure tftr.alertaraqc.com there"
echo "  3. Set Document Root to: /var/www/html/tftr/lgu-traffic-transport"
echo "  4. Wait a few minutes for config to be generated"
echo ""
echo "If subdomain doesn't respond:"
echo "  - Subdomain may not be configured in Hostinger"
echo "  - DNS may not be pointing correctly"
echo "  - Nginx config may need to be created manually"
echo ""
