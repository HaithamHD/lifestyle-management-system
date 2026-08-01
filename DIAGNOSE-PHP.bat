@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Lifestyle PHP Diagnosis

echo ==================================================
echo            Lifestyle PHP Diagnosis
echo ==================================================
echo Project folder: %CD%
echo.

set "PHP_EXE="
if exist "C:\xampp\php\php.exe" set "PHP_EXE=C:\xampp\php\php.exe"
if not defined PHP_EXE for /f "delims=" %%P in ('where php 2^>nul') do if not defined PHP_EXE set "PHP_EXE=%%P"
if not defined PHP_EXE if exist "C:\php\php.exe" set "PHP_EXE=C:\php\php.exe"

if not defined PHP_EXE (
    echo PHP was not found.
    pause
    exit /b 1
)

echo PHP executable:
echo %PHP_EXE%
echo.
"%PHP_EXE%" -v
echo.
echo Global PHP configuration:
"%PHP_EXE%" --ini
echo.
echo Global matching modules:
"%PHP_EXE%" -m | findstr /I "mbstring openssl PDO pdo_sqlite sqlite3 fileinfo"
echo.

if exist ".runtime-php\php.ini" (
    echo Project-local configuration exists:
    echo %CD%\.runtime-php\php.ini
    echo.
    set "PHPRC=%CD%\.runtime-php"
    set "PHP_INI_SCAN_DIR="
    "%PHP_EXE%" --ini
    echo.
    echo Project-local matching modules:
    "%PHP_EXE%" -m | findstr /I "mbstring openssl PDO pdo_sqlite sqlite3 fileinfo"
    echo.
    if exist "tools\check_php_extensions.php" (
        echo Project-local extension check:
        "%PHP_EXE%" "tools\check_php_extensions.php"
    )
) else (
    echo Project-local configuration has not been created yet.
    echo Run START-LIFESTYLE.bat once to create it automatically.
)

echo.
echo Copy this window output if support is needed.
pause
endlocal
