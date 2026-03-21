param(
    [switch]$IncludeData
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== SkunkScrape Artifact Cleanup ===" -ForegroundColor Cyan

$paths = @(
    ".\__pycache__",
    ".\.pytest_cache",
    ".\skunkscrape.egg-info",
    ".\build",
    ".\dist"
)

if ($IncludeData.IsPresent) {
    $paths += @(
        ".\data\logs",
        ".\data\output"
    )
}

foreach ($path in $paths) {
    if (Test-Path $path) {
        Write-Host "Removing $path" -ForegroundColor Yellow
        Remove-Item -Recurse -Force $path
    }
    else {
        Write-Host "Skipping missing path: $path" -ForegroundColor DarkGray
    }
}

Write-Host ""
Write-Host "Cleanup complete." -ForegroundColor Green