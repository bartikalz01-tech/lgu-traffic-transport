# Fix Missing Backend Files and API Errors

## 🔍 Problems Found

1. **Backend files missing:**
   - `backend/TrafficFlow.php` - NOT FOUND
   - `backend/BarangayTrafficStatus.php` - NOT FOUND

2. **Wrong MySQL user:**
   - You're using `root` but password is wrong
   - Use the database user from `backend/config.php` instead

## ✅ Solution

### Step 1: Check What Backend Files Exist

```bash
cd /var/www/html/tftr/lgu-traffic-transport
ls -la backend/
```

### Step 2: Get Database User from Config

```bash
# Check what database user is in config.php
cat backend/config.php | grep -E "user|password"
# Or
grep "private \$user" backend/config.php
```

### Step 3: Create Missing traffic_flow Table

Use the database user from `config.php` (NOT root):

```bash
# First, get your database user from config.php
# Then use it here (replace YOUR_DB_USER with actual user from config.php)

mysql -u YOUR_DB_USER -p lgu4_traffic_transport << 'EOF'
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

### Step 4: Check if Backend Files Need to Be Deployed

The backend files might not have been deployed. Check:

```bash
# Check if files exist
ls -la backend/TrafficFlow.php
ls -la backend/BarangayTrafficStatus.php

# If they don't exist, you need to deploy them from your repository
```

### Step 5: If Backend Files Are Missing - Deploy Them

If the files are missing, they need to be in your repository. Check:

```bash
# Check git status
git status

# Check if files exist in repository
git ls-files | grep -E "TrafficFlow|BarangayTrafficStatus"

# If they exist in repo but not on server, pull them
git pull
```

## 🚀 Quick Fix Commands

```bash
cd /var/www/html/tftr/lgu-traffic-transport

# 1. Check backend files
ls -la backend/

# 2. Get database user from config
grep "private \$user" backend/config.php

# 3. Create table using correct database user
# (Replace YOUR_DB_USER with the user from step 2)
mysql -u YOUR_DB_USER -p lgu4_traffic_transport < create_traffic_flow_table.sql

# 4. Test API
php api/get_traffic_flow.php
```

## 📋 Alternative: Use phpMyAdmin

If you can't get the MySQL command line working:

1. Go to Hostinger hPanel → Databases → phpMyAdmin
2. Select `lgu4_traffic_transport` database
3. Go to **SQL** tab
4. Paste the CREATE TABLE statement from `create_traffic_flow_table.sql`
5. Click **Go**

## ⚠️ Important Notes

- **Don't use MySQL root** - use the database user from `backend/config.php`
- **Backend files must exist** - if missing, deploy from repository
- **Check file paths** - make sure `backend/` directory has all required files
