# Next Steps After Deploying GitHub Repository

## ✅ What You've Done
- ✅ Created subdomain `tftr.alertaraqc.com` in Hostinger
- ✅ Created directory `/var/www/html/tftr/lgu-traffic-transport`
- ✅ Deployed GitHub repository

## 🚀 Next Steps

### Step 1: Verify Files Are Deployed

```bash
cd /var/www/html/tftr/lgu-traffic-transport

# Check if all files are there
ls -la

# Should see:
# ✅ index.php
# ✅ backend/ directory
# ✅ api/ directory
# ✅ lgu4_traffic_transport.sql
# ✅ accident_reports/ directory
# ✅ etc.
```

### Step 2: Set File Permissions (Nginx)

```bash
# Make sure you're in the project directory
cd /var/www/html/tftr/lgu-traffic-transport

# Set directory permissions
find . -type d -exec chmod 755 {} \;

# Set file permissions
find . -type f -exec chmod 644 {} \;

# Make PHP files executable (if needed)
chmod 644 *.php
chmod 644 backend/*.php
chmod 644 api/*.php

# Set ownership (Nginx runs as www-data)
chown -R www-data:www-data /var/www/html/tftr/lgu-traffic-transport
```

### Step 3: Get Database Credentials from Hostinger

1. **Log in to Hostinger hPanel**
2. Go to **Databases** → **MySQL Databases**
3. Note down:
   - **Database name** (or create one: `lgu4_traffic_transport`)
   - **Database username**
   - **Database password**
   - **Database host** (usually `localhost`)

### Step 4: Create Database (if not exists)

**Option A: Via Hostinger hPanel (Easiest)**
1. Go to **Databases** → **MySQL Databases**
2. Click **Create Database**
3. Name it: `lgu4_traffic_transport`
4. Note the username and password created

**Option B: Via SSH**
```bash
mysql -u root -p
# Enter MySQL root password

CREATE DATABASE IF NOT EXISTS lgu4_traffic_transport CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
EXIT;
```

### Step 5: Import Database

⚠️ **SAFETY:** This will ONLY affect `lgu4_traffic_transport` database. Your `lgu4_admin_db_2026` is completely safe.

**Option A: Via phpMyAdmin (Easiest)**
1. Go to Hostinger hPanel → **Databases** → **phpMyAdmin**
2. Select database `lgu4_traffic_transport` from left sidebar
   - ⚠️ Make sure you're NOT in `lgu4_admin_db_2026`
3. Click **Import** tab
4. Choose file: `lgu4_traffic_transport.sql`
5. Click **Go**
6. ✅ Wait for success message

**Option B: Via SSH (Command Line)**
```bash
cd /var/www/html/tftr/lgu-traffic-transport

# Verify SQL file exists
ls -la lgu4_traffic_transport.sql

# Import database (replace with your actual database credentials)
mysql -u your_database_user -p lgu4_traffic_transport < lgu4_traffic_transport.sql
# Enter your database password when prompted

# Verify import was successful
mysql -u your_database_user -p -e "USE lgu4_traffic_transport; SHOW TABLES;"
# Should show all your tables
```

### Step 6: Configure Database Connection

Edit `backend/config.php` with your Hostinger database credentials:

```bash
cd /var/www/html/tftr/lgu-traffic-transport

# Edit config file
nano backend/config.php
# Or use vi: vi backend/config.php
```

**Update these values:**
```php
private $host = 'localhost';  // Usually localhost on Hostinger
private $user = 'your_hostinger_db_username';  // From Step 3
private $password = 'your_hostinger_db_password';  // From Step 3
private $dbname = 'lgu4_traffic_transport';  // Your database name
```

**Save and exit:**
- Nano: Press `Ctrl+X`, then `Y`, then `Enter`
- Vi: Press `Esc`, type `:wq`, then `Enter`

### Step 7: Test the Application

1. **Visit your subdomain:**
   - Go to: `https://tftr.alertaraqc.com`
   - You should see your login form

2. **Check for errors:**
   - If you see a blank page: Check PHP errors
   - If you see database connection error: Verify `backend/config.php` credentials
   - If you see 404: Check Nginx configuration

3. **Test database connection:**
   - Try accessing any page that uses the database
   - Check browser console for errors
   - Check server error logs if needed

### Step 8: Check Error Logs (if issues)

```bash
# Check Nginx error logs
tail -f /var/log/nginx/error.log

# Check PHP-FPM error logs
tail -f /var/log/php-fpm/error.log
# Or
tail -f /var/log/php8.2-fpm.log

# Check PHP errors
tail -f /var/log/php/error.log
```

---

## ✅ Deployment Checklist

- [ ] Files deployed from GitHub
- [ ] File permissions set (755 for dirs, 644 for files)
- [ ] Database credentials obtained from Hostinger
- [ ] Database `lgu4_traffic_transport` created
- [ ] Database imported from `lgu4_traffic_transport.sql`
- [ ] `backend/config.php` updated with database credentials
- [ ] Application tested at `https://tftr.alertaraqc.com`
- [ ] Login form loads correctly
- [ ] No errors in browser console
- [ ] Database connection working

---

## 🔧 Troubleshooting

### Page Not Loading?

```bash
# Check file permissions
ls -la /var/www/html/tftr

# Check Nginx is running
systemctl status nginx

# Check PHP-FPM is running
systemctl status php-fpm

# Test Nginx config
nginx -t
```

### Database Connection Error?

```bash
# Verify database exists
mysql -u your_db_user -p -e "SHOW DATABASES;"

# Test connection manually
mysql -u your_db_user -p lgu4_traffic_transport -e "SHOW TABLES;"

# Verify config.php has correct credentials
cat backend/config.php
```

### 404 Errors?

```bash
# Check Nginx config for tftr.alertaraqc.com
grep -r "tftr.alertaraqc.com" /etc/nginx/

# Verify root directive points to correct directory
cat /etc/nginx/sites-enabled/tftr.alertaraqc.com | grep root
```

---

## 🎯 Quick Command Summary

```bash
# 1. Navigate to project
cd /var/www/html/tftr

# 2. Set permissions
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
chown -R www-data:www-data .

# 3. Import database (get credentials from Hostinger first)
mysql -u your_db_user -p lgu4_traffic_transport < lgu4_traffic_transport.sql

# 4. Edit config
nano backend/config.php
# Update database credentials

# 5. Test
curl https://tftr.alertaraqc.com
# Or visit in browser
```

---

## 📚 Additional Resources

- **Detailed Deployment:** See `DEPLOYMENT.md`
- **Database Safety:** See `DATABASE_SAFETY.md`
- **Nginx Notes:** See `NGINX_NOTES.md`
- **Quick Reference:** See `QUICK_DEPLOY.md`

---

**You're almost done! Just need to import the database and configure the connection.** 🚀
