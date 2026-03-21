$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== SkunkScrape Test Runner ===" -ForegroundColor Cyan

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Error "Python is not available on PATH."
}

Write-Host "Python:" -ForegroundColor Yellow
python --version

Write-Host ""
Write-Host "Running pytest..." -ForegroundColor Yellow
python -m pytest

if ($LASTEXITCODE -ne 0) {
    Write-Error "Test run failed."
}

Write-Host ""
Write-Host "All tests passed." -ForegroundColor Green