# Deployment Guide for Hostinger (Nginx)

This guide will help you deploy the Traffic & Transport system to your Hostinger server running **Nginx**.

## 🎯 Your Setup
- **Subdomain:** `tftr.alertaraqc.com`
- **Main Domain:** `alertaraqc.com`
- **Deployment Directory:** `/var/www/html/tftr/lgu-traffic-transport`

## 📍 Finding Your Deployment Directory

**Before deploying, verify your directory:**

1. **Check Hostinger hPanel** (Easiest):
   - Go to **Domains** → **Subdomains**
   - Find `tftr.alertaraqc.com`
   - Check the **Document Root** or **Directory** column
   - This shows your deployment directory

2. **Or check via SSH:**
   ```bash
   ssh root@72.60.209.226
   ls -la /var/www/html/tftr
   # If it exists and has your files, that's it!
   ```

3. **Or search for your files:**
   ```bash
   find /var/www/html -name "lgu4_traffic_transport.sql" -type f 2>/dev/null
   ```

See `FIND_DEPLOYMENT_DIRECTORY.md` for detailed instructions.

---

## Prerequisites

- SSH access to your Hostinger server
- Database credentials from Hostinger control panel
- Git repository access
- Nginx web server (already configured on Hostinger)
- **Verified deployment directory** (usually `/var/www/html/tftr`)

## Step 1: Connect to Your Server

Open your terminal/command prompt and connect via SSH:

```bash
ssh root@72.60.209.226
```

When prompted, enter the password: `YsqnXk6q#145`

## Step 2: Navigate to Project Directory

⚠️ **SAFETY:** This command only affects the `tftr` directory. Other subdomains are in separate directories and won't be affected.

```bash
# Navigate to YOUR project directory
cd /var/www/html/tftr

# Verify you're in the correct directory
pwd
# Should output: /var/www/html/tftr

# Verify it contains your project files
ls -la
# Should see: index.php, backend/, api/, lgu4_traffic_transport.sql, etc.

# Verify git repository
git remote -v
# Should show your LGU-TRAFFIC-TRANSPORT repository URL
```

## Step 3: Update Your Code

⚠️ **SAFETY:** These Git commands only affect the current repository in `disaster_training_alertaraqc`. Other projects/subdomains are unaffected.

```bash
# Make sure you're in the project directory first
cd /var/www/html/tftr/lgu-traffic-transport

# Fix Git ownership issue first (if you get "dubious ownership" error)
git config --global --add safe.directory /var/www/html/tftr/lgu-traffic-transport

# These commands only affect THIS repository
git stash
git pull
git stash pop

## Step 4: Database Setup

### 4.1 Get Database Credentials

1. Log in to your Hostinger control panel (hPanel)
2. Go to **Databases** → **MySQL Databases**
3. Note down:
   - Database name (or create one: `lgu4_traffic_transport`)
   - Database username
   - Database password
   - Database host (usually `localhost`)

### 4.2 Create Database (if not exists)

⚠️ **CRITICAL SAFETY:** Database operations **ONLY** affect the `lgu4_traffic_transport` database. 
- ✅ Your other database `lgu4_admin_db_2026` will **NOT** be affected
- ✅ All other databases on your server remain **completely untouched**
- ✅ Each database is isolated in MySQL - they cannot interfere with each other

**Verify existing databases first (optional but recommended):**
```bash
mysql -u root -p -e "SHOW DATABASES;"
# This will list all databases - verify lgu4_admin_db_2026 is there and safe
```

Option A: Via hPanel (Recommended - Safest)
- Go to **Databases** → **MySQL Databases**
- Click **Create Database**
- Name it: `lgu4_traffic_transport` (separate from `lgu4_admin_db_2026`)
- This creates an **isolated, separate database** that won't affect others

Option B: Via SSH/MySQL command line
```bash
mysql -u root -p
# Enter your MySQL root password when prompted

# List databases to verify (optional)
SHOW DATABASES;
# You should see lgu4_admin_db_2026 and other databases - they're safe

# Create ONLY the new database
CREATE DATABASE IF NOT EXISTS lgu4_traffic_transport CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

# Verify it was created
SHOW DATABASES;
# You should now see lgu4_traffic_transport in the list

EXIT;
# This only creates ONE new database - lgu4_admin_db_2026 and all others are safe
```

### 4.3 Import Database

⚠️ **CRITICAL SAFETY CHECK:** The import **ONLY** affects `lgu4_traffic_transport` database.
- ✅ `lgu4_admin_db_2026` will **NOT** be touched
- ✅ The SQL file does NOT contain `CREATE DATABASE` or `USE` statements
- ✅ We explicitly specify the database name in the import command
- ✅ All tables are created ONLY in the specified database

**Method 1: Using phpMyAdmin (Recommended - Safest)**
1. Log in to hPanel
2. Go to **Databases** → **phpMyAdmin**
3. **IMPORTANT:** Select **ONLY** the `lgu4_traffic_transport` database from the left sidebar
   - ⚠️ Make sure you're NOT in `lgu4_admin_db_2026` or any other database
   - ✅ Verify the database name at the top shows `lgu4_traffic_transport`
4. Click **Import** tab
5. Choose file: `lgu4_traffic_transport.sql`
6. Click **Go**
7. ✅ Verify success message - it should only mention `lgu4_traffic_transport`

**Method 2: Using SSH/Command Line (Safest - Explicit Database Name)**
```bash
# Navigate to your project directory
cd /var/www/html/tftr/lgu-traffic-transport

# VERIFY: List databases first to confirm lgu4_admin_db_2026 is safe
mysql -u your_database_user -p -e "SHOW DATABASES;"
# You should see both lgu4_admin_db_2026 and lgu4_traffic_transport

