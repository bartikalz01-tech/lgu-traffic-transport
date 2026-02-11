#!/bin/bash

# Complete fix for API errors - missing backend files and traffic_flow table

echo "=========================================="
echo "Complete API Error Fix"
echo "=========================================="
echo ""

cd /var/www/html/tftr/lgu-traffic-transport

echo "1. Checking backend files..."
echo ""

BACKEND_FILES=(
    "TrafficFlow.php"
    "BarangayTrafficStatus.php"
    "config.php"
    "Accidents.php"
    "AccidentPeoples.php"
    "AccidentVehicles.php"
)

MISSING_FILES=()

for file in "${BACKEND_FILES[@]}"; do
    if [ -f "backend/$file" ]; then
        echo "✅ backend/$file exists"
    else
        echo "❌ backend/$file MISSING"
        MISSING_FILES+=("$file")
    fi
done

echo ""

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo "⚠️  Missing files detected!"
    echo "Files missing: ${MISSING_FILES[*]}"
    echo ""
    echo "Solution: Pull from repository or deploy missing files"
    echo "  git pull"
    echo "  # Or manually copy files"
fi

echo ""
echo "2. Getting database credentials from config.php..."
if [ -f "backend/config.php" ]; then
    DB_USER=$(grep "private \$user" backend/config.php | sed "s/.*= '\(.*\)';/\1/" | head -1)
    DB_PASS=$(grep "private \$password" backend/config.php | sed "s/.*= '\(.*\)';/\1/" | head -1)
    
    if [ -z "$DB_USER" ] || [ "$DB_USER" = "your_database_user" ] || [ "$DB_USER" = "root" ]; then
        echo "⚠️  Database user in config.php needs to be updated with Hostinger credentials"
        echo "   Edit backend/config.php and update with your Hostinger database user"
        echo ""
        echo "   For now, you'll need to manually enter database credentials"
        DB_USER=""
    else
        echo "Database user from config: $DB_USER"
    fi
else
    echo "❌ backend/config.php not found!"
    DB_USER=""
fi

echo ""
echo "3. Creating traffic_flow table..."
echo ""

if [ -n "$DB_USER" ] && [ -n "$DB_PASS" ]; then
    echo "Creating table with credentials from config.php..."
    mysql -u "$DB_USER" -p"$DB_PASS" lgu4_traffic_transport << 'EOF'
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

    if [ $? -eq 0 ]; then
        echo "✅ traffic_flow table created"
    else
        echo "❌ Failed to create table"
        echo "You may need to use phpMyAdmin or enter credentials manually"
    fi
else
    echo "⚠️  Cannot create table automatically"
    echo "Please create it manually using phpMyAdmin or:"
    echo ""
    echo "mysql -u YOUR_DB_USER -p lgu4_traffic_transport"
    echo "# Then paste the CREATE TABLE statement"
fi

echo ""
echo "4. Testing API endpoints..."
echo ""

if [ -f "backend/TrafficFlow.php" ] && [ -f "backend/BarangayTrafficStatus.php" ]; then
    echo "Testing get_traffic_flow.php:"
    php api/get_traffic_flow.php 2>&1 | head -10
    echo ""
    
    echo "Testing get_brgy_traffic_status.php:"
    php api/get_brgy_traffic_status.php 2>&1 | head -10
else
    echo "⚠️  Cannot test - backend files missing"
fi

echo ""
echo "=========================================="
echo "Summary"
echo "=========================================="
echo ""
echo "Issues found:"
[ ${#MISSING_FILES[@]} -gt 0 ] && echo "  ❌ Missing backend files" || echo "  ✅ All backend files exist"
[ -f "backend/config.php" ] && echo "  ✅ config.php exists" || echo "  ❌ config.php missing"
echo ""
echo "Next steps:"
echo "  1. If files missing: git pull (or deploy from repository)"
echo "  2. Update backend/config.php with Hostinger database credentials"
echo "  3. Create traffic_flow table (use phpMyAdmin if command line fails)"
echo "  4. Test API endpoints again"
echo ""
