@echo off
title Smart Enterprise AI Platform Startup
echo ==============================================
echo    Smart Enterprise AI Platform Startup
echo ==============================================

echo [1/3] Starting Unified Django Backend (Port 8000)...
start cmd /k "cd django_backend && ..\venv_django\Scripts\python.exe manage.py runserver 0.0.0.0:8000"

:: 3. Start Vite React Frontend
echo [3/3] Starting React Frontend (Port 3004)...
start cmd /k "cd frontend && npm run dev"

echo ----------------------------------------------
echo Services launched successfully in separate windows!
echo   - Frontend: http://localhost:3004
echo   - Django API: http://localhost:8000
echo   
echo ==============================================

:: Wait 5 seconds before opening browser
timeout /t 5 /nobreak > nul
start http://localhost:3004

