#!/bin/bash

# Complete fix for API 500 errors

echo "=========================================="
echo "Fixing API 500 Errors - Complete Fix"
echo "=========================================="
echo ""

cd /var/www/html/tftr/lgu-traffic_transport

echo "1. Checking backend directory..."
if [ ! -d "backend" ]; then
    echo "❌ backend/ directory not found!"
    echo "Creating backend directory..."
    mkdir -p backend
fi

ls -la backend/ | head -10
echo ""

echo "2. Checking if backend files exist..."
[ -f "backend/TrafficFlow.php" ] && echo "✅ TrafficFlow.php exists" || echo "❌ TrafficFlow.php MISSING"
[ -f "backend/BarangayTrafficStatus.php" ] && echo "✅ BarangayTrafficStatus.php exists" || echo "❌ BarangayTrafficStatus.php MISSING"
[ -f "backend/config.php" ] && echo "✅ config.php exists" || echo "❌ config.php MISSING"
echo ""

echo "3. Getting database credentials from config.php..."
if [ -f "backend/config.php" ]; then
    # Extract database user from config (basic extraction)
    echo "Config file found. You'll need to use the database user from config.php"
    echo "Check backend/config.php for the database username"
else
    echo "⚠️  config.php not found - cannot extract database credentials"
fi

echo ""
echo "4. Creating traffic_flow table..."
echo "You need to run this with your database user (not root):"
echo ""
echo "mysql -u YOUR_DB_USER -p lgu4_traffic_transport << 'EOF'"
echo "CREATE TABLE IF NOT EXISTS \`traffic_flow\` ("
echo "  \`traffic_flow_id\` int(11) NOT NULL AUTO_INCREMENT,"
echo "  \`road_id\` int(11) DEFAULT NULL,"
echo "  \`traffic_condition\` varchar(50) DEFAULT NULL,"
echo "  \`start_traffic_time\` time DEFAULT NULL,"
echo "  \`traffic_date\` date DEFAULT NULL,"
echo "  \`timestamp\` datetime DEFAULT CURRENT_TIMESTAMP,"
echo "  PRIMARY KEY (\`traffic_flow_id\`),"
echo "  KEY \`road_id\` (\`road_id\`),"
echo "  CONSTRAINT \`traffic_flow_ibfk_1\` FOREIGN KEY (\`road_id\`) REFERENCES \`roads\` (\`road_id\`) ON DELETE CASCADE ON UPDATE CASCADE"
echo ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;"
echo "EOF"
echo ""

echo "5. Testing API files..."
echo "Testing get_traffic_flow.php:"
php api/get_traffic_flow.php 2>&1 | head -5
echo ""

echo "Testing get_brgy_traffic_status.php:"
php api/get_brgy_traffic_status.php 2>&1 | head -5
echo ""

echo "=========================================="
echo "Next Steps"
echo "=========================================="
echo "1. Check if backend files exist: ls -la backend/"
echo "2. If missing, they need to be deployed from your repository"
echo "3. Use your database user (from config.php) to create the table"
echo "4. Not MySQL root user"
echo ""
