$ErrorActionPreference = "Stop"

$portalDir = "C:\Users\KalleChakradhar\Desktop\portal"
$pythonExe = "$portalDir\venv_django\Scripts\python.exe"

cd $portalDir\django_backend

Write-Host "Running makemigrations..."
& $pythonExe manage.py makemigrations core_api
& $pythonExe manage.py makemigrations ai_api

Write-Host "Running migrate..."
& $pythonExe manage.py migrate

Write-Host "Database migration complete."
