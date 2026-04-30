@echo off
echo === Setting up Todo App ===

echo.
echo [1/4] Installing Python dependencies...
cd backend
pip install -r requirements.txt

echo.
echo [2/4] Running Django migrations...
python manage.py migrate

echo.
echo [3/4] Creating superuser (optional - press Ctrl+C to skip)...
python manage.py createsuperuser

echo.
echo [4/4] Installing React dependencies...
cd ..\frontend
npm install

echo.
echo === Setup complete! ===
echo.
echo To start the backend:  cd backend  ^&^&  python manage.py runserver
echo To start the frontend: cd frontend ^&^&  npm start
echo.
pause
