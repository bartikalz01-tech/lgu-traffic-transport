# Create tftr Subdomain and Deploy

## 🎯 Situation
The `tftr.alertaraqc.com` subdomain doesn't exist yet. You need to create it first, then deploy your traffic transport system.

## Step 1: Create Subdomain in Hostinger hPanel

### Option A: Via Hostinger hPanel (Recommended)

1. **Log in to Hostinger hPanel**
   - Go to: https://hpanel.hostinger.com
   - Enter your credentials

2. **Navigate to Subdomains**
   - Click **"Domains"** in the left sidebar
   - Click **"Subdomains"** or **"Advanced"** → **"Subdomains"**

3. **Create New Subdomain**
   - Click **"Create Subdomain"** or **"Add Subdomain"** button
   - **Subdomain name:** `tftr`
   - **Domain:** `alertaraqc.com` (should be pre-selected)
   - **Document Root:** `/var/www/html/tftr` (or leave default, we'll update it)
   - Click **"Create"** or **"Add"**

4. **Note the Directory Path**
   - After creation, note the **Document Root** path
   - It might be `/var/www/html/tftr` or similar
   - If it's different, we'll use that path

### Option B: Check if Subdomain Already Exists

Sometimes subdomains exist but aren't configured yet. Check:

1. In hPanel → **Domains** → **Subdomains**
2. Look for `tftr.alertaraqc.com` in the list
3. If it exists, click on it to see/edit the Document Root

---

## Step 2: Create Directory on Server

After creating the subdomain in Hostinger, create the directory on your server:

```bash
# SSH into server
ssh root@72.60.209.226

# Create the directory
mkdir -p /var/www/html/tftr

# Set proper permissions
chmod 755 /var/www/html/tftr

# Set ownership (Nginx runs as www-data)
chown -R www-data:www-data /var/www/html/tftr

# Verify it was created
ls -la /var/www/html/tftr
```

**Note:** If Hostinger created a different directory path, use that path instead.

---

## Step 3: Deploy Your Code

### Option A: Clone from Git Repository

```bash
# Navigate to the directory
cd /var/www/html/tftr

# Clone your repository
git clone <your-git-repository-url> .

# Set permissions
chmod -R 755 /var/www/html/tftr
chmod -R 644 /var/www/html/tftr/*.php
```

### Option B: Upload Files via SCP

From your local machine:

```bash
# Upload all files
scp -r * root@72.60.209.226:/var/www/html/tftr/

# Or upload specific files
scp index.php root@72.60.209.226:/var/www/html/tftr/
scp -r backend root@72.60.209.226:/var/www/html/tftr/
scp -r api root@72.60.209.226:/var/www/html/tftr/
# ... etc
```

### Option C: Use Git if Directory Already Has Repository

If the directory was created by Hostinger and has a git repo:

```bash
cd /var/www/html/tftr
git remote -v  # Check current remote
git remote set-url origin <your-new-repo-url>  # Update if needed
git pull origin main  # Or your branch name
```

---

## Step 4: Verify Nginx Configuration

After creating the subdomain, check if Nginx config was created:

```bash
# Check if Nginx config exists
ls -la /etc/nginx/sites-available/ | grep tftr
ls -la /etc/nginx/sites-enabled/ | grep tftr

# If config exists, check it
cat /etc/nginx/sites-enabled/tftr.alertaraqc.com 2>/dev/null
# Or
cat /etc/nginx/sites-available/tftr.alertaraqc.com 2>/dev/null

# Look for the "root" directive - should point to /var/www/html/tftr
```

**If Nginx config doesn't exist:**
- Hostinger usually auto-creates it
- If not, you may need to create it manually or contact Hostinger support

---

## Step 5: Test the Subdomain

1. **Wait a few minutes** for DNS propagation (if new subdomain)
2. **Visit:** `https://tftr.alertaraqc.com`
3. **Check if it loads:**
   - If 404: Directory might be wrong, check Nginx config
   - If 403: Permission issue, check file permissions
   - If blank: PHP might not be working, check PHP-FPM

---

## Step 6: Import Database

After files are deployed, import your database:

```bash
cd /var/www/html/tftr

# Upload SQL file first (from local machine)
scp lgu4_traffic_transport.sql root@72.60.209.226:/var/www/html/tftr/

# Then import
mysql -u your_db_user -p lgu4_traffic_transport < lgu4_traffic_transport.sql
```

See `DEPLOYMENT.md` for detailed database import instructions.

---

## Step 7: Configure Database Connection

Edit `backend/config.php` with your database credentials:

```bash
cd /var/www/html/tftr
nano backend/config.php
# Or use vi: vi backend/config.php

# Update with your Hostinger database credentials
```

---

## 🔧 Troubleshooting

### Subdomain Not Loading?

1. **Check DNS:**
   ```bash
   nslookup tftr.alertaraqc.com
   # Should resolve to your server IP
   ```

2. **Check Nginx:**
   ```bash
   nginx -t  # Test config
   systemctl reload nginx  # Reload if config changed
   ```

3. **Check Permissions:**
   ```bash
   ls -la /var/www/html/tftr
   # Should be readable by www-data
   ```

4. **Check PHP-FPM:**
   ```bash
   systemctl status php-fpm
   ```

### Directory Path Different?

If Hostinger created a different path (like `/home/user/public_html/tftr`):

1. Use that path instead of `/var/www/html/tftr`
2. Update all deployment commands to use the correct path
3. The path should match what's shown in Hostinger hPanel

---

## 📋 Quick Checklist

- [ ] Created subdomain `tftr.alertaraqc.com` in Hostinger hPanel
- [ ] Created directory on server (usually `/var/www/html/tftr`)
- [ ] Set proper permissions (755 for directories, 644 for files)
- [ ] Deployed code (git clone or file upload)
- [ ] Verified Nginx configuration exists
- [ ] Tested subdomain in browser
- [ ] Imported database
- [ ] Updated `backend/config.php` with database credentials
- [ ] Tested application functionality

---

## 🎯 Summary

**The subdomain doesn't exist yet because:**
1. It hasn't been created in Hostinger hPanel
2. The directory hasn't been created on the server
3. Nginx hasn't been configured for it

**Solution:**
1. Create subdomain in Hostinger hPanel first
2. Create directory on server
3. Deploy your code
4. Import database
5. Configure and test

Once created, you can use all the deployment commands from `DEPLOYMENT.md` and `QUICK_DEPLOY.md`.
