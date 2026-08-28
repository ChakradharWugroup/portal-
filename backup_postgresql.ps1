# ==============================================================================
# Enterprise PostgreSQL Automated Backup Script (NAS G:\KALLE)
# ==============================================================================
# Description: Automates pg_dump backups, performs SHA256 checksum validation,
#              transfers files to G:\KALLE shared network storage, and applies
#              corporate retention policies (Daily, Weekly, Monthly, Yearly).
# ==============================================================================

# --- Configuration ---
$DbName = "cotton_republic"
$DbUser = "postgres"
$NasRoot = "G:\KALLE\PostgreSQL_Backup"
$TempDir = "C:\Temp"
$Password = "Chakri1439@"  # Replace with actual postgres password if different

# --- Checksum and Path Details ---
$Date = Get-Date
$DateStr = $Date.ToString("yyyy_MM_dd_HHmmss")
$WeekNum = Get-Date -UFormat %V
$MonthName = $Date.ToString("MMMM")
$YearStr = $Date.ToString("yyyy")

# Log Settings
$LogDir = Join-Path $NasRoot "Logs"
$LogFile = Join-Path $LogDir "backup.log"

# --- Function: Write Log ---
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $Timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $LogMsg = "[$Timestamp] [$Level] $Message"
    Write-Output $LogMsg
    if (Test-Path $LogDir) {
        $LogMsg | Out-File -FilePath $LogFile -Append -Encoding utf8
    }
}

# --- Initialization ---
# Ensure Temp directory exists
if (-not (Test-Path $TempDir)) {
    New-Item -Path $TempDir -ItemType Directory -Force | Out-Null
}

Write-Log "Initializing automated backup workflow..."

# Check NAS Connectivity
if (-not (Test-Path $NasRoot)) {
    try {
        New-Item -Path $NasRoot -ItemType Directory -Force | Out-Null
        Write-Log "Successfully verified and created NAS root directories."
    } catch {
        Write-Log "CRITICAL: NAS Shared folder G:\KALLE\PostgreSQL_Backup is offline or unreachable." "ERROR"
        Exit 1
    }
}

# Ensure standard directory structures exist on NAS
$Subdirs = @("Daily", "Weekly", "Monthly", "Yearly", "Logs")
foreach ($dir in $Subdirs) {
    $FullPath = Join-Path $NasRoot $dir
    if (-not (Test-Path $FullPath)) {
        New-Item -Path $FullPath -ItemType Directory -Force | Out-Null
    }
}

# --- Determine Backup Categories (Daily, Weekly, Monthly, Yearly) ---
$BackupTypes = [System.Collections.Generic.List[string]]::new()
$BackupTypes.Add("Daily")

# Weekly backup (Run on Sundays)
if ($Date.DayOfWeek -eq 'Sunday') {
    $BackupTypes.Add("Weekly")
}

# Monthly backup (Run on the 1st of the month)
if ($Date.Day -eq 1) {
    $BackupTypes.Add("Monthly")
}

# Yearly backup (Run on Jan 1st)
if ($Date.Month -eq 1 -and $Date.Day -eq 1) {
    $BackupTypes.Add("Yearly")
}

# --- Execute pg_dump ---
Write-Log "Starting pg_dump execution for database '$DbName'..."
$env:PGPASSWORD = $Password
$LocalBackupFile = Join-Path $TempDir "db_${DateStr}.backup"

try {
    # Execute pg_dump in compressed custom archive format
    & "C:\Program Files\PostgreSQL\16\bin\pg_dump.exe" -U $DbUser -F c -d $DbName -f $LocalBackupFile *>&1 | Out-String -OutVariable DumpOut
    if ($LASTEXITCODE -ne 0) {
        throw "pg_dump failed with exit code $LASTEXITCODE. Output: $DumpOut"
    }
    Write-Log "pg_dump completed successfully. Local file: $LocalBackupFile"
} catch {
    Write-Log "CRITICAL: PostgreSQL pg_dump failed. Error details: $_" "ERROR"
    Exit 1
}

