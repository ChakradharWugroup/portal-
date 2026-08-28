# Smart Enterprise AI Platform (Portal)

## Overview
This is a unified Enterprise Portal that integrates multiple AI applications, ERP data management, and operational tools into a single cohesive React dashboard. 

The platform connects to a Django REST Framework backend for data processing and a custom FastAPI Gateway to intelligently route AI chat traffic to Google Gemini (3.5 Flash Lite) models.

## Architecture

### 1. Frontend (React + Vite)
- Located in `frontend/`
- Serves as the primary employee dashboard.
- Uses Microsoft MSAL for SSO Authentication.
- **Embedded Modules:**
  - **NextChat (Dify)**: Embedded iframe routing to an AI Gateway that validates the logged-in Microsoft user against the employee directory.
  - **Meeting AI**: Audio transcription and summarization platform.
  - **RVC Voice AI Studio**: Retrieval-based Voice Conversion interface.
  - **TiDB QR Management**: Secure frontend connecting to TiDB Cloud Garment QR tracking.
  - **ERP Integration & Real Data**: Live internal databases and PostgreSQL rows.

### 2. Backend (Django REST Framework)
- Located in `django_backend/`
- Runs on Port `8005`.
- Exposes internal APIs for:
  - `api/qr/collections` & `api/qr/garment-codes` (TiDB Cloud integration).
  - Employee list and directory validation.
  - Live mock / production ERP data.

### 3. AI Gateway (FastAPI)
- Acts as a middleman for NextChat to intercept API keys, securely append master Gemini credentials, and route completions to the `gemini-3.5-flash-lite` model.

## Quick Start

The entire stack is configured to run automatically using a single PowerShell script.

1. Ensure Python 3.12+ and Node.js are installed.
2. Run the start script:
   ```powershell
   .\start_all.ps1
   ```
3. The script will automatically launch:
   - Django Backend (Port 8005)
   - Meeting AI (Port 3000 / API 6432)
   - NextChat (Port 3001)
   - RVC Voice AI (Port 3002)
   - Portal Frontend (Port 3004)
4. The main portal will open at `https://localhost:3004`.

## Security Notes
- Mixed Content (HTTP in HTTPS): Several legacy AI web interfaces (RVC, NextChat) run locally on HTTP. The browser may require enabling "insecure content" for the dashboard to render them correctly in iframes.
- Credentials: API Keys, TiDB credentials, and MSAL Client Secrets should be strictly stored in `.env` and are safely ignored from version control.
