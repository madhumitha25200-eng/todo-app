# Todo App — Django + React

## Features
- JWT Authentication (register/login)
- Task CRUD with priority levels
- Due date picker with visual indicators (overdue/today/soon)
- Per-task timer (start/stop, persisted to DB)
- Live clock & date display
- Daily rotating motivational quotes

## Project Structure
```
todo_project/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── todoproject/        # Django settings, urls, wsgi
│   └── tasks/              # Models, views, serializers, urls
└── frontend/
    ├── package.json
    └── src/
        ├── api.js           # Axios + JWT refresh interceptor
        ├── App.jsx          # Routes
        ├── pages/           # Login, Register, Dashboard
        └── components/      # TaskForm, TaskCard, Clock, Quote
```

## Quick Start

### Option A — Run setup.bat
Double-click `setup.bat` in the `todo_project` folder.

### Option B — Manual

**Backend**
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend** (new terminal)
```bash
cd frontend
npm install
npm start
```

App runs at http://localhost:3000  
API runs at http://localhost:8000/api/

## API Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/register/ | Register |
| POST | /api/login/ | Login (returns JWT) |
| POST | /api/token/refresh/ | Refresh access token |
| GET/POST | /api/tasks/ | List / Create tasks |
| GET/PATCH/DELETE | /api/tasks/:id/ | Task detail |
| POST | /api/tasks/:id/start/ | Start timer |
| POST | /api/tasks/:id/stop/ | Stop timer |
