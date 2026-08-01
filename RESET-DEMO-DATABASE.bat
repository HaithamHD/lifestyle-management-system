@echo off
setlocal
cd /d "%~dp0"

if not exist "database\database.demo.sqlite" (
    echo [ERROR] database\database.demo.sqlite is missing.
    pause
    exit /b 1
)

copy /Y "database\database.demo.sqlite" "database\database.sqlite" >nul
if errorlevel 1 (
    echo [ERROR] Could not reset the database. Stop php artisan serve and try again.
    pause
    exit /b 1
)

echo Demo database restored successfully.
echo User:  user@lifestyle.test / Password123!
echo Admin: admin@lifestyle.test / Admin123!
pause
endlocal
