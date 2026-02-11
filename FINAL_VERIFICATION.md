# Final Verification & Testing

## ✅ What You've Completed
- ✅ Code deployed to `/var/www/html/tftr/lgu-traffic-transport`
- ✅ Database credentials configured in `backend/config.php`
- ✅ Database connection verified and working

## 🚀 Final Steps

### Step 1: Verify Database Tables Are Imported

Check if all tables exist:

```bash
cd /var/www/html/tftr/lgu-traffic-transport

# Check tables (replace with your database credentials)
mysql -u your_db_user -p -e "USE lgu4_traffic_transport; SHOW TABLES;"
```

**Expected tables:**
- `accident_cases`
- `accident_peoples`
- `accident_vehicles`
- `officers`
- `people_involved`
- `roads`
- `status_of_reports`
- `vehicle_reported`

**If tables are missing, import the database:**
```bash
mysql -u your_db_user -p lgu4_traffic_transport < lgu4_traffic_transport.sql
```

### Step 2: Verify File Permissions

```bash
cd /var/www/html/tftr/lgu-traffic-transport

# Set proper permissions
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;

# Set ownership for Nginx
chown -R www-data:www-data .
```

### Step 3: Verify Nginx Configuration

Check that Nginx points to the correct directory:

```bash
# Check Nginx config for your subdomain
grep -r "tftr.alertaraqc.com" /etc/nginx/ | grep root

# Should show something like:
# root /var/www/html/tftr/lgu-traffic-transport;
```

**If it shows a different path, you may need to update it in Hostinger hPanel or Nginx config.**

### Step 4: Test the Application in Browser

1. **Visit your subdomain:**
   - Open browser: `https://tftr.alertaraqc.com`
   - You should see your login form

2. **Check for errors:**
   - Open browser Developer Tools (F12)
   - Check **Console** tab for JavaScript errors
   - Check **Network** tab for failed requests (should be 200 OK for main page)

3. **Verify login page displays:**
   - ✅ ALERTARA logo visible
   - ✅ Email input field
   - ✅ Password input field
   - ✅ "Sign up" link works
   - ✅ No PHP errors displayed

### Step 5: Test Database Functionality

If your application has pages that use the database, test them:

```bash
# Create a simple test to verify database queries work
cd /var/www/html/tftr/lgu-traffic-transport

cat > test_db_query.php << 'EOF'
<?php
require 'backend/config.php';
$c = new config();
$conn = $c->conn();

// Test query
$stmt = $conn->query("SELECT COUNT(*) as count FROM roads");
$result = $stmt->fetch(PDO::FETCH_ASSOC);
echo "Roads in database: " . $result['count'] . "\n";

// Test another table
$stmt = $conn->query("SELECT COUNT(*) as count FROM officers");
$result = $stmt->fetch(PDO::FETCH_ASSOC);
echo "Officers in database: " . $result['count'] . "\n";
?>
EOF

php test_db_query.php

# Clean up
rm test_db_query.php
```

### Step 6: Check Error Logs (if issues)

If the page doesn't load or shows errors:

```bash
# Check Nginx error logs
tail -20 /var/log/nginx/error.log

# Check PHP-FPM error logs
tail -20 /var/log/php-fpm/error.log
# Or
tail -20 /var/log/php8.2-fpm.log

# Check PHP errors
tail -20 /var/log/php/error.log
```

## ✅ Final Checklist

- [ ] Database connection working ✅ (You've done this!)
- [ ] All database tables imported
- [ ] File permissions set correctly
- [ ] Nginx configuration points to correct directory
- [ ] Application loads at `https://tftr.alertaraqc.com`
- [ ] Login page displays correctly
- [ ] No errors in browser console
- [ ] No errors in server logs
- [ ] Database queries work (if applicable)

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ `https://tftr.alertaraqc.com` loads your login page
2. ✅ No errors in browser console (F12)
3. ✅ Database connection test passes
4. ✅ All tables are imported
5. ✅ Login form displays correctly

## 🔧 Troubleshooting

### Page Shows 404?
- Check Nginx config: `grep -r "tftr.alertaraqc.com" /etc/nginx/ | grep root`
- Verify directory exists: `ls -la /var/www/html/tftr/lgu-traffic-transport`
- Reload Nginx: `systemctl reload nginx`

### Page Shows Blank/White Screen?
- Check PHP errors: `tail -20 /var/log/php-fpm/error.log`
- Check file permissions: `ls -la /var/www/html/tftr/lgu-traffic-transport/index.php`
- Verify PHP-FPM is running: `systemctl status php-fpm`

### Database Connection Error on Page?
- Verify `backend/config.php` has correct credentials
- Test connection: `php -r 'require "backend/config.php"; $c = new config(); $c->conn(); echo "OK\n";'`
- Check database exists: `mysql -u your_db_user -p -e "SHOW DATABASES;"`

## 📋 Quick Test Commands

```bash
cd /var/www/html/tftr/lgu-traffic-transport

# 1. Test database connection
php -r 'require "backend/config.php"; $c = new config(); $c->conn(); echo "DB OK\n";'

# 2. Check tables
mysql -u your_db_user -p -e "USE lgu4_traffic_transport; SHOW TABLES;"

# 3. Check file permissions
ls -la index.php backend/config.php

# 4. Test if page loads (from server)
curl -I https://tftr.alertaraqc.com

# 5. Check Nginx
systemctl status nginx
systemctl status php-fpm
```

---

**You're almost done! Just verify the application loads in your browser and you're all set!** 🚀
