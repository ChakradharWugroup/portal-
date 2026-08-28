Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "   Smart Enterprise AI Platform Startup" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# 1. Start Python FastAPI AI Service
Write-Host "[1/3] Starting Python FastAPI AI Service (Port 8080)..." -ForegroundColor Yellow
Start-Process cmd.exe -ArgumentList "/k", "cd ai-service && python -m uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload"

# 2. Start NestJS Backend Service
Write-Host "[2/3] Starting NestJS Backend (Port 6432)..." -ForegroundColor Yellow
Start-Process cmd.exe -ArgumentList "/k", "cd backend && npm run start"

# 3. Start Vite React Frontend
Write-Host "[3/3] Starting React Frontend (Port 3004)..." -ForegroundColor Yellow
Start-Process cmd.exe -ArgumentList "/k", "cd frontend && npm run dev"

Write-Host "----------------------------------------------" -ForegroundColor Green
Write-Host "Services launched successfully in separate windows!" -ForegroundColor Green
Write-Host "  - Frontend: http://localhost:3004" -ForegroundColor Green
Write-Host "  - Backend:  http://localhost:6432" -ForegroundColor Green
Write-Host "  - AI API:   http://localhost:8080" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

# Open browser to portal
Start-Sleep -Seconds 5
Start-Process "http://localhost:3004"


