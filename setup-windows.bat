@echo off
REM FinTrack Deployment Script for Windows
REM This script sets up and runs the FinTrack application locally

echo 🚀 Starting FinTrack deployment...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)

REM Set up database
echo 🗄️ Setting up database...
call npm run db:setup
if %errorlevel% neq 0 (
    echo ❌ Failed to setup database
    cd ..
    pause
    exit /b 1
)

REM Build backend
echo 🔨 Building backend...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Failed to build backend
    cd ..
    pause
    exit /b 1
)

REM Go back to root directory
cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)

REM Go back to root directory
cd ..

REM Create logs directory
if not exist logs mkdir logs

echo ✅ FinTrack setup completed!
echo 🌐 Frontend will run on: http://localhost:1452
echo 🔧 Backend will run on: http://localhost:1453
echo.
echo To start the application:
echo 1. Open two terminals/command prompts
echo 2. In first terminal: cd backend && npm run start:prod
echo 3. In second terminal: cd frontend && npm start
echo.
pause