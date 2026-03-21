$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== SkunkScrape Repo Status ===" -ForegroundColor Cyan

# Python
Write-Host ""
Write-Host "[Python]" -ForegroundColor Yellow
if (Get-Command python -ErrorAction SilentlyContinue) {
    python --version
} else {
    Write-Host "Python not found on PATH." -ForegroundColor Red
}

# Key files
Write-Host ""
Write-Host "[Key Paths]" -ForegroundColor Yellow
$paths = @(
    ".\main.py",
    ".\pyproject.toml",
    ".\README.md",
    ".\skunkscrape",
    ".\skunkscrape\plugins\manifest.json",
    ".\tests",
    ".\scripts"
)

foreach ($path in $paths) {
    if (Test-Path $path) {
        Write-Host "[OK]    $path" -ForegroundColor Green
    } else {
        Write-Host "[MISS]  $path" -ForegroundColor Red
    }
}

# Tests
Write-Host ""
Write-Host "[Tests]" -ForegroundColor Yellow
try {
    python -m pytest
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Test suite passed." -ForegroundColor Green
    } else {
        Write-Host "Test suite failed." -ForegroundColor Red
    }
}
catch {
    Write-Host "Pytest execution failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Git status
Write-Host ""
Write-Host "[Git Status]" -ForegroundColor Yellow
if (Get-Command git -ErrorAction SilentlyContinue) {
    git status --short
} else {
    Write-Host "Git not found on PATH." -ForegroundColor Red
}

# Recent log files
Write-Host ""
Write-Host "[Recent Logs]" -ForegroundColor Yellow
if (Test-Path ".\data\logs") {
    Get-ChildItem ".\data\logs" -File |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 5 Name, LastWriteTime, Length |
        Format-Table -AutoSize
} else {
    Write-Host "No data\logs folder found." -ForegroundColor DarkYellow
}

# Recent crawler outputs
Write-Host ""
Write-Host "[Recent Outputs]" -ForegroundColor Yellow
if (Test-Path ".\data\output\smart_contact_crawler") {
    Get-ChildItem ".\data\output\smart_contact_crawler" -File |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 5 Name, LastWriteTime, Length |
        Format-Table -AutoSize
} else {
    Write-Host "No smart_contact_crawler output folder found." -ForegroundColor DarkYellow
}

Write-Host ""
Write-Host "Repo status check complete." -ForegroundColor Cyan