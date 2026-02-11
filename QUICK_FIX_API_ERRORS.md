# Quick Fix for API 500 Errors

## 🔍 Issues Found

1. **Backend files missing on server** - `TrafficFlow.php` and `BarangayTrafficStatus.php` not found
2. **Wrong MySQL user** - Using root with wrong password
3. **Missing traffic_flow table** - Table doesn't exist in database

## ✅ Quick Fix Steps

### Step 1: Deploy Missing Backend Files

The backend files exist in your repository but might not be on the server:

```bash
cd /var/www/html/tftr/lgu-traffic-transport

# Pull latest from repository
git pull

# Or check if files exist
ls -la backend/TrafficFlow.php
ls -la backend/BarangayTrafficStatus.php
```

### Step 2: Get Database User from Config

```bash
# Check what database user is configured
cat backend/config.php | grep "private \$user"
```

**Important:** Use the database user from `backend/config.php`, NOT MySQL root.

### Step 3: Create traffic_flow Table via phpMyAdmin (Easiest)

Since MySQL command line is having password issues:

1. **Go to Hostinger hPanel** → **Databases** → **phpMyAdmin**
2. **Select database:** `lgu4_traffic_transport`
3. **Click SQL tab**
4. **Paste this SQL:**

```sql
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
```

5. **Click Go**

### Step 4: Verify Backend Files Exist

```bash
cd /var/www/html/tftr/lgu-traffic-transport
ls -la backend/TrafficFlow.php
ls -la backend/BarangayTrafficStatus.php

# If missing, they need to be deployed
git status
git pull
```

### Step 5: Test API Endpoints

```bash
# Test after fixing
php api/get_traffic_flow.php
php api/get_brgy_traffic_status.php

# Should return JSON (empty array if no data, but no errors)
```

## 🎯 Most Likely Solution

**The backend files are probably missing on the server.** 

1. **Deploy them:**
   ```bash
   cd /var/www/html/tftr/lgu-traffic-transport
   git pull
   # This should pull all backend files
   ```

2. **Create the table via phpMyAdmin** (easiest, no password issues)

3. **Test again**

## 📋 Checklist

- [ ] Backend files deployed (`git pull`)
- [ ] `backend/TrafficFlow.php` exists
- [ ] `backend/BarangayTrafficStatus.php` exists
- [ ] `traffic_flow` table created (via phpMyAdmin)
- [ ] API endpoints tested

After these steps, the 500 errors should be resolved!
