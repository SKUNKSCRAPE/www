$ErrorActionPreference = "Stop"

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$snapshotDir = ".\data\release_snapshots"
$snapshotFile = Join-Path $snapshotDir "release_snapshot_$timestamp.txt"

New-Item -ItemType Directory -Force -Path $snapshotDir | Out-Null

function Add-Line {
    param([string]$Text)
    Add-Content -Path $snapshotFile -Value $Text
}

Add-Line "SkunkScrape Release Snapshot"
Add-Line "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Add-Line ""

Add-Line "[Python]"
try {
    $pyVersion = python --version 2>&1
    Add-Line $pyVersion
}
catch {
    Add-Line "Python not available"
}
Add-Line ""

Add-Line "[Git]"
try {
    $branch = git branch --show-current 2>&1
    $commit = git log -1 --pretty=format:"%H | %ad | %s" --date=iso 2>&1
    Add-Line "Branch: $branch"
    Add-Line "Latest Commit: $commit"
}
catch {
    Add-Line "Git information unavailable"
}
Add-Line ""

Add-Line "[Pytest]"
try {
    $pytestOutput = python -m pytest 2>&1
    $pytestOutput | ForEach-Object { Add-Line $_ }
}
catch {
    Add-Line "Pytest execution failed"
}
Add-Line ""

Add-Line "[Git Status]"
try {
    $gitStatus = git status --short 2>&1
    if ($gitStatus) {
        $gitStatus | ForEach-Object { Add-Line $_ }
    }
    else {
        Add-Line "Working tree clean"
    }
}
catch {
    Add-Line "Git status unavailable"
}
Add-Line ""

Add-Line "[Key Paths]"
$paths = @(
    ".\main.py",
    ".\pyproject.toml",
    ".\README.md",
    ".\CHANGELOG.md",
    ".\skunkscrape\plugins\manifest.json",
    ".\scripts",
    ".\tests"
)

foreach ($path in $paths) {
    if (Test-Path $path) {
        Add-Line "[OK]   $path"
    }
    else {
        Add-Line "[MISS] $path"
    }
}
Add-Line ""

Add-Line "[Recent Logs]"
if (Test-Path ".\data\logs") {
    Get-ChildItem ".\data\logs" -File |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 5 Name, LastWriteTime, Length |
        ForEach-Object {
            Add-Line "$($_.Name) | $($_.LastWriteTime) | $($_.Length) bytes"
        }
}
else {
    Add-Line "No logs folder found"
}
Add-Line ""

Add-Line "[Recent Outputs]"
if (Test-Path ".\data\output\smart_contact_crawler") {
    Get-ChildItem ".\data\output\smart_contact_crawler" -File |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 5 Name, LastWriteTime, Length |
        ForEach-Object {
            Add-Line "$($_.Name) | $($_.LastWriteTime) | $($_.Length) bytes"
        }
}
else {
    Add-Line "No crawler output folder found"
}
Add-Line ""

Write-Host ""
Write-Host "Release snapshot created:" -ForegroundColor Green
Write-Host $snapshotFile -ForegroundColor Cyan