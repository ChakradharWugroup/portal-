import os

settings_path = "C:/Users/KalleChakradhar/Desktop/portal/django_backend/enterprise_backend/settings.py"

with open(settings_path, 'r', encoding='utf-8') as f:
    settings_content = f.read()

# Add installed apps
apps_to_add = """
    'corsheaders',
    'rest_framework',
    'core_api',
    'ai_api',
"""
settings_content = settings_content.replace(
    "'django.contrib.staticfiles',", 
    "'django.contrib.staticfiles',\n" + apps_to_add
)

# Add middleware
middleware_to_add = """
    'corsheaders.middleware.CorsMiddleware',
"""
settings_content = settings_content.replace(
    "'django.middleware.security.SecurityMiddleware',", 
    "'django.middleware.security.SecurityMiddleware',\n" + middleware_to_add
)

# Configure CORS and DRF
settings_content += """

# Custom Settings
CORS_ALLOW_ALL_ORIGINS = True

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ]
}

import os
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', 'YOUR_GEMINI_API_KEY_HERE')
"""

with open(settings_path, 'w', encoding='utf-8') as f:
    f.write(settings_content)

print("settings.py configured successfully.")
