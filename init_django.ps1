$ErrorActionPreference = "Stop"

$portalDir = "C:\Users\KalleChakradhar\Desktop\portal"
cd $portalDir

Write-Host "Creating Virtual Environment..."
python -m venv venv_django
$pythonExe = "$portalDir\venv_django\Scripts\python.exe"
$pipExe = "$portalDir\venv_django\Scripts\pip.exe"

Write-Host "Installing dependencies..."
& $pipExe install django djangorestframework django-cors-headers httpx

Write-Host "Creating Django project..."
# Remove if exists for clean state
if (Test-Path "django_backend") {
    Remove-Item "django_backend" -Recurse -Force
}

& $pythonExe -m django startproject enterprise_backend django_backend
cd django_backend

Write-Host "Creating Django apps..."
& $pythonExe manage.py startapp core_api
& $pythonExe manage.py startapp ai_api

Write-Host "Django scaffold complete."
