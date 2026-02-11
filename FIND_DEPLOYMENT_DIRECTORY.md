# How to Find Your Deployment Directory

## 🎯 Your Setup
- **Subdomain:** `tftr.alertaraqc.com`
- **Main Domain:** `alertaraqc.com`
- **Project:** LGU Traffic Transport System

## 📍 Method 1: Check Hostinger hPanel (Easiest)

### Step-by-Step:

1. **Log in to Hostinger hPanel**
   - Go to: https://hpanel.hostinger.com
   - Enter your credentials

2. **Navigate to Domains**
   - Click on **"Domains"** in the left sidebar
   - Or go to **"Advanced"** → **"Subdomains"**

3. **Find Your Subdomain**
   - Look for `tftr.alertaraqc.com` in the subdomains list
   - Click on it or look for **"Document Root"** or **"Directory"** column

4. **Note the Directory Path**
   - It will show something like:
     - `/var/www/html/tftr` ✅ (Most likely)
     - `/var/www/html/tftr.alertaraqc.com`
     - `/public_html/tftr`
     - Or similar path

5. **This is your deployment directory!**

---

## 📍 Method 2: Check via SSH (Direct)

### Step 1: Connect to Server
```bash
ssh root@72.60.209.226
# Password: YsqnXk6q#145
```

### Step 2: Check Nginx Configuration
```bash
# Check Nginx configuration for your subdomain
grep -r "tftr.alertaraqc.com" /etc/nginx/
# This will show the Nginx server block configuration

# Or check sites-available/sites-enabled
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/
cat /etc/nginx/sites-enabled/tftr.alertaraqc.com
# Look for the "root" directive - that's your directory
```

### Step 3: Check Common Directories
```bash
# List all directories in /var/www/html
ls -la /var/www/html/

# Look for directories that might be your project:
# - tftr
# - tftr.alertaraqc.com
# - traffic_transport
# - lgu_traffic_transport

# Check if tftr directory exists
ls -la /var/www/html/tftr
# If it exists and has your files, that's it!
```

### Step 4: Search for Your Project Files
```bash
# Search for your SQL file (most reliable)
find /var/www/html -name "lgu4_traffic_transport.sql" -type f 2>/dev/null

# Search for your index.php
find /var/www/html -name "index.php" -type f -exec grep -l "ALERTARA" {} \; 2>/dev/null

# Search for backend/config.php
find /var/www/html -path "*/backend/config.php" -type f 2>/dev/null
```

---

## 📍 Method 3: Check Current Git Repository

If the directory already has a git repository:

```bash
ssh root@72.60.209.226
cd /var/www/html/tftr  # Try this first

# Check if it's a git repo
git remote -v
# Should show your LGU-TRAFFIC-TRANSPORT repository URL

# Check if it has your project files
ls -la
# Should see: index.php, backend/, api/, etc.
```

---

## 🎯 Most Likely Directory Structure

Based on your subdomain `tftr.alertaraqc.com`, the directory is most likely:

```
/var/www/html/
├── tftr/                    ← MOST LIKELY (matches subdomain)
│   └── (your project files)
│
├── alertaraqc.com/          ← Main domain directory
│   └── (main domain files)
│
└── other_subdomains/        ← Other subdomains
```

**The directory `/var/www/html/tftr` is the most likely location.**

---

## ✅ Verification Checklist

Once you find the directory, verify it's correct:

```bash
cd /var/www/html/tftr  # Or whatever directory you found

# Check 1: Is it a git repository?
git remote -v
# Should show your repository URL

# Check 2: Does it have your project files?
ls -la
# Should see:
# ✅ index.php (your login form)
# ✅ backend/ directory
# ✅ api/ directory
# ✅ lgu4_traffic_transport.sql
# ✅ accident_reports/ directory

# Check 3: Does index.php contain your traffic transport code?
head -20 index.php
# Should show "ALERTARA" and login form code

# Check 4: Does backend/config.php exist?
ls -la backend/config.php
# Should exist
```

---

## 🔧 Quick Verification Script

Run this to verify the directory:

```bash
cd /var/www/html/tftr

echo "=== Directory Verification ==="
echo "Directory: $(pwd)"
echo ""

# Check git
if [ -d ".git" ]; then
    echo "✅ Git repository found"
    git remote -v
else
    echo "⚠️  Not a git repository (might be new deployment)"
fi
echo ""

# Check files
echo "=== Project Files ==="
[ -f "index.php" ] && echo "✅ index.php" || echo "❌ index.php missing"
[ -f "backend/config.php" ] && echo "✅ backend/config.php" || echo "❌ backend/config.php missing"
[ -f "lgu4_traffic_transport.sql" ] && echo "✅ lgu4_traffic_transport.sql" || echo "❌ SQL file missing"
[ -d "api" ] && echo "✅ api/ directory" || echo "❌ api/ directory missing"
[ -d "accident_reports" ] && echo "✅ accident_reports/ directory" || echo "❌ accident_reports/ missing"
```

---

## 🚀 If Directory Doesn't Exist Yet

If `/var/www/html/tftr` doesn't exist (like in your case), you have two options:

### Option A: Find Where It Should Be (Check Hostinger First)

1. **Check Hostinger hPanel:**
   - Go to **Domains** → **Subdomains** → `tftr.alertaraqc.com`
   - See what directory is configured
   - If it shows a different path, use that path

2. **Or run the search script:**
   ```bash
   # Upload and run the find_directory_commands.sh script
   # Or run these commands manually:
   
   # Search for existing project files
   find /var/www -name "lgu4_traffic_transport.sql" -type f 2>/dev/null
   
   # Check Nginx config
   grep -r "tftr.alertaraqc.com" /etc/nginx/ 2>/dev/null
   
   # List all directories
   ls -la /var/www/html/
   ```

### Option B: Create New Directory (If Fresh Deployment)

1. **Create the directory:**
   ```bash
   mkdir -p /var/www/html/tftr
   cd /var/www/html/tftr
   ```

2. **Clone your repository:**
   ```bash
   git clone <your-repository-url> .
   # The dot (.) clones into current directory
   ```

3. **Or upload files manually:**
   - Use FTP/SFTP to upload files
   - Or use `scp` to copy files

4. **Configure in Hostinger hPanel:**
   - Go to **Domains** → **Subdomains** → `tftr.alertaraqc.com`
   - Update **Document Root** to `/var/www/html/tftr`
   - Or create the subdomain if it doesn't exist yet

---

## 📋 Summary

**Most Likely Directory:** `/var/www/html/tftr`

**To Verify:**
1. Check Hostinger hPanel → Domains → Subdomains → `tftr.alertaraqc.com`
2. Or SSH and check: `ls -la /var/www/html/tftr`
3. Or search: `find /var/www/html -name "lgu4_traffic_transport.sql"`

**Once confirmed, use this directory for all deployment commands!**
