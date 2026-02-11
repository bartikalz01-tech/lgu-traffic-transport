# Migrating from Wrong Directory

## 🔍 Situation
You've done some work in `/var/www/html/tftr` but the actual directory is `/var/www/html/tftr/lgu-traffic-transport`.

## ✅ What You DON'T Need to Redo

### Database Import ✅
- **Database import is FINE!** 
- Databases are independent of file directories
- Your `lgu4_traffic_transport` database is already imported and safe
- No need to re-import

### Database Configuration ✅
- If you already created the database and have credentials, those are fine
- Database credentials don't change based on directory

## ⚠️ What You MIGHT Need to Check

### 1. Check What's in the Wrong Directory

```bash
# Check what's in /var/www/html/tftr
ls -la /var/www/html/tftr/

# Check if there are any files there
find /var/www/html/tftr -maxdepth 1 -type f
```

### 2. Check Current Directory Structure

```bash
# Check the correct directory
ls -la /var/www/html/tftr/lgu-traffic-transport/

# Verify backend/config.php exists and has correct credentials
cat /var/www/html/tftr/lgu-traffic-transport/backend/config.php
```

## 🔧 What to Do Next

### Step 1: Verify Current State

```bash
# Check if config.php has your database credentials
cd /var/www/html/tftr/lgu-traffic-transport
cat backend/config.php | grep -E "user|password|dbname"
```

If it shows your actual database credentials, you're good! ✅

### Step 2: Verify Database is Imported

```bash
# Test database connection (use single quotes to avoid bash history expansion)
cd /var/www/html/tftr/lgu-traffic-transport
php -r 'require "backend/config.php"; $c = new config(); $c->conn(); echo "Database connected!\n";'
```

**Or use the test script:**
```bash
chmod +x test_database_connection.sh
./test_database_connection.sh
```

If this works, everything is fine! ✅

### Step 3: Clean Up Wrong Directory (if needed)

If there are files in `/var/www/html/tftr` that shouldn't be there:

```bash
# Check what's there first
ls -la /var/www/html/tftr/

# If there are duplicate files, you can remove them (be careful!)
# Only if you're sure they're duplicates
# rm -rf /var/www/html/tftr/*.php  # Only if needed
```

## ✅ Quick Verification Checklist

Run these commands to verify everything is correct:

```bash
cd /var/www/html/tftr/lgu-traffic-transport

echo "=== 1. Check Directory ==="
pwd
echo ""

echo "=== 2. Check Files ==="
ls -la | head -10
echo ""

echo "=== 3. Check Config ==="
[ -f "backend/config.php" ] && echo "✅ backend/config.php exists" || echo "❌ Missing"
echo ""

echo "=== 4. Check Database Connection ==="
php -r 'require "backend/config.php"; $c = new config(); try { $c->conn(); echo "Database connected!\n"; } catch(Exception $e) { echo "Error: " . $e->getMessage() . "\n"; }'
echo ""

echo "=== 5. Check Database Tables ==="
mysql -u root -p YsqnXk6q#145 -e "USE lgu4_traffic_transport; SHOW TABLES;" 2>/dev/null | head -10
```

## 🎯 Most Likely Scenario

**You probably DON'T need to start over!**

Here's why:
1. ✅ Database import is done and working (database-level, not file-level)
2. ✅ You've already configured `backend/config.php` in the correct directory
3. ✅ Git is now working in the correct directory

**You just need to verify everything is working!**

## 🚀 Next Steps

1. **Verify database connection works:**
   ```bash
   cd /var/www/html/tftr/lgu-traffic-transport
   php -r 'require "backend/config.php"; $c = new config(); $c->conn(); echo "Connected!\n";'
   ```
   
   **Or use the test script:**
   ```bash
   chmod +x test_database_connection.sh
   ./test_database_connection.sh
   ```

2. **Test the application:**
   - Visit: `https://tftr.alertaraqc.com`
   - Check if login page loads

3. **If everything works, you're done!** ✅

## ⚠️ If Something Doesn't Work

If the database connection fails or page doesn't load:

1. **Check config.php has correct credentials:**
   ```bash
   nano backend/config.php
   ```

2. **Re-import database (only if needed):**
   ```bash
   mysql -u your_db_user -p lgu4_traffic_transport < lgu4_traffic_transport.sql
   ```

3. **Check Nginx points to correct directory:**
   ```bash
   grep -r "tftr.alertaraqc.com" /etc/nginx/ | grep root
   # Should show: root /var/www/html/tftr/lgu-traffic-transport;
   ```

## 📋 Summary

**You probably DON'T need to start over!**

- ✅ Database: Already imported (doesn't depend on directory)
- ✅ Config: Already set up in correct directory
- ✅ Git: Now working

**Just verify everything works and you're good to go!** 🎉
