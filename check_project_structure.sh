#!/bin/bash

# Script to check project structure and diagnose config.php issue

echo "=========================================="
echo "Project Structure Diagnostic"
echo "=========================================="
echo ""

# Check current directory
echo "1. Current Directory:"
pwd
echo ""

# Check if we're in the right place
if [ "$PWD" != "/var/www/html/tftr" ]; then
    echo "⚠️  WARNING: Not in /var/www/html/tftr"
    echo "Navigating to /var/www/html/tftr..."
    cd /var/www/html/tftr 2>/dev/null || {
        echo "❌ Cannot navigate to /var/www/html/tftr"
        echo "Please run: cd /var/www/html/tftr"
        exit 1
    }
    pwd
    echo ""
fi

# List directory contents
echo "2. Directory Contents:"
ls -la
echo ""

# Check for backend directory
echo "3. Checking for backend/ directory:"
if [ -d "backend" ]; then
    echo "✅ backend/ directory EXISTS"
    echo ""
    echo "Contents of backend/:"
    ls -la backend/
    echo ""
    
    # Check for config.php
    if [ -f "backend/config.php" ]; then
        echo "✅ backend/config.php EXISTS"
        echo ""
        echo "File info:"
        ls -la backend/config.php
        echo ""
        echo "First few lines:"
        head -5 backend/config.php
    else
        echo "❌ backend/config.php NOT FOUND"
        echo ""
        echo "Creating backend/config.php..."
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
        chmod 644 backend/config.php
        chown www-data:www-data backend/config.php
        echo "✅ Created backend/config.php"
        echo "⚠️  Remember to update it with your database credentials!"
    fi
else
    echo "❌ backend/ directory NOT FOUND"
    echo ""
    echo "Searching for backend directory..."
    find . -type d -name "backend" 2>/dev/null
    echo ""
    
    echo "Creating backend/ directory..."
    mkdir -p backend
    chmod 755 backend
    chown www-data:www-data backend
    echo "✅ Created backend/ directory"
    echo ""
    
    echo "Creating backend/config.php..."
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
    chmod 644 backend/config.php
    chown www-data:www-data backend/config.php
    echo "✅ Created backend/config.php"
    echo "⚠️  Remember to update it with your database credentials!"
fi

echo ""
echo "=========================================="
echo "4. Searching for other config files:"
echo "=========================================="
find . -name "config.php" -type f 2>/dev/null

echo ""
echo "=========================================="
echo "5. Project Structure:"
echo "=========================================="
echo "Required files/directories:"
[ -f "index.php" ] && echo "✅ index.php" || echo "❌ index.php"
[ -d "backend" ] && echo "✅ backend/" || echo "❌ backend/"
[ -f "backend/config.php" ] && echo "✅ backend/config.php" || echo "❌ backend/config.php"
[ -d "api" ] && echo "✅ api/" || echo "❌ api/"
[ -f "lgu4_traffic_transport.sql" ] && echo "✅ lgu4_traffic_transport.sql" || echo "❌ lgu4_traffic_transport.sql"

echo ""
echo "=========================================="
echo "6. Next Steps:"
echo "=========================================="
echo "1. If backend/config.php was created, edit it:"
echo "   nano backend/config.php"
echo ""
echo "2. Update database credentials:"
echo "   - host: localhost"
echo "   - user: your_hostinger_db_username"
echo "   - password: your_hostinger_db_password"
echo "   - dbname: lgu4_traffic_transport"
echo ""
echo "3. Save and test:"
echo "   php -l backend/config.php"
echo ""
