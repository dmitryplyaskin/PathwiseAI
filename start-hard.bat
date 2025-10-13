@echo off
echo ========================================
echo PathwiseAI Project - HARD START
echo ========================================

echo.
echo [0/7] Checking package manager...
where yarn >nul 2>&1
if %errorlevel% equ 0 (
    set PACKAGE_MANAGER=yarn
    echo Using yarn as package manager
) else (
    echo ERROR: yarn is required for hard start!
    echo Please install yarn first: npm install -g yarn
    pause
    exit /b 1
)

echo.
echo [1/7] Installing backend dependencies (FORCE)...
echo Installing backend dependencies with yarn...
call yarn install --no-cache --force
if %errorlevel% neq 0 (
    echo Error installing backend dependencies!
    pause
    exit /b 1
)

echo.
echo [2/7] Installing frontend dependencies (FORCE)...
cd frontend
echo Installing frontend dependencies with yarn...
call yarn install --no-cache --force
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies!
    pause
    exit /b 1
)
cd ..

echo.
echo [3/7] Building frontend (FORCE)...
echo Building frontend with yarn...
cd frontend
call yarn build
if %errorlevel% neq 0 (
    echo Error building frontend!
    pause
    exit /b 1
)
cd ..

echo.
echo [4/7] Building backend (FORCE)...
echo Building backend with yarn...
call yarn build
if %errorlevel% neq 0 (
    echo Error building backend!
    pause
    exit /b 1
)

echo.
echo [5/7] Starting production server...
echo Project will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

echo [6/7] Opening browser...
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo [7/7] Starting server with yarn...
call yarn start:prod

pause
