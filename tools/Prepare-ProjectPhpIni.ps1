param(
    [Parameter(Mandatory = $true)]
    [string]$PhpExe,

    [Parameter(Mandatory = $true)]
    [string]$RuntimeDir
)

$ErrorActionPreference = 'Stop'

function Get-FullExecutablePath {
    param([string]$Executable)

    if (Test-Path -LiteralPath $Executable) {
        return (Resolve-Path -LiteralPath $Executable).Path
    }

    $command = Get-Command $Executable -ErrorAction Stop
    return $command.Source
}

function Set-IniDirective {
    param(
        [System.Collections.Generic.List[string]]$Lines,
        [string]$Name,
        [string]$Value
    )

    $escaped = [regex]::Escape($Name)
    $pattern = "^\s*;?\s*$escaped\s*=.*$"
    $replacement = "$Name=$Value"
    $firstMatch = -1

    for ($i = 0; $i -lt $Lines.Count; $i++) {
        if ($Lines[$i] -match $pattern) {
            if ($firstMatch -eq -1) {
                $firstMatch = $i
                $Lines[$i] = $replacement
            } else {
                $Lines[$i] = '; ' + $Lines[$i]
            }
        }
    }

    if ($firstMatch -eq -1) {
        $Lines.Add($replacement)
    }
}

function Enable-PhpExtension {
    param(
        [System.Collections.Generic.List[string]]$Lines,
        [string]$ExtensionName
    )

    $escaped = [regex]::Escape($ExtensionName)
    $pattern = '^\s*;?\s*extension\s*=\s*"?(?:php_)?' + $escaped + '(?:\.dll)?"?\s*(?:;.*)?$'
    $firstMatch = -1

    for ($i = 0; $i -lt $Lines.Count; $i++) {
        if ($Lines[$i] -match $pattern) {
            if ($firstMatch -eq -1) {
                $firstMatch = $i
                $Lines[$i] = "extension=$ExtensionName"
            } else {
                $Lines[$i] = '; duplicate disabled by Lifestyle launcher: ' + $Lines[$i]
            }
        }
    }

    if ($firstMatch -eq -1) {
        $Lines.Add("extension=$ExtensionName")
    }
}

$phpPath = Get-FullExecutablePath -Executable $PhpExe
$phpDir = Split-Path -Parent $phpPath
$extensionDir = Join-Path $phpDir 'ext'

if (-not (Test-Path -LiteralPath $extensionDir)) {
    throw "PHP extension directory was not found: $extensionDir"
}

New-Item -ItemType Directory -Force -Path $RuntimeDir | Out-Null
$runtimeIni = Join-Path $RuntimeDir 'php.ini'

$iniOutput = & $phpPath --ini 2>&1
$loadedIni = $null
foreach ($line in $iniOutput) {
    if ($line -match '^Loaded Configuration File:\s*(.+)$') {
        $candidate = $Matches[1].Trim()
        if ($candidate -and $candidate -ne '(none)' -and (Test-Path -LiteralPath $candidate)) {
            $loadedIni = $candidate
        }
        break
    }
}

$sourceIni = $loadedIni
if (-not $sourceIni) {
    $productionIni = Join-Path $phpDir 'php.ini-production'
    $developmentIni = Join-Path $phpDir 'php.ini-development'

    if (Test-Path -LiteralPath $productionIni) {
        $sourceIni = $productionIni
    } elseif (Test-Path -LiteralPath $developmentIni) {
        $sourceIni = $developmentIni
    }
}

if ($sourceIni) {
    Copy-Item -LiteralPath $sourceIni -Destination $runtimeIni -Force
    Write-Host "Using PHP configuration template: $sourceIni"
} else {
    New-Item -ItemType File -Force -Path $runtimeIni | Out-Null
    Write-Host 'No PHP configuration template was found; creating a minimal project configuration.'
}

$rawLines = if (Test-Path -LiteralPath $runtimeIni) {
    [System.IO.File]::ReadAllLines($runtimeIni)
} else {
    @()
}

$lines = [System.Collections.Generic.List[string]]::new()
foreach ($line in $rawLines) {
    $lines.Add($line)
}

$lines.Add('')
$lines.Add('; Lifestyle Management System project-local PHP settings')
Set-IniDirective -Lines $lines -Name 'extension_dir' -Value ('"' + $extensionDir + '"')
Set-IniDirective -Lines $lines -Name 'date.timezone' -Value 'UTC'

$baseModules = @(& $phpPath -m 2>$null)
$requiredExtensions = @('mbstring', 'openssl', 'pdo_sqlite', 'sqlite3', 'fileinfo')
foreach ($extension in $requiredExtensions) {
    $dll = Join-Path $extensionDir ("php_$extension.dll")

    if (Test-Path -LiteralPath $dll) {
        Enable-PhpExtension -Lines $lines -ExtensionName $extension
        Write-Host "Enabled for this project: $extension"
        continue
    }

    if ($baseModules -contains $extension) {
        Write-Host "Available as a built-in extension: $extension"
        continue
    }

    throw "Required PHP extension DLL was not found: $dll"
}

$encoding = [System.Text.UTF8Encoding]::new($false)
[System.IO.File]::WriteAllLines($runtimeIni, $lines, $encoding)

Write-Host "Project-local php.ini prepared: $runtimeIni" -ForegroundColor Green
Write-Output $runtimeIni
