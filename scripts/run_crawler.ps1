param(
    [Parameter(Mandatory = $true)]
    [string]$Url,

    [int]$Depth = 1,

    [int]$TargetLeads = 100,

    [string]$ProxyFile = "C:\Users\Raydo\OneDrive\Apps\SkunkScrape\data\proxies\Webshare 10 proxies.txt",

    [switch]$ToWebhook,

    [int]$MaxPages = 50,

    [int]$Timeout = 20
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== SkunkScrape Crawler Runner ===" -ForegroundColor Cyan
Write-Host "URL:          $Url" -ForegroundColor Yellow
Write-Host "Depth:        $Depth" -ForegroundColor Yellow
Write-Host "Target Leads: $TargetLeads" -ForegroundColor Yellow
Write-Host "Max Pages:    $MaxPages" -ForegroundColor Yellow
Write-Host "Timeout:      $Timeout" -ForegroundColor Yellow
Write-Host "Proxy File:   $ProxyFile" -ForegroundColor Yellow
Write-Host "Webhook:      $($ToWebhook.IsPresent)" -ForegroundColor Yellow
Write-Host ""

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Error "Python is not available on PATH."
}

if (-not (Test-Path ".\main.py")) {
    Write-Error "main.py was not found in the current directory. Run this script from the repo root."
}

$cmd = @(
    "python",
    ".\main.py",
    "--plugin", "smart_contact_crawler",
    "--url", $Url,
    "--depth", $Depth.ToString(),
    "--target-leads", $TargetLeads.ToString(),
    "--proxy-file", $ProxyFile,
    "--max-pages", $MaxPages.ToString(),
    "--timeout", $Timeout.ToString()
)

if ($ToWebhook.IsPresent) {
    $cmd += "--to-webhook"
}

Write-Host "Executing:" -ForegroundColor Cyan
Write-Host ($cmd -join " ") -ForegroundColor Gray
Write-Host ""

& python .\main.py `
    --plugin smart_contact_crawler `
    --url $Url `
    --depth $Depth `
    --target-leads $TargetLeads `
    --proxy-file $ProxyFile `
    --max-pages $MaxPages `
    --timeout $Timeout `
    $(if ($ToWebhook.IsPresent) { "--to-webhook" })

if ($LASTEXITCODE -ne 0) {
    Write-Error "Crawler execution failed."
}

Write-Host ""
Write-Host "Crawler run completed." -ForegroundColor Green