# Verify Correct Deployment Directory

## ⚠️ Important: Verify Before Deploying

The directory `/var/www/html/disaster_training_alertaraqc` might be for a **different project** (disaster training). 

Since you're deploying the **LGU-TRAFFIC-TRANSPORT** system, you need to verify the correct directory first.

## 🔍 How to Verify the Correct Directory

### Step 1: SSH into Server and Check Available Directories

```bash
ssh root@72.60.209.226
# Password: YsqnXk6q#145

# List all directories in /var/www/html
ls -la /var/www/html/

# Look for directories that might be for traffic transport:
# - traffic_transport
# - lgu_traffic_transport  
# - tftr (since subdomain is tftr.alertaraqc.com)
# - traffic-transport
# - or similar names
```

### Step 2: Check if disaster_training_alertaraqc Contains Your Project

```bash
# Navigate to the directory
cd /var/www/html/disaster_training_alertaraqc

# Check if it's a git repository
git remote -v
# This will show the git repository URL - verify it matches your LGU-TRAFFIC-TRANSPORT repo

# Check if it contains your project files
ls -la
# You should see:
# - index.php (your login form)
# - backend/ directory
# - api/ directory
# - lgu4_traffic_transport.sql
# - accident_reports/ directory
# - etc.

# Check the current branch
git branch
# Verify you're on the correct branch
```

### Step 3: Verify Project Files Match

```bash
# Check if index.php exists and is your traffic transport login form
cat index.php | head -20
# Should show your login form code

# Check if backend/config.php exists
ls -la backend/config.php
# Should exist if this is your traffic transport project
```

## 🎯 Possible Directory Names

Based on your subdomain `tftr.alertaraqc.com`, the directory might be:

1. **`/var/www/html/disaster_training_alertaraqc`** (current - verify this is correct)
2. **`/var/www/html/tftr`** (matches subdomain)
3. **`/var/www/html/traffic_transport`**
4. **`/var/www/html/lgu_traffic_transport`**
5. **`/var/www/html/traffic-transport`**
6. Or another name configured in Hostinger

## ✅ Correct Directory Checklist

The correct directory should have:

- [ ] `.git` folder (it's a git repository)
- [ ] `index.php` (your login form)
- [ ] `backend/` directory with `config.php`
- [ ] `api/` directory
- [ ] `lgu4_traffic_transport.sql` file
- [ ] `accident_reports/` directory
- [ ] Git remote points to your LGU-TRAFFIC-TRANSPORT repository

## 🔧 If Wrong Directory - Find the Right One

```bash
# Search for your project files
find /var/www/html -name "index.php" -type f 2>/dev/null
# This will list all index.php files - check which one is yours

# Or search for your SQL file
find /var/www/html -name "lgu4_traffic_transport.sql" -type f 2>/dev/null

# Or search for backend/config.php
find /var/www/html -path "*/backend/config.php" -type f 2>/dev/null
```

## 📋 Quick Verification Script

Run this to verify you're in the right directory:

```bash
cd /var/www/html/disaster_training_alertaraqc

echo "=== Directory Verification ==="
echo "Current directory: $(pwd)"
echo ""
echo "=== Git Repository ==="
git remote -v
echo ""
echo "=== Project Files Check ==="
[ -f "index.php" ] && echo "✅ index.php exists" || echo "❌ index.php NOT found"
[ -f "backend/config.php" ] && echo "✅ backend/config.php exists" || echo "❌ backend/config.php NOT found"
[ -f "lgu4_traffic_transport.sql" ] && echo "✅ lgu4_traffic_transport.sql exists" || echo "❌ lgu4_traffic_transport.sql NOT found"
[ -d "api" ] && echo "✅ api/ directory exists" || echo "❌ api/ directory NOT found"
[ -d "accident_reports" ] && echo "✅ accident_reports/ directory exists" || echo "❌ accident_reports/ directory NOT found"
echo ""
echo "=== Verification Complete ==="
```

## 🚨 If Directory is Wrong

If `/var/www/html/disaster_training_alertaraqc` is NOT your traffic transport project:

1. **Find the correct directory** using the search commands above
2. **Update all deployment scripts** with the correct path
3. **Or create a new directory** if this is a fresh deployment:
   ```bash
   mkdir -p /var/www/html/traffic_transport
   cd /var/www/html/traffic_transport
   git clone <your-repository-url> .
   ```

## 💡 Recommendation

Since your subdomain is `tftr.alertaraqc.com`, the directory might be:
- `/var/www/html/tftr` (simplest, matches subdomain)
- Or whatever is configured in your Hostinger Nginx settings

**Check your Hostinger hPanel → Domains → Subdomains** to see what directory is configured for `tftr.alertaraqc.com`.
