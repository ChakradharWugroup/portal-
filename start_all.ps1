$ErrorActionPreference = "Stop"

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "   Smart Enterprise AI Platform & Integrations" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

Write-Host "Cleaning up previously locked ports (EADDRINUSE prevention)..." -ForegroundColor Magenta
$portsToClear = @(8080, 6432, 3004, 3001, 3002, 8000, 8005, 8440, 8445, 3441, 3442)
foreach ($p in $portsToClear) {
    $conns = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue
    if ($conns) {
        foreach ($c in $conns) {
            Write-Host "  -> Killing locked port $p (PID: $($c.OwningProcess))" -ForegroundColor DarkGray
            Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue
        }
    }
}
Start-Sleep -Seconds 2

# 1 & 2. Start Unified Django Backend
Write-Host "[1 & 2/8] Starting Unified Django Backend (Port 8005)..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd C:\Users\KalleChakradhar\Desktop\portal\django_backend; ..\venv_django\Scripts\python.exe manage.py runserver 0.0.0.0:8005"

# 3. Start Portal Frontend
Write-Host "[3/8] Starting Portal Frontend (Port 3004)..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd C:\Users\KalleChakradhar\Desktop\portal\frontend; npm run dev"

# 4. Start Dify Gateway
Write-Host "[4/8] Starting Dify Gateway..." -ForegroundColor Yellow
Start-Process cmd.exe -ArgumentList "/k", "cd C:\Users\KalleChakradhar\Downloads\dify\enterprise-ai-platform && .\run_gateway.bat"

# 5. Start NextChat
Write-Host "[5/8] Starting NextChat (Port 3001)..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd C:\Users\KalleChakradhar\Downloads\dify\enterprise-ai-platform\apps\nextchat; `$env:PORT=3001; npm run dev -- -H 0.0.0.0"

# 6. Start RVC Studio (Port 3002)
Write-Host "[6/8] Starting RVC Studio (Port 3002)..." -ForegroundColor Yellow
Start-Process cmd.exe -ArgumentList "/k", "cd C:\Users\KalleChakradhar\Downloads\project\RVC && .\go-webui.bat"

# 7. Start Unified AI Backend (Port 8080)
Write-Host "[7/8] Starting Unified AI Backend (Port 8080)..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd C:\Users\KalleChakradhar\Desktop\portal\ai-service; uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload"

# 8. Start HTTPS Secure Wrapper
Write-Host "[8/8] Starting HTTPS Secure Wrapper..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd C:\Users\KalleChakradhar\Desktop\portal\frontend; node https-wrapper.js"

# Get the local IPv4 address (excluding virtual/loopback adapters)
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 -Type Unicast | Where-Object { $_.InterfaceAlias -notmatch 'Loopback|vEthernet|WSL|Tailscale' } | Select-Object -First 1).IPAddress
if (-not $ipAddress) { $ipAddress = "localhost" }

Write-Host "----------------------------------------------" -ForegroundColor Green
Write-Host "All services launched successfully in separate windows!" -ForegroundColor Green
Write-Host "  - Portal Frontend:    https://${ipAddress}:3004" -ForegroundColor Green
Write-Host "  - Portal Backend:     https://${ipAddress}:8445" -ForegroundColor Green
Write-Host "  - NextChat:           https://${ipAddress}:3441" -ForegroundColor Green
Write-Host "  - RVC Studio:         https://${ipAddress}:3442" -ForegroundColor Green
Write-Host "  - Unified AI API:     https://${ipAddress}:8440" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

Write-Host "Waiting 8 seconds for services to start before opening browser..." -ForegroundColor Cyan
Start-Sleep -Seconds 8
Start-Process "https://${ipAddress}:3004"

