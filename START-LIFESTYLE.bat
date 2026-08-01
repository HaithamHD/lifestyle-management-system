@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

title Lifestyle Management System - Original UI

echo ==================================================
echo    Lifestyle Management System - Original UI Final
echo ==================================================
echo Project folder: %CD%
echo.

if not exist "artisan" (
    echo [ERROR] artisan was not found in this folder.
    echo Extract the ZIP completely, then run this file beside artisan.
    pause
    exit /b 1
)

set "PHP_EXE="
if exist "C:\xampp\php\php.exe" set "PHP_EXE=C:\xampp\php\php.exe"
if not defined PHP_EXE for /f "delims=" %%P in ('where php 2^>nul') do if not defined PHP_EXE set "PHP_EXE=%%P"
if not defined PHP_EXE if exist "C:\php\php.exe" set "PHP_EXE=C:\php\php.exe"

if not defined PHP_EXE (
    echo [ERROR] PHP was not found.
    echo Install/start XAMPP, or add C:\xampp\php to PATH.
    pause
    exit /b 1
)

echo PHP executable: %PHP_EXE%
echo PHP version:
"%PHP_EXE%" -v 2>nul | findstr /B /C:"PHP "
echo.

if not exist "tools\Prepare-ProjectPhpIni.ps1" (
    echo [ERROR] tools\Prepare-ProjectPhpIni.ps1 is missing.
    pause
    exit /b 1
)

set "RUNTIME_PHP_DIR=%CD%\.runtime-php"
echo Preparing project-local PHP extensions...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%CD%\tools\Prepare-ProjectPhpIni.ps1" -PhpExe "%PHP_EXE%" -RuntimeDir "%RUNTIME_PHP_DIR%"
if errorlevel 1 (
    echo.
    echo [ERROR] Could not prepare the project-local php.ini.
    echo Run DIAGNOSE-PHP.bat for details.
    pause
    exit /b 1
)

set "PHPRC=%RUNTIME_PHP_DIR%"
set "PHP_INI_SCAN_DIR="

echo.
echo PHP configuration used by this project:
"%PHP_EXE%" --ini

echo Checking required PHP extensions...
if not exist "tools\check_php_extensions.php" (
    echo [ERROR] tools\check_php_extensions.php is missing.
    pause
    exit /b 1
)
"%PHP_EXE%" "tools\check_php_extensions.php"
if errorlevel 1 (
    echo.
    echo [ERROR] One or more PHP extensions could not be loaded.
    echo The project created: %RUNTIME_PHP_DIR%\php.ini
    echo Verify that the matching DLL files exist in the PHP ext folder.
    echo Run DIAGNOSE-PHP.bat and send its output if the problem continues.
    pause
    exit /b 1
)

if not exist ".env" (
    copy ".env.example" ".env" >nul
)

if not exist "vendor\autoload.php" (
    where composer >nul 2>nul
    if errorlevel 1 (
        echo [ERROR] vendor is missing and Composer was not found.
        echo Install Composer, then run: composer install
        pause
        exit /b 1
    )
    echo Installing Composer packages...
    composer install --no-interaction
    if errorlevel 1 (
        echo [ERROR] composer install failed.
        pause
        exit /b 1
    )
)

findstr /B /C:"APP_KEY=base64:" ".env" >nul
if errorlevel 1 (
    echo Generating application key...
    "%PHP_EXE%" artisan key:generate --force
    if errorlevel 1 (
        echo [ERROR] Could not generate APP_KEY.
        pause
        exit /b 1
    )
)

if not exist "database\database.sqlite" (
    if exist "database\database.demo.sqlite" (
        copy /Y "database\database.demo.sqlite" "database\database.sqlite" >nul
    ) else (
        type nul > "database\database.sqlite"
    )
)

echo Preparing Laravel...
"%PHP_EXE%" artisan optimize:clear
if errorlevel 1 (
    echo [ERROR] Laravel cache preparation failed.
    pause
    exit /b 1
)

"%PHP_EXE%" artisan migrate --force
if errorlevel 1 (
    echo [ERROR] Database migration failed.
    echo Run DIAGNOSE-PHP.bat and check the SQLite extensions.
    pause
    exit /b 1
)

set "PORT=8001"
netstat -ano | findstr /R /C:":8001 .*LISTENING" >nul
if not errorlevel 1 set "PORT=8002"
netstat -ano | findstr /R /C:":8002 .*LISTENING" >nul
if not errorlevel 1 set "PORT=8003"

set "APP_URL=http://127.0.0.1:%PORT%"

echo.
echo Demo user : user@lifestyle.test  / Password123!
echo Admin     : admin@lifestyle.test / Admin123!
echo URL       : %APP_URL%
echo.
echo Keep this window open. Press Ctrl+C only when you want to stop the server.
echo.

start "" powershell.exe -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process '%APP_URL%'"
"%PHP_EXE%" artisan serve --host=127.0.0.1 --port=%PORT%

if errorlevel 1 (
    echo.
    echo [ERROR] The Laravel server stopped because of an error.
    pause
)

endlocal
