$ErrorActionPreference = "Stop"
$hasBlockingIssue = $false

function Write-Section($title) {
    Write-Host ""
    Write-Host "[$title]" -ForegroundColor Yellow
}

function Flag-Blocking($message) {
    Write-Host $message -ForegroundColor Red
    $script:hasBlockingIssue = $true
}

Write-Host ""
Write-Host "=== SkunkScrape Commit Readiness Check ===" -ForegroundColor Cyan

Write-Section "Tooling"
if (Get-Command python -ErrorAction SilentlyContinue) {
    python --version
} else {
    Flag-Blocking "Python not found on PATH."
}

if (Get-Command git -ErrorAction SilentlyContinue) {
    git --version
} else {
    Flag-Blocking "Git not found on PATH."
}

Write-Section "Key Files"
$requiredPaths = @(
    ".\main.py",
    ".\pyproject.toml",
    ".\README.md",
    ".\skunkscrape\plugins\manifest.json",
    ".\tests\test_manifest.py",
    ".\tests\test_smart_contact_crawler.py",
    ".\tests\test_main.py"
)

foreach ($path in $requiredPaths) {
    if (Test-Path $path) {
        Write-Host "[OK]   $path" -ForegroundColor Green
    } else {
        Flag-Blocking "[MISS] $path"
    }
}

Write-Section "Pytest"
try {
    python -m pytest
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Test suite passed." -ForegroundColor Green
    } else {
        Flag-Blocking "Test suite failed."
    }
}
catch {
    Flag-Blocking "Pytest execution failed: $($_.Exception.Message)"
}

Write-Section "Merge Conflict Markers"
$conflicts = git grep -nE '^(<<<<<<<|=======|>>>>>>>)' 2>$null
if ($conflicts) {
    Flag-Blocking "Merge conflict markers found:"
    $conflicts | ForEach-Object { Write-Host $_ -ForegroundColor Red }
} else {
    Write-Host "No merge conflict markers found." -ForegroundColor Green
}

Write-Section "README Sanity Check"
if (Test-Path ".\README.md") {
    $readmeHead = Get-Content ".\README.md" -TotalCount 5
    $looksWrong = $false

    foreach ($line in $readmeHead) {
        if ($line -match '^\s*(import |from\s+\w+\s+import )') {
            $looksWrong = $true
        }
    }

    if ($looksWrong) {
        Flag-Blocking "README.md appears to contain Python code instead of markdown."
    } else {
        Write-Host "README.md looks sane." -ForegroundColor Green
    }
}

Write-Section "Tracked Artefact Risk"
$artefactPaths = @(
    ".\__pycache__",
    ".\skunkscrape.egg-info",
    ".\.pytest_cache",
    ".\data\logs",
    ".\data\output"
)

foreach ($path in $artefactPaths) {
    if (Test-Path $path) {
        Write-Host "[WARN] Present: $path" -ForegroundColor DarkYellow
    }
}

Write-Section "Git Status"
$gitStatus = git status --short
if ($gitStatus) {
    $gitStatus | ForEach-Object { Write-Host $_ }
} else {
    Write-Host "Working tree clean." -ForegroundColor Green
}

Write-Section "Ignored Files Check"
$ignored = git status --ignored --short 2>$null
if ($ignored) {
    Write-Host "Ignored file summary available." -ForegroundColor DarkGray
} else {
    Write-Host "No ignored file output." -ForegroundColor DarkGray
}

Write-Host ""
if ($hasBlockingIssue) {
    Write-Host "Commit readiness check completed with blocking issues." -ForegroundColor Red
    exit 1
} else {
    Write-Host "Commit readiness check passed." -ForegroundColor Green
    exit 0
}