#!/bin/bash

# Script to verify everything is set up correctly

echo "=========================================="
echo "Verification Script"
echo "=========================================="
echo ""

# Navigate to correct directory
cd /var/www/html/tftr/lgu-traffic-transport

echo "1. Current Directory:"
pwd
echo ""

echo "2. Checking Project Files:"
[ -f "index.php" ] && echo "✅ index.php" || echo "❌ index.php missing"
[ -f "backend/config.php" ] && echo "✅ backend/config.php" || echo "❌ backend/config.php missing"
[ -f "lgu4_traffic_transport.sql" ] && echo "✅ lgu4_traffic_transport.sql" || echo "❌ SQL file missing"
[ -d "api" ] && echo "✅ api/ directory" || echo "❌ api/ directory missing"
echo ""

echo "3. Checking backend/config.php:"
if [ -f "backend/config.php" ]; then
    echo "Config file exists"
    echo "Checking for database credentials..."
    if grep -q "your_database_user\|your_hostinger_db" backend/config.php; then
        echo "⚠️  Config still has placeholder values - needs to be updated!"
    else
        echo "✅ Config appears to have real credentials"
    fi
else
    echo "❌ backend/config.php not found!"
fi
echo ""

echo "4. Testing Database Connection:"
if [ -f "backend/config.php" ]; then
    php -r "
    require 'backend/config.php';
    try {
        \$c = new config();
        \$conn = \$c->conn();
        if (\$conn) {
            echo '✅ Database connection successful!\n';
            \$stmt = \$conn->query('SHOW TABLES');
            \$tables = \$stmt->fetchAll(PDO::FETCH_COLUMN);
            echo 'Tables found: ' . count(\$tables) . '\n';
            if (count(\$tables) > 0) {
                echo 'Sample tables:\n';
                foreach (array_slice(\$tables, 0, 5) as \$table) {
                    echo '  - ' . \$table . '\n';
                }
            }
        }
    } catch(Exception \$e) {
        echo '❌ Database connection failed: ' . \$e->getMessage() . '\n';
    }
    " 2>/dev/null
else
    echo "⚠️  Cannot test - backend/config.php missing"
fi
echo ""

echo "5. Checking File Permissions:"
ls -ld . | awk '{print "Directory: " $1 " " $3 ":" $4}'
ls -l index.php 2>/dev/null | awk '{print "index.php: " $1 " " $3 ":" $4}'
ls -l backend/config.php 2>/dev/null | awk '{print "config.php: " $1 " " $3 ":" $4}'
echo ""

echo "6. Checking Git Status:"
git status --short 2>/dev/null | head -5
echo ""

echo "=========================================="
echo "Summary"
echo "=========================================="
echo ""
echo "If you see:"
echo "  ✅ All files exist"
echo "  ✅ Database connection successful"
echo "  ✅ Tables found"
echo ""
echo "Then you're ready to test at: https://tftr.alertaraqc.com"
echo ""
echo "If you see errors, check:"
echo "  1. backend/config.php has correct database credentials"
echo "  2. Database was imported successfully"
echo "  3. File permissions are correct"
echo ""
