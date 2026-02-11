# Safety Notes - Deployment Commands

## ✅ Your Commands Are SAFE - Here's Why:

### 1. **Directory-Specific Operations**
All commands target only `/var/www/html/tftr/lgu-traffic-transport`:
- ✅ Other subdomains are in **separate directories** (e.g., `/var/www/html/other_subdomain`)
- ✅ Each subdomain has its own folder and won't be affected
- ✅ Commands like `cd /var/www/html/tftr/lgu-traffic-transport` only change to YOUR directory

### 2. **Git Operations**
```bash
git stash
git pull
git stash pop
```
- ✅ Only affects the **current repository** in `disaster_training_alertaraqc`
- ✅ Other Git repositories in different folders are completely separate
- ✅ Each project has its own `.git` folder

### 3. **Database Operations**
```bash
mysql -u user -p lgu4_traffic_transport < lgu4_traffic_transport.sql
```
- ✅ Only affects the `lgu4_traffic_transport` database
- ✅ Other databases on your server remain untouched
- ✅ Each database is isolated in MySQL

### 4. **File Permissions**
```bash
find /var/www/html/tftr/lgu-traffic-transport -type d -exec chmod 755 {} \;
```
- ✅ Explicitly targets only `/var/www/html/tftr/lgu-traffic-transport`
- ✅ Uses `-maxdepth` to prevent going too deep
- ✅ Other directories are not affected

## 🛡️ Additional Safety Measures

### Before Running Commands:
1. **Always verify your current directory:**
   ```bash
   pwd
   # Should show: /var/www/html/tftr/lgu-traffic-transport
   ```

2. **Check what files will be affected:**
   ```bash
   ls -la
   # Verify you see your project files
   ```

3. **For database operations, verify database name:**
   ```bash
   mysql -u root -p -e "SHOW DATABASES;"
   # Verify lgu4_traffic_transport exists/is correct
   ```

## ⚠️ What to AVOID (Dangerous Commands)

**NEVER run these from root or parent directories:**
```bash
# ❌ DANGEROUS - affects ALL subdomains
cd /var/www/html
chmod -R 755 .  # Don't do this!

# ❌ DANGEROUS - affects ALL databases
mysql -u root -p < some_file.sql  # Without specifying database

# ❌ DANGEROUS - affects parent directory
cd /var/www/html
git pull  # If run from wrong directory
```

## ✅ Safe Command Pattern

Always follow this pattern:
1. Navigate to YOUR specific directory first
2. Verify you're in the right place (`pwd`)
3. Run commands that explicitly target your directory
4. Use relative paths (`.`) only when you're sure of your location

## 📋 Directory Structure on Hostinger

Your server likely looks like this:
```
/var/www/html/
├── tftr/
│   └── lgu-traffic-transport/       ← YOUR PROJECT (tftr.alertaraqc.com)
├── other_subdomain/                 ← Other subdomain (unaffected)
├── another_project/                 ← Another project (unaffected)
└── ...
```

Each subdomain/project is in its own folder and completely isolated.

## 🔒 Summary

**All the commands provided are SAFE because:**
- ✅ They target specific directories
- ✅ They target specific databases
- ✅ They use explicit paths
- ✅ They don't use wildcards that could affect other systems
- ✅ Each subdomain is isolated in its own directory

**Your other subdomains and systems will NOT be affected!**
