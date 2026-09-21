@echo off

echo Starting Student Career AI...

start "Backend" cmd /k "cd /d C:\Users\Ravikrishna\OneDrive\Desktop\StudentCareerAI\backend && venv\Scripts\activate && python run.py"

timeout /t 3 /nobreak >nul

start "Frontend" cmd /k "cd /d C:\Users\Ravikrishna\OneDrive\Desktop\StudentCareerAI\frontend && npm run dev"

timeout /t 5 /nobreak >nul

start http://localhost:5173/

echo.
echo Student Career AI is starting...
echo Open: http://localhost:5173/
pause