# IMPORT: Explicitly specify the database name (SAFE - only affects this database)
mysql -u your_database_user -p lgu4_traffic_transport < lgu4_traffic_transport.sql
# Enter your database password when prompted
# This command ONLY imports into lgu4_traffic_transport - lgu4_admin_db_2026 is safe

# VERIFY: Check that lgu4_admin_db_2026 still exists and is untouched
mysql -u your_database_user -p -e "SHOW DATABASES;"
mysql -u your_database_user -p -e "USE lgu4_admin_db_2026; SHOW TABLES;"
# Your admin database should still be there with all its tables intact
```

**Method 3: Using SCP to upload and import**
```bash
# From your local machine, upload the SQL file
scp lgu4_traffic_transport.sql root@72.60.209.226:/var/www/html/tftr/lgu-traffic-transport/

# Then SSH into server and import
ssh root@72.60.209.226
cd /var/www/html/tftr/lgu-traffic-transport

# Verify databases first
mysql -u your_database_user -p -e "SHOW DATABASES;"

# Import ONLY to lgu4_traffic_transport (explicit database name = safe)
mysql -u your_database_user -p lgu4_traffic_transport < lgu4_traffic_transport.sql

# Verify lgu4_admin_db_2026 is still safe
mysql -u your_database_user -p -e "USE lgu4_admin_db_2026; SHOW TABLES;"
```

## Step 5: Configure Database Connection

### Option A: Update config.php directly
Edit `backend/config.php` with your production database credentials:

```php
private $host = 'localhost';
private $user = 'your_hostinger_db_user';
private $password = 'your_hostinger_db_password';
private $dbname = 'lgu4_traffic_transport';
```

### Option B: Use production config (Recommended)
1. Copy the production config:
```bash
cp backend/config.production.php backend/config.php
```

2. Edit `backend/config.php` and update with your actual credentials:
```bash
nano backend/config.php
# Or use vi: vi backend/config.php
```

## Step 6: Set File Permissions (Nginx)

⚠️ **IMPORTANT:** Make sure you're in the correct directory before running these commands!

**For Nginx**, the web server typically runs as `www-data` or `nginx` user. Files need to be readable by this user.

```bash
# Verify you're in the correct directory first
pwd
# Should show: /var/www/html/tftr/lgu-traffic-transport

# Set appropriate permissions (SAFE - only affects current directory)
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;

# Alternative: More explicit path (recommended for safety)
find /var/www/html/tftr/lgu-traffic-transport -maxdepth 10 -type d -exec chmod 755 {} \;
find /var/www/html/tftr/lgu-traffic-transport -maxdepth 10 -type f -exec chmod 644 {} \;

# Set proper ownership for Nginx (if you have sudo access)
# Uncomment the line below if needed (usually Hostinger handles this automatically)
# chown -R www-data:www-data /var/www/html/disaster_training_alertaraqc
```

**Nginx-specific notes:**
- Nginx doesn't use `.htaccess` files (those are Apache-specific)
- Configuration is done in Nginx server blocks (usually managed by Hostinger)
- PHP is handled via PHP-FPM (FastCGI Process Manager)

**Why this is safe:**
- All commands target only `/var/www/html/tftr/lgu-traffic-transport`
- Other subdomains are in different directories (e.g., `/var/www/html/other_subdomain`)
- Database operations only affect `lgu4_traffic_transport` database
- Git operations only affect the current repository

## Step 7: Verify Deployment

1. Visit your subdomain: `https://tftr.alertaraqc.com`
2. Check if the login page loads correctly
3. Test database connection by accessing any page that uses the database

## Step 8: Troubleshooting

### Database Connection Issues
- Verify database credentials in `backend/config.php`
- Check if database exists: `mysql -u root -p -e "SHOW DATABASES;"`
- Verify database user has proper permissions

### File Permission Issues (Nginx)
- Ensure Nginx can read files (usually runs as `www-data` or `nginx` user)
- Check file ownership: `ls -la /var/www/html/tftr/lgu-traffic-transport`
- Verify Nginx user has read access: `sudo -u www-data test -r /var/www/html/tftr/lgu-traffic-transport/index.php`
- Set proper ownership if needed: `chown -R www-data:www-data /var/www/html/tftr/lgu-traffic-transport`

### PHP Errors (Nginx)
- Check PHP-FPM error logs: `/var/log/php-fpm/error.log` or `/var/log/php8.x-fpm.log`
- Check Nginx error logs: `/var/log/nginx/error.log`
- Check Hostinger error logs in hPanel → **Logs** section
- Enable error reporting temporarily for debugging (disable in production)

### Nginx Configuration Issues
- Verify Nginx server block is configured for `tftr.alertaraqc.com`
- Check Nginx configuration: `nginx -t` (tests configuration)
- Reload Nginx after changes: `systemctl reload nginx` or `service nginx reload`
- Check if PHP-FPM is running: `systemctl status php-fpm` or `service php-fpm status`

## Security Notes

⚠️ **Important Security Reminders:**
1. Never commit database credentials to Git
2. Use strong database passwords
3. Keep `config.php` out of public access if possible
4. Regularly update your application and server
5. Use HTTPS (SSL certificate) for your subdomain

## Quick Deployment Script

You can create a deployment script for easier future deployments:

```bash
#!/bin/bash
# deploy.sh
cd /var/www/html/disaster_training_alertaraqc
git stash
git pull
git stash pop
# Add any other deployment steps here
echo "Deployment complete!"
```

Make it executable:
```bash
chmod +x deploy.sh
```

Then run: `./deploy.sh`
