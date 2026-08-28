$ErrorActionPreference = "Stop"

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "   Smart Enterprise AI Platform & Integrations" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

Write-Host "Cleaning up previously locked ports (EADDRINUSE prevention)..." -ForegroundColor Magenta
$portsToClear = @(8080, 6432, 3004, 3001, 3002, 3000, 8081, 8080, 8000, 8005)
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
Write-Host "[1 & 2/9] Starting Unified Django Backend (Port 8005)..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd C:\Users\KalleChakradhar\Desktop\portal\django_backend; ..\venv_django\Scripts\python.exe manage.py runserver 0.0.0.0:8005"

# 3. Start Portal Frontend
Write-Host "[3/9] Starting Portal Frontend (Port 3004)..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd C:\Users\KalleChakradhar\Desktop\portal\frontend; npm run dev"

# 4. Start Dify Gateway
Write-Host "[4/9] Starting Dify Gateway..." -ForegroundColor Yellow
Start-Process cmd.exe -ArgumentList "/k", "cd C:\Users\KalleChakradhar\Downloads\dify\enterprise-ai-platform && .\run_gateway.bat"

# 5. Start NextChat
Write-Host "[5/9] Starting NextChat (Port 3001)..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd C:\Users\KalleChakradhar\Downloads\dify\enterprise-ai-platform\apps\nextchat; `$env:PORT=3001; npm run dev -- -H 0.0.0.0"

# 6. Start Meeting AI Backend (Port 8081)
Write-Host "[6/9] Starting Meeting AI Backend (Port 8081)..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd C:\Users\KalleChakradhar\Desktop\meeting_AI_report\meeting-ai-enterprise; uvicorn backend.api.fastapi:app --host 0.0.0.0 --port 8081 --reload"

# 7. Start Meeting AI Frontend (Port 3000)
Write-Host "[7/9] Starting Meeting AI Frontend (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd C:\Users\KalleChakradhar\Desktop\meeting_AI_report\meeting-ai-enterprise\frontend; npm run dev -- -H 0.0.0.0 -p 3000"

# 8. Start RVC Studio (Port 3002)
Write-Host "[8/9] Starting RVC Studio (Port 3002)..." -ForegroundColor Yellow
Start-Process cmd.exe -ArgumentList "/k", "cd C:\Users\KalleChakradhar\Downloads\project\RVC && .\go-webui.bat"

# 9. Start AI Copilot Backend (Port 8080)
Write-Host "[9/9] Starting AI Copilot Backend (Port 8080)..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd C:\Users\KalleChakradhar\Desktop\portal\ai-service; uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload"

# Get the local IPv4 address (excluding virtual/loopback adapters)
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 -Type Unicast | Where-Object { $_.InterfaceAlias -notmatch 'Loopback|vEthernet|WSL|Tailscale' } | Select-Object -First 1).IPAddress
if (-not $ipAddress) { $ipAddress = "localhost" }

Write-Host "----------------------------------------------" -ForegroundColor Green
Write-Host "All services launched successfully in separate windows!" -ForegroundColor Green
Write-Host "  - Portal Frontend:    https://${ipAddress}:3004" -ForegroundColor Green
Write-Host "  - Portal Backend:     http://${ipAddress}:8005" -ForegroundColor Green
Write-Host "  - NextChat:           http://${ipAddress}:3001" -ForegroundColor Green
Write-Host "  - RVC Studio:         http://${ipAddress}:3002" -ForegroundColor Green
Write-Host "  - Meeting AI:         http://${ipAddress}:3000" -ForegroundColor Green
Write-Host "  - Meeting AI API:     http://${ipAddress}:8081" -ForegroundColor Green
Write-Host "  - AI Copilot API:     http://${ipAddress}:8080" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

Write-Host "Waiting 8 seconds for services to start before opening browser..." -ForegroundColor Cyan
Start-Sleep -Seconds 8
Start-Process "https://${ipAddress}:3004"



