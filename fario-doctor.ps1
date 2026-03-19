# FARIO DOCTOR - Project Health Monitor
# Powered by Antigravity | Fario India
# Usage: powershell -ExecutionPolicy Bypass -File fario-doctor.ps1

param([switch]$Watch)

$Host.UI.RawUI.WindowTitle = "Fario Doctor"

function Write-Banner {
    Clear-Host
    Write-Host ""
    Write-Host "  +----------------------------------------------------------+" -ForegroundColor DarkMagenta
    Write-Host "  |   FARIO DOCTOR  .  Project Health Monitor                |" -ForegroundColor Magenta
    Write-Host "  |   Powered by Antigravity  .  Fario India                 |" -ForegroundColor DarkMagenta
    Write-Host "  +----------------------------------------------------------+" -ForegroundColor DarkMagenta
    Write-Host ""
    Write-Host "  Scan started: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor DarkGray
    Write-Host "  Root: $(Get-Location)" -ForegroundColor DarkGray
    Write-Host ""
}

function Write-Section([string]$title) {
    Write-Host ""
    Write-Host "  -----------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "  >> $title" -ForegroundColor Cyan
    Write-Host "  -----------------------------------------------------------" -ForegroundColor DarkGray
}

function Write-Pass([string]$msg) { Write-Host "  [PASS]  $msg" -ForegroundColor Green }
function Write-Warn([string]$msg) { Write-Host "  [WARN]  $msg" -ForegroundColor Yellow }
function Write-Fail([string]$msg) { Write-Host "  [FAIL]  $msg" -ForegroundColor Red }
function Write-Info([string]$msg) { Write-Host "  [INFO]  $msg" -ForegroundColor DarkCyan }
function Write-Tip([string]$msg) { Write-Host "  [TIP]   $msg" -ForegroundColor Magenta }

$script:TotalPass = 0
$script:TotalWarn = 0
$script:TotalFail = 0
$script:Issues = [System.Collections.Generic.List[string]]::new()

function Show-Pass([string]$msg) { Write-Pass $msg; $script:TotalPass++ }
function Show-Warn([string]$msg) { Write-Warn $msg; $script:TotalWarn++; $script:Issues.Add("[WARN] $msg") }
function Show-Fail([string]$msg) { Write-Fail $msg; $script:TotalFail++; $script:Issues.Add("[FAIL] $msg") }

# ── 1. ENVIRONMENT CHECK ─────────────────────────────────────────────────────
Write-Banner
Write-Section "1. Environment Check"

$nodeVer = node --version 2>$null
if ($nodeVer) { Show-Pass "Node.js: $nodeVer" } else { Show-Fail "Node.js NOT found - install from nodejs.org" }

$npmVer = npm --version 2>$null
if ($npmVer) { Show-Pass "npm: v$npmVer" } else { Show-Warn "npm not found" }

$gitVer = git --version 2>$null
if ($gitVer) { Show-Pass "Git installed" } else { Show-Warn "Git not found" }

# ── 2. CRITICAL FILES CHECK ──────────────────────────────────────────────────
Write-Section "2. Critical Files Check"

$critFiles = @("package.json", "vite.config.ts", "tsconfig.json", "App.tsx", "index.html", ".env", ".github/workflows/deploy.yml")
foreach ($f in $critFiles) {
    if (Test-Path $f) { Show-Pass "Found: $f" }
    else { Show-Fail "MISSING: $f" }
}

# ── 3. SECURITY CHECK ────────────────────────────────────────────────────────
Write-Section "3. Security and Environment Check"

if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "VITE_SUPABASE_URL") { Show-Pass ".env has VITE_SUPABASE_URL" }
    else { Show-Warn ".env missing VITE_SUPABASE_URL" }
    if ($envContent -match "VITE_SUPABASE_ANON_KEY") { Show-Pass ".env has VITE_SUPABASE_ANON_KEY" }
    else { Show-Warn ".env missing VITE_SUPABASE_ANON_KEY" }
    if ($envContent -match "SERVICE_ROLE|service_role") {
        Show-Fail "DANGER: SERVICE_ROLE key found in .env! Never expose this in frontend."
    }
    else {
        Show-Pass "No SERVICE_ROLE key exposed"
    }
}
else {
    Show-Fail ".env file is missing"
}

