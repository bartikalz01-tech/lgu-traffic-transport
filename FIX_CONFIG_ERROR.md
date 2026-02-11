# Fix "No such file or directory" Error for backend/config.php

## 🔍 Problem
Error: `Error writing backend/config.php: No such file or directory`

This means either:
- The `backend/` directory doesn't exist
- You're not in the correct directory
- The file path is wrong

## ✅ Solution Steps

### Step 1: Verify You're in the Correct Directory

```bash
# Check current directory
pwd
# Should show: /var/www/html/tftr/lgu-traffic-transport

# If not, navigate to it
cd /var/www/html/tftr/lgu-traffic-transport

### Step 2: Check if backend/ Directory Exists

```bash
# List all files and directories
ls -la

# Check specifically for backend directory
ls -la backend/

# Or check if it exists
[ -d "backend" ] && echo "✅ backend/ exists" || echo "❌ backend/ NOT found"
```

### Step 3: If backend/ Doesn't Exist

**Option A: Check if files are in a different location**

```bash
# Search for config.php
find . -name "config.php" -type f

# Search for backend directory
find . -type d -name "backend"

# List all directories
ls -d */
```

**Option B: Create backend/ directory if missing**

```bash
# Create backend directory
mkdir -p backend

# Create config.php file
touch backend/config.php

# Set permissions
chmod 644 backend/config.php
chown www-data:www-data backend/config.php
```

**Option C: Check if files are in a subdirectory**

Sometimes files might be in a subdirectory. Check:

```bash
# Check all subdirectories
find . -type d -maxdepth 2

# Check if there's a src/ or app/ directory
ls -la src/ 2>/dev/null
ls -la app/ 2>/dev/null
```

### Step 4: Verify Project Structure

Your project should have this structure:

```
/var/www/html/tftr/
├── index.php
├── backend/
│   └── config.php
├── api/
├── accident_reports/
├── lgu4_traffic_transport.sql
└── ...
```

### Step 5: If Files Are Missing - Re-deploy

If the backend directory is missing, you may need to re-deploy:

```bash
cd /var/www/html/tftr

# Check git status
git status

# Pull latest from repository
git pull

# Or if you need to re-clone
cd ..
rm -rf tftr
git clone <your-repository-url> tftr
cd tftr
```

### Step 6: Create config.php Manually

If backend/ exists but config.php is missing:

```bash
cd /var/www/html/tftr

# Create config.php with basic structure
cat > backend/config.php << 'EOF'
<?php
  class config {
    private $host = 'localhost';
    private $user = 'your_database_user';
    private $password = 'your_database_password';
    private $dbname = 'lgu4_traffic_transport';
    public $pdo = null;

    public function conn() {
      try {
        $this->pdo = new PDO(
          "mysql:host={$this->host};dbname={$this->dbname};charset=utf8mb4", 
          $this->user, 
          $this->password,
          [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
          ]
        );
      }
      catch(PDOException $e) {
        error_log("Database connection error: " . $e->getMessage());
        die("Database connection failed. Please contact the administrator.");
      }

      return $this->pdo;
    }
  }
?>
EOF

# Set permissions
chmod 644 backend/config.php
chown www-data:www-data backend/config.php

# Edit it to add your credentials
nano backend/config.php
```

## 🔧 Quick Diagnostic Commands

Run these to diagnose the issue:

```bash
cd /var/www/html/tftr

echo "=== Current Directory ==="
pwd

echo ""
echo "=== Directory Contents ==="
ls -la

echo ""
echo "=== Checking for backend/ ==="
[ -d "backend" ] && echo "✅ backend/ exists" || echo "❌ backend/ NOT found"

echo ""
echo "=== Checking for backend/config.php ==="
[ -f "backend/config.php" ] && echo "✅ backend/config.php exists" || echo "❌ backend/config.php NOT found"

echo ""
echo "=== Searching for config.php ==="
find . -name "config.php" -type f

echo ""
echo "=== All directories ==="
find . -type d -maxdepth 2
```

## 📋 Common Issues and Solutions

### Issue 1: backend/ directory doesn't exist
**Solution:** Files might not have been deployed correctly. Re-deploy from GitHub.

### Issue 2: Wrong directory
**Solution:** Make sure you're in `/var/www/html/tftr`

### Issue 3: Files in subdirectory
**Solution:** Check if files are in a subdirectory like `src/backend/` or `app/backend/`

### Issue 4: Permissions issue
**Solution:** 
```bash
chmod 755 backend
chmod 644 backend/config.php
chown -R www-data:www-data backend/
```

## ✅ After Fixing

Once you've created/found the config.php file:

1. **Edit it with your database credentials:**
   ```bash
   nano backend/config.php
   ```

2. **Update these values:**
   ```php
   private $host = 'localhost';
   private $user = 'your_hostinger_db_username';
   private $password = 'your_hostinger_db_password';
   private $dbname = 'lgu4_traffic_transport';
   ```

3. **Save and test:**
   ```bash
   # Verify file exists and has correct permissions
   ls -la backend/config.php
   
   # Test PHP syntax
   php -l backend/config.php
   ```
