@echo off
cd /d "%~dp0"
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
if not exist "server\node_modules" (
    echo Installing backend dependencies with %PACKAGE_MANAGER%...
    if "%PACKAGE_MANAGER%"=="yarn" (
        call yarn --cwd server install --prefer-offline --silent
    ) else (
        call npm --prefix server install --prefer-offline --no-audit --no-fund --package-lock=false
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
echo [2/7] Checking web dependencies...
if not exist "web\node_modules" (
    echo Installing web dependencies with %PACKAGE_MANAGER%...
    if "%PACKAGE_MANAGER%"=="yarn" (
        call yarn --cwd web install --prefer-offline --silent
    ) else (
        call npm --prefix web install --prefer-offline --no-audit --no-fund --package-lock=false
    )
    if %errorlevel% neq 0 (
        echo Error installing web dependencies!
        pause
        exit /b 1
    )
) else (
    echo Frontend dependencies already installed, skipping...
)

echo.
echo [3/7] Checking web build...
if not exist "web\dist\index.html" (
    echo Building web with %PACKAGE_MANAGER%...
    if "%PACKAGE_MANAGER%"=="yarn" (
        call yarn --cwd web build
    ) else (
        call npm --prefix web run build
    )
    if %errorlevel% neq 0 (
        echo Error building web!
        pause
        exit /b 1
    )
) else (
    echo Frontend build already exists, skipping...
)

echo.
echo [4/7] Checking backend build...
if not exist "server\dist\main.js" (
    echo Building backend with %PACKAGE_MANAGER%...
    if "%PACKAGE_MANAGER%"=="yarn" (
        call yarn --cwd server build
    ) else (
        call npm --prefix server run build
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
