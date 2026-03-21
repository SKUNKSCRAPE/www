$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== SkunkScrape Dev Bootstrap ===" -ForegroundColor Cyan

Write-Host ""
Write-Host "[1/6] Checking tooling..." -ForegroundColor Yellow

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Error "Python is not available on PATH."
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git is not available on PATH."
}

python --version
git --version

Write-Host ""
Write-Host "[2/6] Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip

Write-Host ""
Write-Host "[3/6] Installing project in editable mode..." -ForegroundColor Yellow
python -m pip install -e .

if ($LASTEXITCODE -ne 0) {
    Write-Error "Editable install failed."
}

Write-Host ""
Write-Host "[4/6] Ensuring pytest is installed..." -ForegroundColor Yellow
python -m pip install -U pytest

if ($LASTEXITCODE -ne 0) {
    Write-Error "pytest installation failed."
}

Write-Host ""
Write-Host "[5/6] Running tests..." -ForegroundColor Yellow
python -m pytest

if ($LASTEXITCODE -ne 0) {
    Write-Error "Test run failed."
}

Write-Host ""
Write-Host "[6/6] Repo snapshot..." -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "Bootstrap completed successfully." -ForegroundColor Green