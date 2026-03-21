param(
    [Parameter(Mandatory = $true)]
    [string]$Version,

    [string]$Message,

    [switch]$Push,

    [switch]$SkipChecks
)

$ErrorActionPreference = "Stop"

function Fail($Text) {
    Write-Host $Text -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== SkunkScrape Release Tagging ===" -ForegroundColor Cyan

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Fail "Git is not available on PATH."
}

if (-not (Test-Path ".\CHANGELOG.md")) {
    Fail "CHANGELOG.md not found."
}

if (-not (Test-Path ".\scripts\commit_ready.ps1") -and -not $SkipChecks.IsPresent) {
    Fail "scripts\commit_ready.ps1 not found."
}

$normalizedVersion = $Version.Trim()
if ([string]::IsNullOrWhiteSpace($normalizedVersion)) {
    Fail "Version cannot be empty."
}

if ($normalizedVersion -match '^[vV]') {
    $normalizedVersion = $normalizedVersion.Substring(1)
}

$tagName = "v$normalizedVersion"

if ([string]::IsNullOrWhiteSpace($Message)) {
    $Message = "Release $tagName"
}

Write-Host "Version: $normalizedVersion" -ForegroundColor Yellow
Write-Host "Tag:     $tagName" -ForegroundColor Yellow
Write-Host "Message: $Message" -ForegroundColor Yellow
Write-Host "Push:    $($Push.IsPresent)" -ForegroundColor Yellow
Write-Host ""

if (-not $SkipChecks.IsPresent) {
    Write-Host "[1/5] Running commit readiness check..." -ForegroundColor Yellow
    powershell -ExecutionPolicy Bypass -File .\scripts\commit_ready.ps1
    if ($LASTEXITCODE -ne 0) {
        Fail "Commit readiness check failed."
    }
}
else {
    Write-Host "[1/5] Skipping commit readiness check." -ForegroundColor DarkYellow
}

Write-Host "[2/5] Checking working tree..." -ForegroundColor Yellow
$workingTree = git status --porcelain
if ($workingTree) {
    Write-Host $workingTree
    Fail "Working tree is not clean. Commit or stash changes before tagging."
}
else {
    Write-Host "Working tree is clean." -ForegroundColor Green
}

Write-Host "[3/5] Checking if tag already exists..." -ForegroundColor Yellow
$existingTag = git tag --list $tagName
if ($existingTag) {
    Fail "Tag already exists: $tagName"
}
else {
    Write-Host "Tag is available." -ForegroundColor Green
}

Write-Host "[4/5] Creating annotated tag..." -ForegroundColor Yellow
git tag -a $tagName -m $Message
if ($LASTEXITCODE -ne 0) {
    Fail "Failed to create tag $tagName"
}

Write-Host "Tag created: $tagName" -ForegroundColor Green

if ($Push.IsPresent) {
    Write-Host "[5/5] Pushing tag to origin..." -ForegroundColor Yellow
    git push origin $tagName
    if ($LASTEXITCODE -ne 0) {
        Fail "Failed to push tag $tagName to origin."
    }
    Write-Host "Tag pushed to origin: $tagName" -ForegroundColor Green
}
else {
    Write-Host "[5/5] Push skipped." -ForegroundColor DarkYellow
}

Write-Host ""
Write-Host "Release tagging completed successfully." -ForegroundColor Green