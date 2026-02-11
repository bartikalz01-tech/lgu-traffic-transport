# Fix: tftr.alertaraqc.com Showing Wrong Content

## 🔍 Problem
When visiting `tftr.alertaraqc.com`, it's showing content from `alertaraqc.com` (main domain) instead of your traffic transport system.

## ✅ Solution

### Step 1: Check Current Config

```bash
# Check what the tftr config says
cat /etc/nginx/sites-available/tftr.alertaraqc.com

# Check what root directory it's using
grep "root" /etc/nginx/sites-available/tftr.alertaraqc.com
```

### Step 2: Verify Config is Enabled

```bash
# Check if symlink exists and points correctly
ls -la /etc/nginx/sites-enabled/tftr.alertaraqc.com

# Should show: tftr.alertaraqc.com -> /etc/nginx/sites-available/tftr.alertaraqc.com
```

### Step 3: Check Default Config (Might Be Catching It)

The default server block might be catching requests before tftr config:

```bash
# Check default config
grep -A 10 "server_name" /etc/nginx/sites-available/default | head -15
```

### Step 4: Fix the Config

The root directory might be wrong. Update it:

```bash
# Find PHP-FPM socket first
ls -la /var/run/php/

# Then create/update the config with CORRECT root
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
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    location ~ /\.ht {
        deny all;
    }
}
EOF

# Remove old symlink if it's a file
rm -f /etc/nginx/sites-enabled/tftr.alertaraqc.com

# Create new symlink
ln -s /etc/nginx/sites-available/tftr.alertaraqc.com /etc/nginx/sites-enabled/

# Test and reload
nginx -t && systemctl reload nginx
```

**Important:** Adjust `php8.2-fpm.sock` to match your PHP version (check with `ls -la /var/run/php/`).

### Step 5: Verify It's Working

```bash
# Test the site
curl -I http://tftr.alertaraqc.com

# Check what content it's serving
curl http://tftr.alertaraqc.com | head -30
# Should show your login form HTML, not the main domain content
```

## 🔧 Common Issues

### Issue 1: Default Server Block Catching Requests

If the default server block has `server_name _;` or `server_name alertaraqc.com;`, it might catch all requests.

**Solution:** Make sure your tftr config is loaded first, or ensure default doesn't catch tftr subdomain.

### Issue 2: Wrong Root Directory

The config might point to the wrong directory.

**Solution:** Verify root is `/var/www/html/tftr/lgu-traffic-transport`

### Issue 3: Config Not Enabled

The config exists but isn't enabled.

**Solution:** Check symlink: `ls -la /etc/nginx/sites-enabled/tftr.alertaraqc.com`

## 🚀 Quick Fix Script

I've created `fix_tftr_nginx_content.sh` that does all this automatically:

```bash
# Upload and run
scp fix_tftr_nginx_content.sh root@72.60.209.226:/root/
ssh root@72.60.209.226
chmod +x /root/fix_tftr_nginx_content.sh
/root/fix_tftr_nginx_content.sh
```

## ✅ After Fixing

1. **Test the site:**
   ```bash
   curl http://tftr.alertaraqc.com | grep -i "ALERTARA\|traffic\|login"
   # Should show your login form content
   ```

2. **Visit in browser:**
   - Go to: `http://tftr.alertaraqc.com`
   - Should see your traffic transport login form
   - NOT the main alertaraqc.com content

3. **Check Nginx logs:**
   ```bash
   tail -f /var/log/nginx/tftr.alertaraqc.com.access.log
   ```

## 📋 Verification Checklist

- [ ] Config file exists: `/etc/nginx/sites-available/tftr.alertaraqc.com`
- [ ] Root is correct: `/var/www/html/tftr/lgu-traffic-transport`
- [ ] Config is enabled: Symlink in `/etc/nginx/sites-enabled/`
- [ ] Nginx config test passes: `nginx -t`
- [ ] Site serves correct content: `curl http://tftr.alertaraqc.com`
