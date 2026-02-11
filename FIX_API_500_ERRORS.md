# Fix API 500 Internal Server Errors

## 🔍 Problem
Getting 500 errors from:
- `/api/get_traffic_flow.php`
- `/api/get_brgy_traffic_status.php`

## 🎯 Root Cause
The `traffic_flow` table doesn't exist in the database. The SQL file shows:
```
Error reading structure for table traffic_flow: Table doesn't exist in engine
```

## ✅ Solution

### Step 1: Check PHP Error Logs

```bash
cd /var/www/html/tftr/lgu-traffic-transport

# Check PHP-FPM error logs
tail -50 /var/log/php-fpm/error.log
# Or
tail -50 /var/log/php8.3-fpm.log

# Check Nginx error logs
tail -50 /var/log/nginx/error.log
```

### Step 2: Create Missing traffic_flow Table

The `traffic_flow` table is missing. The API code expects these columns:
- `traffic_flow_id`
- `road_id`
- `traffic_condition`
- `start_traffic_time`
- `traffic_date`

Create it:

```bash
cd /var/www/html/tftr/lgu-traffic-transport

mysql -u root -p lgu4_traffic_transport << 'EOF'
CREATE TABLE IF NOT EXISTS `traffic_flow` (
  `traffic_flow_id` int(11) NOT NULL AUTO_INCREMENT,
  `road_id` int(11) DEFAULT NULL,
  `traffic_condition` varchar(50) DEFAULT NULL,
  `start_traffic_time` time DEFAULT NULL,
  `traffic_date` date DEFAULT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`traffic_flow_id`),
  KEY `road_id` (`road_id`),
  CONSTRAINT `traffic_flow_ibfk_1` FOREIGN KEY (`road_id`) REFERENCES `roads` (`road_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
EOF
```

**Or use the SQL file:**
```bash
mysql -u root -p lgu4_traffic_transport < create_traffic_flow_table.sql
```

### Step 3: Test API Endpoints Directly

```bash
cd /var/www/html/tftr/lgu-traffic-transport

# Test get_traffic_flow.php
php api/get_traffic_flow.php

# Test get_brgy_traffic_status.php
php api/get_brgy_traffic_status.php
```

This will show the actual PHP error.

### Step 4: Enable Error Display (Temporarily for Debugging)

To see what the actual error is, temporarily enable error display:

```bash
# Edit the API file to show errors
nano api/get_traffic_flow.php
```

Add at the top (after `<?php`):
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

Then test again and see the actual error.

### Step 5: Check Database Connection in API Files

The API files require backend classes. Make sure they can find the files:

```bash
# Test if files exist
ls -la backend/TrafficFlow.php
ls -la backend/BarangayTrafficStatus.php
ls -la backend/config.php

# Test database connection from API context
cd /var/www/html/tftr/lgu-traffic-transport
php -r "require 'backend/config.php'; \$c = new config(); \$c->conn(); echo 'OK\n';"
```

## 🔧 Quick Diagnostic Script

Run this to diagnose the issue:

```bash
cd /var/www/html/tftr/lgu-traffic-transport

echo "=== 1. Check if tables exist ==="
mysql -u your_db_user -p -e "USE lgu4_traffic_transport; SHOW TABLES;" | grep traffic

echo ""
echo "=== 2. Test API files directly ==="
php api/get_traffic_flow.php 2>&1
echo ""
php api/get_brgy_traffic_status.php 2>&1

echo ""
echo "=== 3. Check PHP error logs ==="
tail -20 /var/log/php-fpm/error.log
```

## 📋 Common Issues and Fixes

### Issue 1: Missing traffic_flow Table
**Fix:** Create the table (see Step 2 above)

### Issue 2: Database Connection Error
**Fix:** Verify `backend/config.php` has correct credentials

### Issue 3: File Path Issues
**Fix:** Check if `require '../backend/...'` paths are correct from `/api/` directory

### Issue 4: PHP Errors Not Showing
**Fix:** Enable error display temporarily or check error logs

## 🚀 Complete Fix Script

I've created `fix_api_errors.sh` that will:
1. Check for missing tables
2. Create missing tables
3. Test API endpoints
4. Show actual errors

Run it to diagnose and fix the issues.