if (Test-Path ".gitignore") {
    $gi = Get-Content ".gitignore" -Raw
    if ($gi -match "\.env") { Show-Pass ".env is in .gitignore" }
    else { Show-Fail ".env is NOT in .gitignore - secrets may be pushed to GitHub!" }
}
else {
    Show-Fail ".gitignore is missing"
}

# ── 4. DEPENDENCY AUDIT ──────────────────────────────────────────────────────
Write-Section "4. Dependency Security Audit"
Write-Info "Running npm audit..."

try {
    $rawAudit = npm audit --json 2>$null
    $audit = $rawAudit | ConvertFrom-Json
    $crit = $audit.metadata.vulnerabilities.critical
    $high = $audit.metadata.vulnerabilities.high
    $mod = $audit.metadata.vulnerabilities.moderate
    $low = $audit.metadata.vulnerabilities.low

    if ($crit -gt 0) { Show-Fail "$crit CRITICAL vulnerabilities - run: npm audit fix" }
    else { Show-Pass "No critical vulnerabilities" }
    if ($high -gt 0) { Show-Warn "$high HIGH severity vulnerabilities" }
    else { Show-Pass "No high severity vulnerabilities" }
    if ($mod -gt 0) { Write-Info "$mod moderate + $low low vulnerabilities (review later)" }
    else { Show-Pass "No moderate or low vulnerabilities" }
}
catch {
    Write-Info "Could not parse audit output - run 'npm audit' manually"
}

# ── 5. TYPESCRIPT CHECK ──────────────────────────────────────────────────────
Write-Section "5. TypeScript Compilation Check"
Write-Info "Running tsc --noEmit..."

$tscOutput = npx tsc --noEmit 2>&1
if ($LASTEXITCODE -eq 0) {
    Show-Pass "TypeScript: ZERO errors - clean build!"
}
else {
    $tsErrors = $tscOutput | Select-String "error TS"
    $errCount = ($tsErrors | Measure-Object).Count
    Show-Fail "TypeScript: $errCount error(s) found"
    $tsErrors | Select-Object -First 8 | ForEach-Object {
        Write-Host "    $($_.Line)" -ForegroundColor Red
    }
    if ($errCount -gt 8) { Write-Info "...and $($errCount - 8) more errors" }
}

# ── 6. DEBUG STATEMENT DETECTOR ──────────────────────────────────────────────
Write-Section "6. Code Quality - Debug Statements"

$srcFiles = Get-ChildItem -Recurse -Include "*.ts", "*.tsx" |
Where-Object { $_.FullName -notmatch "node_modules" }

$consoleLogs = $srcFiles | Select-String -Pattern "console\.log\("
if ($consoleLogs -and $consoleLogs.Count -gt 0) {
    Show-Warn "$($consoleLogs.Count) console.log() statements found (remove before production)"
    $consoleLogs | Select-Object -First 5 | ForEach-Object {
        Write-Info "  $($_.Filename):$($_.LineNumber)"
    }
}
else {
    Show-Pass "No leftover console.log() statements"
}

$todos = $srcFiles | Select-String -Pattern "TODO|FIXME|HACK"
if ($todos -and ($todos | Measure-Object).Count -gt 0) {
    $c = ($todos | Measure-Object).Count
    Show-Warn "$c TODO/FIXME markers in codebase"
}
else {
    Show-Pass "No unresolved TODO/FIXME markers"
}

# ── 7. FILE SIZE CHECK ───────────────────────────────────────────────────────
Write-Section "7. File Size Check"

$largeFiles = Get-ChildItem -Recurse -Include "*.ts", "*.tsx" |
Where-Object { $_.FullName -notmatch "node_modules" -and $_.Length -gt 51200 }