# --- Verify Local Backup File ---
if ((Get-Item $LocalBackupFile).Length -eq 0) {
    Write-Log "CRITICAL: Backup file is empty (0 bytes)." "ERROR"
    Remove-Item $LocalBackupFile -Force
    Exit 1
}

# Generate SHA256 Checksum for validation
Write-Log "Generating SHA256 checksum for local file..."
$LocalHash = (Get-FileHash -Path $LocalBackupFile -Algorithm SHA256).Hash
Write-Log "Local File SHA256: $LocalHash"

# --- Copy and Verify in Target Folders ---
foreach ($Type in $BackupTypes) {
    $FileName = ""
    switch ($Type) {
        "Daily"   { $FileName = "db_${DateStr}.backup" }
        "Weekly"  { $FileName = "db_${YearStr}_Week${WeekNum}.backup" }
        "Monthly" { $FileName = "db_${YearStr}_${MonthName}.backup" }
        "Yearly"  { $FileName = "db_${YearStr}.backup" }
    }
    
    $DestPath = Join-Path (Join-Path $NasRoot $Type) $FileName
    Write-Log "Transferring backup to NAS Category: $Type -> $DestPath"
    
    try {
        Copy-Item -Path $LocalBackupFile -Destination $DestPath -Force
        
        # Verify Copy and Checksum matching
        if (Test-Path $DestPath) {
            $DestHash = (Get-FileHash -Path $DestPath -Algorithm SHA256).Hash
            if ($LocalHash -eq $DestHash) {
                Write-Log "Verification Success: Checksum matches for $Type backup."
            } else {
                throw "Checksum mismatch for $Type backup! File may be corrupted."
            }
        } else {
            throw "Destination file does not exist after copying."
        }
    } catch {
        Write-Log "ERROR: Transfer failed for $Type backup. Details: $_" "ERROR"
    }
}

# --- Cleanup Temporary Local File ---
Write-Log "Cleaning up local temporary backup copy..."
Remove-Item -Path $LocalBackupFile -Force
Write-Log "Local temporary files cleared successfully."

# --- Apply Retention Policies ---
Write-Log "Applying retention policy checks on NAS storage..."

# 1. Daily Backups (Keep 7 days)
$DailyLimit = (Get-Date).AddDays(-7)
Get-ChildItem -Path (Join-Path $NasRoot "Daily") -Filter *.backup | Where-Object { $_.LastWriteTime -lt $DailyLimit } | ForEach-Object {
    Write-Log "Retention: Deleting old Daily backup: $($_.Name)"
    Remove-Item $_.FullName -Force
}

# 2. Weekly Backups (Keep 8 weeks / 56 days)
$WeeklyLimit = (Get-Date).AddDays(-56)
Get-ChildItem -Path (Join-Path $NasRoot "Weekly") -Filter *.backup | Where-Object { $_.LastWriteTime -lt $WeeklyLimit } | ForEach-Object {
    Write-Log "Retention: Deleting old Weekly backup: $($_.Name)"
    Remove-Item $_.FullName -Force
}

# 3. Monthly Backups (Keep 12 months / 365 days)
$MonthlyLimit = (Get-Date).AddDays(-365)
Get-ChildItem -Path (Join-Path $NasRoot "Monthly") -Filter *.backup | Where-Object { $_.LastWriteTime -lt $MonthlyLimit } | ForEach-Object {
    Write-Log "Retention: Deleting old Monthly backup: $($_.Name)"
    Remove-Item $_.FullName -Force
}

# 4. Yearly Backups (Keep 5 years / 1825 days)
$YearlyLimit = (Get-Date).AddDays(-1825)
Get-ChildItem -Path (Join-Path $NasRoot "Yearly") -Filter *.backup | Where-Object { $_.LastWriteTime -lt $YearlyLimit } | ForEach-Object {
    Write-Log "Retention: Deleting old Yearly backup: $($_.Name)"
    Remove-Item $_.FullName -Force
}

Write-Log "Backup workflow completed successfully."
# ==============================================================================
