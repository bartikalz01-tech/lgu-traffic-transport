# Final Steps - Import Database & Test

## ✅ What You've Done
- ✅ Deployed GitHub repository
- ✅ Set file permissions
- ✅ Created/configured `backend/config.php` with database credentials

## 🚀 Next Steps

### Step 1: Import the Database

⚠️ **SAFETY:** This will ONLY affect `lgu4_traffic_transport` database. Your `lgu4_admin_db_2026` is completely safe.

**Option A: Using phpMyAdmin (Easiest & Recommended)**

1. **Log in to Hostinger hPanel**
   - Go to: https://hpanel.hostinger.com
   - Navigate to **Databases** → **phpMyAdmin**

2. **Select the Correct Database**
   - In the left sidebar, click on `lgu4_traffic_transport`
   - ⚠️ **IMPORTANT:** Make sure you're NOT in `lgu4_admin_db_2026`
   - ✅ Verify the database name shows at the top: `lgu4_traffic_transport`

3. **Import the SQL File**
   - Click the **Import** tab at the top
   - Click **Choose File** button
   - Select `lgu4_traffic_transport.sql` from your local machine
   - Click **Go** button at the bottom
   - ✅ Wait for success message

4. **Verify Import**
   - You should see all tables created:
     - `accident_cases`
     - `accident_peoples`
     - `accident_vehicles`
     - `officers`
     - `people_involved`
     - `roads`
     - `status_of_reports`
     - `vehicle_reported`

**Option B: Using SSH (Command Line)**

```bash
# Navigate to project directory
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

### Step 2: Verify Database Connection

Test if your application can connect to the database:

```bash
cd /var/www/html/tftr/lgu-traffic-transport

# Create a simple test file
cat > test_db.php << 'EOF'
<?php
require 'backend/config.php';
$config = new config();
$conn = $config->conn();
if ($conn) {
    echo "✅ Database connection successful!\n";
    echo "Database: lgu4_traffic_transport\n";
    
    // Test query
    $stmt = $conn->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "Tables found: " . count($tables) . "\n";
    foreach ($tables as $table) {
        echo "  - $table\n";
    }
} else {
    echo "❌ Database connection failed!\n";
}
?>
EOF

# Run the test
php test_db.php

# If successful, remove test file
rm test_db.php
```

### Step 3: Test the Application

1. **Visit Your Subdomain**
   - Open browser: `https://tftr.alertaraqc.com`
   - You should see your login form

2. **Check for Errors**
   - Open browser Developer Tools (F12)
   - Check Console tab for JavaScript errors
   - Check Network tab for failed requests

3. **Verify Login Page Loads**
   - Should see "ALERTARA" logo
   - Should see login form with email and password fields
   - Should see "Sign up" option

### Step 4: Check Error Logs (if issues)

If the page doesn't load or shows errors:

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

### Step 5: Final Verification Checklist

- [ ] Database imported successfully
- [ ] Database connection test passed
- [ ] Login page loads at `https://tftr.alertaraqc.com`
- [ ] No errors in browser console
- [ ] No errors in server logs
- [ ] All files have correct permissions
- [ ] Nginx is running
- [ ] PHP-FPM is running

---

## 🎯 Quick Command Summary

```bash
# 1. Import database (choose one method above)

# 2. Test database connection
cd /var/www/html/tftr
php -r "require 'backend/config.php'; \$c = new config(); \$c->conn(); echo '✅ Connected\n';"

# 3. Check if page loads
curl -I https://tftr.alertaraqc.com

# 4. Check services
systemctl status nginx
systemctl status php-fpm
```

---

## 🔧 Troubleshooting

### Database Connection Error?

```bash
# Verify database exists
mysql -u your_db_user -p -e "SHOW DATABASES;"

# Verify tables exist
mysql -u your_db_user -p -e "USE lgu4_traffic_transport; SHOW TABLES;"

# Check config.php
cat backend/config.php | grep -E "user|password|dbname"
```

### Page Shows Blank/White Screen?

```bash
# Check PHP errors
tail -20 /var/log/php-fpm/error.log

# Enable error display temporarily (for debugging only)
# Edit index.php and add at the top:
# <?php error_reporting(E_ALL); ini_set('display_errors', 1); ?>
```

### 404 Not Found?

```bash
# Check Nginx config
grep -r "tftr.alertaraqc.com" /etc/nginx/

# Verify root directive
cat /etc/nginx/sites-enabled/tftr.alertaraqc.com | grep root

# Reload Nginx
systemctl reload nginx
```

### Permission Denied?

```bash
# Fix permissions
cd /var/www/html/tftr
chmod -R 755 .
chmod -R 644 *.php
chown -R www-data:www-data .
```

---

## ✅ Success Indicators

You'll know everything is working when:

1. ✅ `https://tftr.alertaraqc.com` loads your login page
2. ✅ No errors in browser console
3. ✅ Database connection test passes
4. ✅ All tables are imported
5. ✅ Login form displays correctly

---

## 🎉 You're Done!

Once the database is imported and the page loads, your deployment is complete!

**Next:** You can now test the login/signup functionality (if backend is implemented) or continue with any additional configuration needed.
