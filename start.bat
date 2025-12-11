@echo off
echo ========================================
echo ShareThought - Starting Application
echo ========================================
echo.

echo Starting Backend Server...
start cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Application is starting!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Two terminal windows will open.
echo Don't close them while using the app.
echo.
echo Press Ctrl+C in each terminal to stop.
echo ========================================
