$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$php = $null
if (Test-Path 'C:\xampp\php\php.exe') {
    $php = 'C:\xampp\php\php.exe'
} elseif ($phpCommand = Get-Command php -ErrorAction SilentlyContinue) {
    $php = $phpCommand.Source
} elseif (Test-Path 'C:\php\php.exe') {
    $php = 'C:\php\php.exe'
} else {
    throw 'PHP was not found. Install/start XAMPP or add C:\xampp\php to PATH.'
}

$runtimeIniDir = Join-Path $PSScriptRoot '.runtime-php'
$prepareScript = Join-Path $PSScriptRoot 'tools\Prepare-ProjectPhpIni.ps1'

if (-not (Test-Path (Join-Path $runtimeIniDir 'php.ini'))) {
    & $prepareScript -PhpExe $php -RuntimeDir $runtimeIniDir
}

$env:PHPRC = $runtimeIniDir
$env:PHP_INI_SCAN_DIR = ''

Write-Host "Project folder: $PWD"
if (-not (Test-Path '.\artisan')) { throw 'artisan is missing from the current folder.' }

Write-Host 'Checking PHP...'
& $php -v
& $php --ini

$modules = & $php -m
$required = @('mbstring', 'openssl', 'PDO', 'pdo_sqlite', 'sqlite3', 'fileinfo')
foreach ($extension in $required) {
    if ($modules -notcontains $extension) {
        throw "Missing PHP extension: $extension"
    }
    Write-Host "  OK extension: $extension"
}

Write-Host 'Checking required files...'
$files = @(
    'artisan',
    'vendor/autoload.php',
    '.env',
    'database/database.sqlite',
    'resources/views/original/home.blade.php',
    'resources/views/original/app.blade.php',
    'resources/views/original/admin.blade.php',
    'public/css/original-overrides.css',
    'public/js/original-app.js',
    'routes/web.php',
    'routes/api.php'
)
foreach ($file in $files) {
    if (-not (Test-Path $file)) { throw "Missing required file: $file" }
    Write-Host "  OK file: $file"
}

Write-Host 'Clearing Laravel cache...'
& $php artisan optimize:clear

Write-Host 'Checking migrations...'
& $php artisan migrate:status

Write-Host 'Checking routes...'
& $php artisan route:list --except-vendor

Write-Host 'Project verification finished successfully.' -ForegroundColor Green
Write-Host 'Run START-LIFESTYLE.bat to start the project.'
