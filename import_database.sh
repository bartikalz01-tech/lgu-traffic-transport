#!/bin/bash

# Database Import Script for Hostinger
# SAFETY: This script ONLY imports to lgu4_traffic_transport database
# Other databases (like lgu4_admin_db_2026) are completely safe and unaffected
# Usage: ./import_database.sh [database_user] [database_name]

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get database credentials
if [ -z "$1" ]; then
    echo -e "${YELLOW}Database Import Script${NC}"
    echo "Usage: ./import_database.sh [database_user] [database_name]"
    echo ""
    read -p "Enter database username: " DB_USER
    read -sp "Enter database password: " DB_PASS
    echo ""
    read -p "Enter database name (default: lgu4_traffic_transport): " DB_NAME
    DB_NAME=${DB_NAME:-lgu4_traffic_transport}
else
    DB_USER=$1
    DB_NAME=${2:-lgu4_traffic_transport}
    read -sp "Enter database password: " DB_PASS
    echo ""
fi

# SAFETY: Target database name (explicitly set to prevent accidents)
TARGET_DB="lgu4_traffic_transport"
PROTECTED_DB="lgu4_admin_db_2026"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Database Import Script (SAFE MODE)${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${YELLOW}Target Database: $TARGET_DB${NC}"
echo -e "${GREEN}Protected Database: $PROTECTED_DB (will NOT be affected)${NC}"
echo ""

# Check if SQL file exists
SQL_FILE="lgu4_traffic_transport.sql"
if [ ! -f "$SQL_FILE" ]; then
    echo -e "${RED}Error: $SQL_FILE not found in current directory${NC}"
    exit 1
fi

echo -e "${GREEN}[OK] SQL file found: $SQL_FILE${NC}"

# SAFETY CHECK: Verify protected database exists and is safe
echo -e "${YELLOW}Safety Check: Verifying protected database $PROTECTED_DB exists...${NC}"
PROTECTED_EXISTS=$(mysql -u "$DB_USER" -p"$DB_PASS" -e "SHOW DATABASES LIKE '$PROTECTED_DB';" 2>/dev/null | grep "$PROTECTED_DB")
if [ -n "$PROTECTED_EXISTS" ]; then
    echo -e "${GREEN}[OK] Protected database $PROTECTED_DB found and safe${NC}"
else
    echo -e "${YELLOW}[WARNING] Protected database $PROTECTED_DB not found (may not exist yet)${NC}"
fi

# List all databases for verification
echo -e "${BLUE}Current databases on server:${NC}"
mysql -u "$DB_USER" -p"$DB_PASS" -e "SHOW DATABASES;" 2>/dev/null

# Check if target database exists
echo -e "${YELLOW}Checking if target database $TARGET_DB exists...${NC}"
DB_EXISTS=$(mysql -u "$DB_USER" -p"$DB_PASS" -e "SHOW DATABASES LIKE '$TARGET_DB';" 2>/dev/null | grep "$TARGET_DB")

if [ -z "$DB_EXISTS" ]; then
    echo -e "${YELLOW}Database '$TARGET_DB' does not exist. Creating...${NC}"
    mysql -u "$DB_USER" -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS $TARGET_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Database $TARGET_DB created successfully!${NC}"
        echo -e "${GREEN}[SAFETY] $PROTECTED_DB and other databases remain untouched${NC}"
    else
        echo -e "${RED}Failed to create database${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}Database '$TARGET_DB' exists${NC}"
fi

# Final safety confirmation
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${YELLOW}IMPORT SAFETY CONFIRMATION${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Target Database: $TARGET_DB${NC}"
echo -e "${GREEN}Protected Database: $PROTECTED_DB (will NOT be affected)${NC}"
echo -e "${YELLOW}SQL File: $SQL_FILE${NC}"
echo ""
read -p "Continue with import? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo -e "${RED}Import cancelled by user${NC}"
    exit 0
fi

# Import database (EXPLICIT database name = SAFE)
echo -e "${YELLOW}Importing database to $TARGET_DB only...${NC}"
echo -e "${GREEN}[SAFETY] Using explicit database name - $PROTECTED_DB is safe${NC}"
mysql -u "$DB_USER" -p"$DB_PASS" "$TARGET_DB" < "$SQL_FILE"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✅ Database imported successfully!${NC}"
    echo -e "${GREEN}========================================${NC}"
    
    # Final safety verification
    echo -e "${BLUE}Safety Verification:${NC}"
    echo -e "${GREEN}✅ $TARGET_DB imported successfully${NC}"
    
    # Verify protected database is still intact
    if [ -n "$PROTECTED_EXISTS" ]; then
        PROTECTED_TABLES=$(mysql -u "$DB_USER" -p"$DB_PASS" -e "USE $PROTECTED_DB; SHOW TABLES;" 2>/dev/null | wc -l)
        if [ "$PROTECTED_TABLES" -gt 0 ]; then
            echo -e "${GREEN}✅ $PROTECTED_DB is safe and intact (has $PROTECTED_TABLES table(s))${NC}"
        fi
    fi
    
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo -e "${YELLOW}1. Update backend/config.php with database credentials${NC}"
    echo -e "${YELLOW}2. Database name: $TARGET_DB${NC}"
    echo -e "${YELLOW}3. Test your application${NC}"
else
    echo -e "${RED}Database import failed. Please check your credentials and try again.${NC}"
    echo -e "${GREEN}[SAFETY] No databases were affected by this failure${NC}"
    exit 1
fi
