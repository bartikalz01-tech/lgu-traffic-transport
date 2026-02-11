#!/bin/bash

# Script to fix API 500 errors

echo "=========================================="
echo "Fixing API 500 Errors"
echo "=========================================="
echo ""

cd /var/www/html/tftr/lgu-traffic-transport

echo "1. Checking if traffic_flow table exists..."
TRAFFIC_FLOW_EXISTS=$(mysql -u root -pYsqnXk6q#145 -e "USE lgu4_traffic_transport; SHOW TABLES LIKE 'traffic_flow';" 2>/dev/null | grep traffic_flow)

if [ -z "$TRAFFIC_FLOW_EXISTS" ]; then
    echo "❌ traffic_flow table does NOT exist"
    echo "Creating traffic_flow table..."
    
    mysql -u root -pYsqnXk6q#145 lgu4_traffic_transport << 'EOF'
CREATE TABLE IF NOT EXISTS `traffic_flow` (
  `traffic_flow_id` int(11) NOT NULL AUTO_INCREMENT,
  `road_id` int(11) DEFAULT NULL,
  `traffic_level` varchar(50) DEFAULT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`traffic_flow_id`),
  KEY `road_id` (`road_id`),
  CONSTRAINT `traffic_flow_ibfk_1` FOREIGN KEY (`road_id`) REFERENCES `roads` (`road_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
EOF

    if [ $? -eq 0 ]; then
        echo "✅ traffic_flow table created"
    else
        echo "❌ Failed to create table. Check database credentials."
        exit 1
    fi
else
    echo "✅ traffic_flow table exists"
fi

echo ""
echo "2. Testing API endpoints directly..."

echo ""
echo "Testing get_traffic_flow.php:"
php api/get_traffic_flow.php 2>&1 | head -20

echo ""
echo "Testing get_brgy_traffic_status.php:"
php api/get_brgy_traffic_status.php 2>&1 | head -20

echo ""
echo "3. Checking PHP error logs..."
echo "Recent PHP errors:"
tail -20 /var/log/php-fpm/error.log 2>/dev/null || tail -20 /var/log/php8.3-fpm.log 2>/dev/null || echo "No PHP error log found"

echo ""
echo "4. Checking file permissions..."
ls -la api/get_traffic_flow.php
ls -la api/get_brgy_traffic_status.php
ls -la backend/TrafficFlow.php
ls -la backend/BarangayTrafficStatus.php

echo ""
echo "=========================================="
echo "Summary"
echo "=========================================="
echo ""
echo "If you see PHP errors above, those are the actual issues."
echo "Common fixes:"
echo "  1. Missing database tables - create them"
echo "  2. Database connection errors - check backend/config.php"
echo "  3. File path issues - check require paths"
echo "  4. PHP syntax errors - check the error messages"
echo ""
