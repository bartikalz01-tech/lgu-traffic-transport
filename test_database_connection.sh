#!/bin/bash

# Test database connection script
# This avoids bash history expansion issues

cd /var/www/html/tftr/lgu-traffic-transport

echo "Testing database connection..."
echo ""

php -r '
require "backend/config.php";
try {
    $c = new config();
    $conn = $c->conn();
    if ($conn) {
        echo "✅ Database connection successful!\n";
        echo "Database: lgu4_traffic_transport\n";
        echo "\n";
        
        // Test query
        $stmt = $conn->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        echo "Tables found: " . count($tables) . "\n";
        if (count($tables) > 0) {
            echo "Sample tables:\n";
            foreach (array_slice($tables, 0, 10) as $table) {
                echo "  - $table\n";
            }
        }
    }
} catch(Exception $e) {
    echo "❌ Database connection failed!\n";
    echo "Error: " . $e->getMessage() . "\n";
}
'