if (($largeFiles | Measure-Object).Count -gt 0) {
    Show-Warn "$(($largeFiles | Measure-Object).Count) file(s) over 50KB - consider splitting"
    $largeFiles | ForEach-Object {
        Write-Info "  $($_.Name): $([math]::Round($_.Length / 1KB, 1))KB"
    }
}
else {
    Show-Pass "All source files within healthy size limits"
}

# ── 8. BUILD CHECK ───────────────────────────────────────────────────────────
Write-Section "8. Build Status"

if (Test-Path "dist") {
    $distAge = (Get-Date) - (Get-Item "dist").LastWriteTime
    if ($distAge.TotalHours -lt 24) { Show-Pass "dist/ was built within last 24 hours" }
    else { Show-Warn "dist/ is $([math]::Round($distAge.TotalHours))h old - may be stale" }
}
else {
    Show-Warn "No dist/ folder found - run 'npm run build'"
}

# ── 9. GIT STATUS ────────────────────────────────────────────────────────────
Write-Section "9. Git Repository Status"

$gitStatus = git status --porcelain 2>$null
$uncommitted = if ($gitStatus) { ($gitStatus | Measure-Object -Line).Lines } else { 0 }

if ($uncommitted -eq 0) { Show-Pass "All changes committed - clean working tree" }
else {
    Show-Warn "$uncommitted file(s) with uncommitted changes"
    if ($gitStatus) { $gitStatus | Select-Object -First 5 | ForEach-Object { Write-Info "  $_" } }
}

$lastCommit = git log -1 --format="%h %s (%cr)" 2>$null
if ($lastCommit) { Write-Info "Last commit: $lastCommit" }

# ── FINAL REPORT ─────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "  +----------------------------------------------------------+" -ForegroundColor DarkMagenta
Write-Host "  |               HEALTH REPORT SUMMARY                     |" -ForegroundColor Magenta
Write-Host "  +----------------------------------------------------------+" -ForegroundColor DarkMagenta
Write-Host ("  |  PASS: " + $script:TotalPass.ToString().PadRight(5) + "  WARN: " + $script:TotalWarn.ToString().PadRight(5) + "  FAIL: " + $script:TotalFail.ToString().PadRight(5) + "             |") -ForegroundColor White
Write-Host "  +----------------------------------------------------------+" -ForegroundColor DarkMagenta
Write-Host ""

$healthScore = [math]::Max(0, [math]::Round(100 - ($script:TotalFail * 15) - ($script:TotalWarn * 5)))
$color = if ($healthScore -ge 80) { "Green" } elseif ($healthScore -ge 50) { "Yellow" } else { "Red" }

Write-Host "  Health Score: $healthScore / 100" -ForegroundColor $color
Write-Host ""

if ($script:TotalFail -eq 0 -and $script:TotalWarn -eq 0) {
    Write-Host "  PERFECT HEALTH! Fario India is running flawlessly." -ForegroundColor Green
}
elseif ($script:TotalFail -gt 0) {
    Write-Host "  CRITICAL ISSUES DETECTED - Fix the [FAIL] items immediately!" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Issues to fix:" -ForegroundColor Yellow
    foreach ($issue in $script:Issues) { Write-Host "    $issue" -ForegroundColor Yellow }
}
else {
    Write-Host "  Minor warnings found. Review when possible." -ForegroundColor Yellow
}

Write-Host ""
Write-Tip "Run watch mode: powershell -ExecutionPolicy Bypass -File fario-doctor.ps1 -Watch"
Write-Tip "Fix vulnerabilities: npm audit fix"
Write-Tip "Fix TS errors: npx tsc --noEmit"
Write-Host ""
Write-Host "  Fario Doctor scan complete - $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor DarkGray
Write-Host ""

if ($Watch) {
    Write-Host "  WATCH MODE: Re-scanning in 60 seconds. Press Ctrl+C to stop." -ForegroundColor Cyan
    Start-Sleep -Seconds 60
    & $PSCommandPath -Watch
}
