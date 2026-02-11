@echo off
REM Windows Batch Script to Prepare Files for Deployment
REM This helps prepare files before uploading to server

echo ========================================
echo Deployment Preparation Script
echo ========================================
echo.

REM Check if SQL file exists
if not exist "lgu4_traffic_transport.sql" (
    echo [ERROR] lgu4_traffic_transport.sql not found!
    echo Please make sure the SQL file is in the current directory.
    pause
    exit /b 1
)

echo [OK] SQL file found: lgu4_traffic_transport.sql
echo.

REM Check if index.php exists
if not exist "index.php" (
    echo [WARNING] index.php not found in current directory
) else (
    echo [OK] index.php found
)
echo.

echo ========================================
echo Files Ready for Deployment
echo ========================================
echo.
echo Next Steps:
echo 1. Connect to server: ssh root@72.60.209.226
echo 2. Navigate: cd /var/www/html/disaster_training_alertaraqc
echo 3. Run: git stash ^&^& git pull ^&^& git stash pop
echo 4. Upload SQL file and import database
echo 5. Update backend/config.php with database credentials
echo.
echo See DEPLOYMENT.md for detailed instructions.
echo.
pause
