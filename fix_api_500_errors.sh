#!/bin/bash

# Script to fix API 500 errors by creating missing traffic_flow table

echo "=========================================="
echo "Fixing API 500 Errors"
echo "=========================================="
echo ""

cd /var/www/html/tftr/lgu-traffic-transport

# Get database credentials from config (if possible) or use defaults
# For now, we'll prompt or use root
DB_USER="root"
DB_PASS="YsqnXk6q#145"
DB_NAME="lgu4_traffic_transport"

echo "1. Checking if traffic_flow table exists..."
TRAFFIC_FLOW_EXISTS=$(mysql -u "$DB_USER" -p"$DB_PASS" -e "USE $DB_NAME; SHOW TABLES LIKE 'traffic_flow';" 2>/dev/null | grep traffic_flow)

if [ -z "$TRAFFIC_FLOW_EXISTS" ]; then
    echo "❌ traffic_flow table does NOT exist"
    echo ""
    echo "Creating traffic_flow table..."
    
    mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" << 'EOF'
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
        echo "✅ traffic_flow table created successfully"
    else
        echo "❌ Failed to create table"
        echo "Please check database credentials"
        exit 1
    fi
else
    echo "✅ traffic_flow table already exists"
fi

echo ""
echo "2. Verifying table structure..."
mysql -u "$DB_USER" -p"$DB_PASS" -e "USE $DB_NAME; DESCRIBE traffic_flow;" 2>/dev/null

echo ""
echo "3. Testing API endpoints..."

echo ""
echo "Testing get_traffic_flow.php:"
php api/get_traffic_flow.php 2>&1
echo ""

echo "Testing get_brgy_traffic_status.php:"
php api/get_brgy_traffic_status.php 2>&1
echo ""

echo "4. Checking for other errors..."
echo "Recent PHP errors:"
tail -30 /var/log/php-fpm/error.log 2>/dev/null || tail -30 /var/log/php8.3-fpm.log 2>/dev/null || echo "No PHP error log found"

echo ""
echo "=========================================="
echo "Summary"
echo "=========================================="
echo ""
echo "If API endpoints still show errors:"
echo "  1. Check PHP error logs above"
echo "  2. Verify database connection in backend/config.php"
echo "  3. Check file permissions: chmod 644 api/*.php"
echo ""
echo "If tables are empty, you may need to add sample data."
echo ""
