# Fix Nginx Configuration for tftr.alertaraqc.com

## 🔍 Problem
The command `grep -r "tftr.alertaraqc.com" /etc/nginx/ | grep root` returns nothing, meaning Nginx doesn't have a configuration for your subdomain yet.

## ✅ Solution Steps

### Step 1: Check What Nginx Configs Exist

```bash
# List all Nginx site configs
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/

# Check if there's a config for alertaraqc.com
grep -r "alertaraqc.com" /etc/nginx/

# Check Nginx main config
cat /etc/nginx/nginx.conf | grep -A 5 include
```

### Step 2: Check Hostinger Configuration

**Option A: Check Hostinger hPanel (Recommended First)**
1. Log in to Hostinger hPanel
2. Go to **Domains** → **Subdomains**
3. Find `tftr.alertaraqc.com`
4. Check if it's configured and what directory it points to
5. If not configured, create/configure it there

**Option B: Check if Hostinger uses a different config location**

Hostinger might use:
- `/etc/nginx/conf.d/` directory
- `/etc/nginx/vhosts/` directory
- Or auto-generate configs

```bash
# Check alternative locations
ls -la /etc/nginx/conf.d/ 2>/dev/null
ls -la /etc/nginx/vhosts/ 2>/dev/null
find /etc/nginx -name "*tftr*" 2>/dev/null
find /etc/nginx -name "*alertaraqc*" 2>/dev/null
```

### Step 3: Check if Subdomain Works Anyway

Sometimes Hostinger auto-configures but the config might be in a different format:

```bash
# Test if the subdomain responds
curl -I https://tftr.alertaraqc.com

# Check what server responds
curl -v https://tftr.alertaraqc.com 2>&1 | grep -i server
```

### Step 4: Create Nginx Config (if needed)

If the subdomain isn't configured, you may need to create the config. **However, on Hostinger, it's usually better to configure it via hPanel first.**

**If you need to create it manually:**

```bash
# Create Nginx config file
cat > /etc/nginx/sites-available/tftr.alertaraqc.com << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name tftr.alertaraqc.com;
    
    root /var/www/html/tftr/lgu-traffic-transport;
    index index.php index.html index.htm;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    location ~ /\.ht {
        deny all;
    }
}
EOF

# Enable the site
ln -s /etc/nginx/sites-available/tftr.alertaraqc.com /etc/nginx/sites-enabled/

# Test Nginx config
nginx -t

# Reload Nginx
systemctl reload nginx
```

**⚠️ Note:** Check your PHP version first:
```bash
php -v
# Then adjust the fastcgi_pass line (php8.2-fpm.sock, php8.1-fpm.sock, etc.)
```

### Step 5: Check PHP-FPM Socket

Find the correct PHP-FPM socket:

```bash
# Check PHP version
php -v

# Find PHP-FPM socket
ls -la /var/run/php/
# Or
ls -la /run/php/

# Common locations:
# /var/run/php/php8.2-fpm.sock
# /var/run/php/php8.1-fpm.sock
# /var/run/php/php-fpm.sock
```

## 🎯 Recommended Approach

**For Hostinger, the best approach is:**

1. **Configure via Hostinger hPanel:**
   - Go to **Domains** → **Subdomains**
   - Create/edit `tftr.alertaraqc.com`
   - Set Document Root to: `/var/www/html/tftr/lgu-traffic-transport`
   - Save

2. **Wait a few minutes** for Hostinger to generate the Nginx config

3. **Then verify:**
   ```bash
   grep -r "tftr.alertaraqc.com" /etc/nginx/
   ```

4. **Test the site:**
   ```bash
   curl -I https://tftr.alertaraqc.com
   ```

## 🔧 Quick Diagnostic Commands

Run these to understand your setup:

```bash
echo "=== 1. Check Nginx Sites ==="
ls -la /etc/nginx/sites-available/ | grep -E "tftr|alertaraqc"
ls -la /etc/nginx/sites-enabled/ | grep -E "tftr|alertaraqc"

echo ""
echo "=== 2. Search All Nginx Configs ==="
grep -r "tftr" /etc/nginx/ 2>/dev/null
grep -r "alertaraqc" /etc/nginx/ 2>/dev/null

echo ""
echo "=== 3. Check Alternative Locations ==="
ls -la /etc/nginx/conf.d/ 2>/dev/null
ls -la /etc/nginx/vhosts/ 2>/dev/null

echo ""
echo "=== 4. Test Subdomain ==="
curl -I https://tftr.alertaraqc.com 2>&1 | head -5

echo ""
echo "=== 5. Check PHP-FPM ==="
ls -la /var/run/php/ 2>/dev/null
ls -la /run/php/ 2>/dev/null
```

## ⚠️ Important Notes

1. **Hostinger usually auto-configures subdomains** when you create them in hPanel
2. **It may take a few minutes** for the config to be generated
3. **Don't manually edit Nginx configs** if Hostinger manages them (they might get overwritten)
4. **Always test Nginx config** before reloading: `nginx -t`

## 📋 Summary

**Most likely:** The subdomain needs to be configured in Hostinger hPanel first, then Nginx config will be auto-generated.

**Next steps:**
1. Check Hostinger hPanel → Domains → Subdomains
2. Configure `tftr.alertaraqc.com` if not done
3. Wait a few minutes
4. Verify Nginx config exists
5. Test the site
