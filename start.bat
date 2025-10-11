@echo off
echo ========================================
echo Starting PathwiseAI Project
echo ========================================

echo.
echo [0/7] Checking package manager...
where yarn >nul 2>&1
if %errorlevel% equ 0 (
    set PACKAGE_MANAGER=yarn
    echo Using yarn as package manager
) else (
    set PACKAGE_MANAGER=npm
    echo Using npm as package manager (yarn not found)
)

echo.
echo [1/7] Checking backend dependencies...
if not exist "node_modules" (
    echo Installing backend dependencies with %PACKAGE_MANAGER%...
    if "%PACKAGE_MANAGER%"=="yarn" (
        call yarn install --prefer-offline --silent
    ) else (
        call npm install --prefer-offline --no-audit --no-fund
    )
    if %errorlevel% neq 0 (
        echo Error installing backend dependencies!
        pause
        exit /b 1
    )
) else (
    echo Backend dependencies already installed, skipping...
)

echo.
echo [2/7] Checking frontend dependencies...
cd frontend
if not exist "node_modules" (
    echo Installing frontend dependencies with %PACKAGE_MANAGER%...
    if "%PACKAGE_MANAGER%"=="yarn" (
        call yarn install --prefer-offline --silent
    ) else (
        call npm install --prefer-offline --no-audit --no-fund
    )
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
echo [3/7] Checking frontend build...
if not exist "frontend\dist\index.html" (
    echo Building frontend with %PACKAGE_MANAGER%...
    cd frontend
    if "%PACKAGE_MANAGER%"=="yarn" (
        call yarn build
    ) else (
        call npm run build
    )
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
echo [4/7] Checking backend build...
if not exist "dist\main.js" (
    echo Building backend with %PACKAGE_MANAGER%...
    if "%PACKAGE_MANAGER%"=="yarn" (
        call yarn build
    ) else (
        call npm run build
    )
    if %errorlevel% neq 0 (
        echo Error building backend!
        pause
        exit /b 1
    )
) else (
    echo Backend build already exists, skipping...
)

echo.
echo [5/7] Starting production server...
echo Project will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

echo [6/7] Opening browser...
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo [7/7] Starting server with %PACKAGE_MANAGER%...
if "%PACKAGE_MANAGER%"=="yarn" (
    call yarn start:prod
) else (
    call npm run start:prod
)

pause