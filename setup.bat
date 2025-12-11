@echo off
echo ========================================
echo ShareThought - Setup and Installation
echo ========================================
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit backend\.env file and update:
    echo - MONGODB_URI with your MongoDB connection string
    echo - JWT_SECRET with a secure random string
    echo.
    pause
)
call npm install
echo Backend dependencies installed!
echo.

echo [2/4] Installing Frontend Dependencies...
cd ..\frontend
if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env
)
call npm install
echo Frontend dependencies installed!
echo.

cd ..

echo [3/4] Checking MongoDB...
echo Please make sure MongoDB is running!
echo.
echo For local MongoDB: Run 'mongod' in another terminal
echo For MongoDB Atlas: Update MONGODB_URI in backend\.env
echo.
pause

echo [4/4] Setup Complete!
echo.
echo ========================================
echo To start the application:
echo ========================================
echo.
echo 1. Open two terminals
echo.
echo Terminal 1 (Backend):
echo    cd backend
echo    npm run dev
echo.
echo Terminal 2 (Frontend):
echo    cd frontend
echo    npm run dev
echo.
echo Then open http://localhost:5173 in your browser
echo.
echo ========================================
echo Or use start.bat to run both together!
echo ========================================
pause
