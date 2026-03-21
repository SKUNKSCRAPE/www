param(
    [Parameter(Mandatory = $true)]
    [string]$Message,

    [switch]$Push
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== SkunkScrape Commit Project ===" -ForegroundColor Cyan

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git is not available on PATH."
}

if (-not (Test-Path ".\scripts\commit_ready.ps1")) {
    Write-Error "scripts\commit_ready.ps1 not found."
}

Write-Host ""
Write-Host "[1/4] Running commit readiness check..." -ForegroundColor Yellow
powershell -ExecutionPolicy Bypass -File .\scripts\commit_ready.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Error "Commit readiness check failed."
}

Write-Host ""
Write-Host "[2/4] Staging approved files..." -ForegroundColor Yellow

$pathsToStage = @(
    ".\main.py",
    ".\pyproject.toml",
    ".\README.md",
    ".\.gitignore",
    ".\skunkscrape",
    ".\tests",
    ".\scripts"
)

foreach ($path in $pathsToStage) {
    if (Test-Path $path) {
        git add $path
    }
}

Write-Host ""
Write-Host "[3/4] Git status after staging:" -ForegroundColor Yellow
git status --short

$staged = git diff --cached --name-only

if (-not $staged) {
    Write-Host ""
    Write-Host "No staged changes to commit. Working tree is already clean." -ForegroundColor DarkYellow

    if ($Push.IsPresent) {
        Write-Host ""
        Write-Host "[Push] Pushing existing local commits to origin main..." -ForegroundColor Yellow
        git push origin main

        if ($LASTEXITCODE -ne 0) {
            Write-Error "Git push failed."
        }
    }

    Write-Host ""
    Write-Host "Commit workflow completed with no new commit required." -ForegroundColor Green
    exit 0
}

Write-Host ""
Write-Host "[4/4] Creating commit..." -ForegroundColor Yellow
git commit -m $Message

if ($LASTEXITCODE -ne 0) {
    Write-Error "Git commit failed."
}

if ($Push.IsPresent) {
    Write-Host ""
    Write-Host "[Push] Pushing to origin main..." -ForegroundColor Yellow
    git push origin main

    if ($LASTEXITCODE -ne 0) {
        Write-Error "Git push failed."
    }
}

Write-Host ""
Write-Host "Commit workflow completed successfully." -ForegroundColor Green