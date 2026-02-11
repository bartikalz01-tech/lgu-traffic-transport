# Quick Deployment Reference

## 🎯 Finding Your Deployment Directory

**Your Setup:**
- **Subdomain:** `tftr.alertaraqc.com`
- **Main Domain:** `alertaraqc.com`
- **Most Likely Directory:** `/var/www/html/tftr`

⚠️ **IMPORTANT:** If the subdomain doesn't exist yet:
1. **Create it first** in Hostinger hPanel → Domains → Subdomains
2. **Then create the directory** on the server
3. See `CREATE_SUBDOMAIN_AND_DEPLOY.md` for step-by-step instructions

**To Verify Directory:**
1. Check Hostinger hPanel → Domains → Subdomains → `tftr.alertaraqc.com` → Document Root
2. Or SSH and run: `ls -la /var/www/html/tftr`
3. Or search: `find /var/www/html -name "lgu4_traffic_transport.sql"`

See `FIND_DEPLOYMENT_DIRECTORY.md` for detailed instructions.

---

## 🚀 Quick Steps to Deploy

> ⚠️ **SAFETY NOTE:** All commands below only affect `/var/www/html/tftr/lgu-traffic-transport` and the `lgu4_traffic_transport` database. Other subdomains and systems are completely safe and unaffected.

### 1. Connect to Server
```bash
ssh root@72.60.209.226
# Password: YsqnXk6q#145
```

### 2. Navigate and Update Code

```bash
cd /var/www/html/tftr/lgu-traffic-transport

# Verify you're in the right place
ls -la
# Should see: index.php, backend/, api/, lgu4_traffic_transport.sql, etc.

# Check git remote to confirm it's your traffic transport repo
git remote -v

# Fix Git ownership issue first (if needed)
git config --global --add safe.directory /var/www/html/tftr/lgu-traffic-transport

# Proceed with:
git stash
git pull
git stash pop
```

### 3. Import Database

⚠️ **SAFETY:** Import **ONLY** affects `lgu4_traffic_transport`. Your `lgu4_admin_db_2026` database is **completely safe** and will **NOT** be touched.

**Option A: Using phpMyAdmin (Easiest & Safest)**
1. Go to Hostinger hPanel → Databases → phpMyAdmin
2. **IMPORTANT:** Select **ONLY** `lgu4_traffic_transport` from left sidebar
   - ⚠️ Make sure you're NOT in `lgu4_admin_db_2026`
   - ✅ Verify database name shows: `lgu4_traffic_transport`
3. Click **Import** → Choose `lgu4_traffic_transport.sql` → **Go**
4. ✅ Verify `lgu4_admin_db_2026` still exists and is untouched

**Option B: Using SSH (Safest - Explicit Database Name)**
```bash
# First, upload SQL file to server (from your local machine):
scp lgu4_traffic_transport.sql root@72.60.209.226:/var/www/html/tftr/lgu-traffic-transport/

# Then SSH and import:
ssh root@72.60.209.226
cd /var/www/html/tftr/lgu-traffic-transport

# Verify databases first (safety check)
mysql -u your_db_user -p -e "SHOW DATABASES;"
# Should show both lgu4_admin_db_2026 and lgu4_traffic_transport

# Import ONLY to lgu4_traffic_transport (explicit name = safe)
mysql -u your_db_user -p lgu4_traffic_transport < lgu4_traffic_transport.sql
#                                    ^^^^^^^^^^^^^^^^^^^^^^^^
#                                    Explicit database = lgu4_admin_db_2026 is safe

# Verify lgu4_admin_db_2026 is still intact
mysql -u your_db_user -p -e "USE lgu4_admin_db_2026; SHOW TABLES;"
```

### 4. Configure Database Connection

Edit `backend/config.php`:
```php
private $host = 'localhost';
private $user = 'your_hostinger_db_username';
private $password = 'your_hostinger_db_password';
private $dbname = 'lgu4_traffic_transport';
```

### 5. Set Permissions (Nginx)
```bash
# Nginx needs read access to files
chmod -R 755 /var/www/html/tftr/lgu-traffic-transport
chmod -R 644 /var/www/html/tftr/lgu-traffic-transport/*.php

# Verify Nginx can read (optional check)
# sudo -u www-data test -r /var/www/html/tftr/lgu-traffic-transport/index.php
```

### 6. Test
Visit: **https://tftr.alertaraqc.com**

---

## 📋 Where to Find Database Credentials

1. Log in to **Hostinger hPanel**
2. Go to **Databases** → **MySQL Databases**
3. You'll see:
   - Database name
   - Database username
   - Database password
   - Host (usually `localhost`)

---

## ⚠️ Important Notes

- **Never commit** `backend/config.php` with real credentials to Git
- The subdomain `tftr.alertaraqc.com` should already be configured in Hostinger
- Make sure PHP version is 7.4+ (check in hPanel)
- Enable SSL/HTTPS for your subdomain in Hostinger

---

## 🔧 Troubleshooting (Nginx)

**Page not loading?**
- Check file permissions: `ls -la /var/www/html/tftr/lgu-traffic-transport`
- Verify subdomain DNS is pointing correctly
- Check Nginx error logs: `tail -f /var/log/nginx/error.log`
- Verify Nginx is running: `systemctl status nginx`
- Test Nginx config: `nginx -t`

**Database connection error?**
- Double-check credentials in `backend/config.php`
- Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`
- Check database user permissions

**404 errors?**
- Nginx doesn't use `.htaccess` (Apache feature)
- Check Nginx server block configuration for `tftr.alertaraqc.com`
- Verify `root` directive points to correct directory
- Check if `index.php` is in the `index` directive
- Reload Nginx: `systemctl reload nginx`

**PHP not working?**
- Check PHP-FPM status: `systemctl status php-fpm`
- Check PHP-FPM error logs: `/var/log/php-fpm/error.log`
- Verify PHP-FPM socket/port in Nginx config matches PHP-FPM config
- Restart PHP-FPM: `systemctl restart php-fpm`
