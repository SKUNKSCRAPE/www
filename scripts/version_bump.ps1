param(
    [Parameter(Mandatory = $true)]
    [string]$Version,

    [string]$ReleaseDate = "",

    [switch]$UpdateChangelog
)

$ErrorActionPreference = "Stop"

function Fail($Text) {
    Write-Host $Text -ForegroundColor Red
    exit 1
}

function Info($Text) {
    Write-Host $Text -ForegroundColor Yellow
}

function Success($Text) {
    Write-Host $Text -ForegroundColor Green
}

Write-Host ""
Write-Host "=== SkunkScrape Version Bump ===" -ForegroundColor Cyan

$normalizedVersion = $Version.Trim()
if ([string]::IsNullOrWhiteSpace($normalizedVersion)) {
    Fail "Version cannot be empty."
}

if ($normalizedVersion -match '^[vV]') {
    $normalizedVersion = $normalizedVersion.Substring(1)
}

if ($normalizedVersion -notmatch '^\d+\.\d+\.\d+$') {
    Fail "Version must use semantic format like 2.2.1"
}

if ([string]::IsNullOrWhiteSpace($ReleaseDate)) {
    $ReleaseDate = Get-Date -Format "yyyy-MM-dd"
}

$pyprojectPath = ".\pyproject.toml"
$initPath = ".\skunkscrape\__init__.py"
$manifestPath = ".\skunkscrape\plugins\manifest.json"
$changelogPath = ".\CHANGELOG.md"

$required = @($pyprojectPath, $initPath, $manifestPath)
foreach ($path in $required) {
    if (-not (Test-Path $path)) {
        Fail "Required file not found: $path"
    }
}

Info "Target version: $normalizedVersion"
Info "Release date:   $ReleaseDate"
Write-Host ""

# Update pyproject.toml
Info "[1/4] Updating pyproject.toml"
$pyproject = Get-Content $pyprojectPath -Raw
$pyprojectMatch = [regex]::Match($pyproject, '(?m)^version\s*=\s*"([^"]+)"')
if (-not $pyprojectMatch.Success) {
    Fail "Could not find version in pyproject.toml"
}
$currentPyprojectVersion = $pyprojectMatch.Groups[1].Value
if ($currentPyprojectVersion -eq $normalizedVersion) {
    Info "pyproject.toml already set to $normalizedVersion"
}
else {
    $pyprojectUpdated = [regex]::Replace(
        $pyproject,
        '(?m)^version\s*=\s*"[^"]+"',
        "version = `"$normalizedVersion`"",
        1
    )
    [System.IO.File]::WriteAllText((Resolve-Path $pyprojectPath), $pyprojectUpdated, (New-Object System.Text.UTF8Encoding($false)))
    Success "Updated pyproject.toml"
}

# Update skunkscrape\__init__.py
Info "[2/4] Updating skunkscrape\__init__.py"
$initContent = Get-Content $initPath -Raw
$initMatch = [regex]::Match($initContent, '(?m)^__version__\s*=\s*"([^"]+)"')
if (-not $initMatch.Success) {
    Fail "Could not find __version__ in skunkscrape\__init__.py"
}
$currentInitVersion = $initMatch.Groups[1].Value
if ($currentInitVersion -eq $normalizedVersion) {
    Info "skunkscrape\__init__.py already set to $normalizedVersion"
}
else {
    $initUpdated = [regex]::Replace(
        $initContent,
        '(?m)^__version__\s*=\s*"[^"]+"',
        "__version__ = `"$normalizedVersion`"",
        1
    )
    [System.IO.File]::WriteAllText((Resolve-Path $initPath), $initUpdated, (New-Object System.Text.UTF8Encoding($false)))
    Success "Updated skunkscrape\__init__.py"
}

# Update manifest.json using Python to preserve readable formatting
Info "[3/4] Updating skunkscrape\plugins\manifest.json"
python -c "import json, pathlib; p = pathlib.Path(r'$manifestPath'); data = json.loads(p.read_text(encoding='utf-8-sig')); data.setdefault('app', {}); data['app']['version'] = '$normalizedVersion'; p.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')"
if ($LASTEXITCODE -ne 0) {
    Fail "Failed to update manifest.json"
}
Success "Updated manifest.json"

# Optionally update changelog
Info "[4/4] Changelog handling"
if ($UpdateChangelog.IsPresent) {
    if (-not (Test-Path $changelogPath)) {
        Fail "CHANGELOG.md not found."
    }

    $changelog = Get-Content $changelogPath -Raw
    $header = "## [$normalizedVersion] - $ReleaseDate"

    if ($changelog -match [regex]::Escape($header)) {
        Info "CHANGELOG already contains $header"
    }
    else {
        $newSection = @"

## [$normalizedVersion] - $ReleaseDate

### Added

### Changed

### Fixed
"@

        if ($changelog -match "(?m)^## \[") {
            $changelog = [regex]::Replace($changelog, '(?m)^## \[', "$newSection`r`n## [", 1)
        }
        else {
            $changelog = $changelog.TrimEnd() + "`r`n" + $newSection + "`r`n"
        }

        [System.IO.File]::WriteAllText((Resolve-Path $changelogPath), $changelog, (New-Object System.Text.UTF8Encoding($false)))
        Success "Prepended new changelog section"
    }
}
else {
    Info "Changelog update skipped."
}

Write-Host ""
Success "Version bump completed successfully."
Write-Host "Updated version: $normalizedVersion" -ForegroundColor Cyan