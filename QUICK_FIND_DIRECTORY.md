# Quick Commands to Find Your Directory

Since `/var/www/html/tftr` doesn't exist, run these commands on your server to find where to deploy:

## 🔍 Step 1: Check What Directories Exist

```bash
# List all directories in /var/www/html
ls -la /var/www/html/

# Check if there's a different structure
ls -la /var/www/
ls -la /home/
```

## 🔍 Step 2: Search for Your Project Files

```bash
# Search for your SQL file (most reliable)
find /var/www -name "lgu4_traffic_transport.sql" -type f 2>/dev/null
find /home -name "lgu4_traffic_transport.sql" -type f 2>/dev/null

# Search for your index.php
find /var/www -name "index.php" -type f -exec grep -l "ALERTARA" {} \; 2>/dev/null

# Search for backend/config.php
find /var/www -path "*/backend/config.php" -type f 2>/dev/null
```

## 🔍 Step 3: Check Nginx Configuration

```bash
# Find where tftr.alertaraqc.com is configured
grep -r "tftr.alertaraqc.com" /etc/nginx/ 2>/dev/null

# Check Nginx sites
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/

# If you find a config file, check the root directive
cat /etc/nginx/sites-enabled/tftr.alertaraqc.com 2>/dev/null
# Look for: root /path/to/directory;
```

## 🔍 Step 4: Check Hostinger Default Structure

Hostinger might use a different structure:

```bash
# Check user directories
ls -la /home/*/public_html/ 2>/dev/null
ls -la /home/*/domains/*/public_html/ 2>/dev/null

# Check if there's an alertaraqc.com directory
ls -la /var/www/html/alertaraqc.com/ 2>/dev/null
ls -la /home/*/domains/alertaraqc.com/ 2>/dev/null
```

## ✅ Step 5: If Nothing Found - Create Directory

If you can't find an existing directory, create it:

```bash
# Create the directory
mkdir -p /var/www/html/tftr

# Set permissions
chmod 755 /var/www/html/tftr

# Navigate to it
cd /var/www/html/tftr

# Clone your repository (replace with your actual repo URL)
git clone <your-git-repository-url> .

# Or if you need to upload files manually, prepare the directory
# Then upload files via FTP/SFTP or scp
```

## 📋 Next Steps After Finding/Creating Directory

1. **If you found an existing directory:**
   - Navigate to it: `cd /path/to/found/directory`
   - Verify it has your files: `ls -la`
   - Proceed with deployment

2. **If you created a new directory:**
   - Make sure Hostinger hPanel is configured to point `tftr.alertaraqc.com` to `/var/www/html/tftr`
   - Upload your files or clone your repository
   - Proceed with deployment

## 🎯 Most Likely Scenarios

1. **Directory doesn't exist yet** → Create `/var/www/html/tftr` and deploy there
2. **Directory exists with different name** → Use the found directory
3. **Directory is in /home/user/public_html/** → Use that path
4. **Subdomain not configured yet** → Create directory and configure in Hostinger hPanel
