@echo off
echo ========================================
echo Starting PathwiseAI Project
echo ========================================

echo.
echo [1/6] Checking backend dependencies...
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install --prefer-offline --no-audit --no-fund
    if %errorlevel% neq 0 (
        echo Error installing backend dependencies!
        pause
        exit /b 1
    )
) else (
    echo Backend dependencies already installed, skipping...
)

echo.
echo [2/6] Checking frontend dependencies...
cd frontend
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install --prefer-offline --no-audit --no-fund
    if %errorlevel% neq 0 (
        echo Error installing frontend dependencies!
        pause
        exit /b 1
    )
) else (
    echo Frontend dependencies already installed, skipping...
)
cd ..

echo.
echo [3/6] Checking frontend build...
if not exist "frontend\dist\index.html" (
    echo Building frontend...
    cd frontend
    call npm run build
    if %errorlevel% neq 0 (
        echo Error building frontend!
        pause
        exit /b 1
    )
    cd ..
) else (
    echo Frontend build already exists, skipping...
)

echo.
echo [4/6] Checking backend build...
if not exist "dist\main.js" (
    echo Building backend...
    call npm run build
    if %errorlevel% neq 0 (
        echo Error building backend!
        pause
        exit /b 1
    )
) else (
    echo Backend build already exists, skipping...
)

echo.
echo [5/6] Starting production server...
echo Project will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

echo [6/6] Opening browser...
timeout /t 3 /nobreak >nul
start http://localhost:3000

call npm run start:prod

pause