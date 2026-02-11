#!/bin/bash

# Directory Verification Script
# This script helps verify if you're in the correct deployment directory

echo "=========================================="
echo "Directory Verification Script"
echo "=========================================="
echo ""

# Check current directory
CURRENT_DIR=$(pwd)
echo "Current directory: $CURRENT_DIR"
echo ""

# Check if it's a git repository
if [ -d ".git" ]; then
    echo "✅ This is a Git repository"
    echo "Git remote:"
    git remote -v
    echo ""
else
    echo "❌ This is NOT a Git repository"
    echo ""
fi

# Check for project files
echo "=== Project Files Check ==="
[ -f "index.php" ] && echo "✅ index.php exists" || echo "❌ index.php NOT found"
[ -f "backend/config.php" ] && echo "✅ backend/config.php exists" || echo "❌ backend/config.php NOT found"
[ -f "lgu4_traffic_transport.sql" ] && echo "✅ lgu4_traffic_transport.sql exists" || echo "❌ lgu4_traffic_transport.sql NOT found"
[ -d "api" ] && echo "✅ api/ directory exists" || echo "❌ api/ directory NOT found"
[ -d "accident_reports" ] && echo "✅ accident_reports/ directory exists" || echo "❌ accident_reports/ directory NOT found"
[ -d "backend" ] && echo "✅ backend/ directory exists" || echo "❌ backend/ directory NOT found"
echo ""

# Check if index.php contains traffic transport content
if [ -f "index.php" ]; then
    echo "=== Checking index.php content ==="
    if grep -q "ALERTARA" index.php && grep -q "traffic\|transport" index.php -i; then
        echo "✅ index.php appears to be the traffic transport login form"
    else
        echo "⚠️  index.php might not be the traffic transport project"
    fi
    echo ""
fi

# Summary
echo "=========================================="
echo "Verification Summary"
echo "=========================================="

REQUIRED_FILES=0
FOUND_FILES=0

[ -f "index.php" ] && FOUND_FILES=$((FOUND_FILES + 1))
REQUIRED_FILES=$((REQUIRED_FILES + 1))

[ -f "backend/config.php" ] && FOUND_FILES=$((FOUND_FILES + 1))
REQUIRED_FILES=$((REQUIRED_FILES + 1))

[ -f "lgu4_traffic_transport.sql" ] && FOUND_FILES=$((FOUND_FILES + 1))
REQUIRED_FILES=$((REQUIRED_FILES + 1))

[ -d "api" ] && FOUND_FILES=$((FOUND_FILES + 1))
REQUIRED_FILES=$((REQUIRED_FILES + 1))

[ -d ".git" ] && FOUND_FILES=$((FOUND_FILES + 1))
REQUIRED_FILES=$((REQUIRED_FILES + 1))

echo "Found $FOUND_FILES out of $REQUIRED_FILES required items"
echo ""

if [ $FOUND_FILES -eq $REQUIRED_FILES ]; then
    echo "✅ This appears to be the CORRECT directory for LGU-TRAFFIC-TRANSPORT"
    echo "✅ Safe to proceed with deployment"
else
    echo "❌ WARNING: This might NOT be the correct directory"
    echo "❌ Some required files are missing"
    echo ""
    echo "Please verify:"
    echo "1. Check if this is the right project directory"
    echo "2. Or find the correct directory using: find /var/www/html -name 'index.php'"
    echo "3. Or check Hostinger hPanel for subdomain directory configuration"
fi

echo ""
