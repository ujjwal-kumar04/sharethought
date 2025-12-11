# ShareThought - Quick Start Guide

## Quick Start

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### 2. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB
mongod
```

**Option B: MongoDB Atlas**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Copy connection string
4. Paste in Backend `.env`

### 3. Environment Variables

**Backend (create .env file):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sharethought
JWT_SECRET=my_super_secret_jwt_key_12345
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend (create .env file - optional):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Run Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Open in Browser

http://localhost:5173

## First Use

1. Click **Register**
2. Fill Username, Email, Password
3. Register - you'll be automatically logged in
4. Create posts on Dashboard
5. Create second account for testing
6. Follow each other and chat

## Troubleshooting

### MongoDB connection error
```bash
# Start MongoDB service
# Windows:
net start MongoDB

# Mac:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

### Port already in use
```bash
# Change Backend port (in .env)
PORT=5001

# Or kill running process:
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill
```

### npm install errors
```bash
# Delete node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development Commands

### Backend
```bash
npm start          # Production mode
npm run dev        # Development mode (nodemon)
```

### Frontend
```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

## Create Test Users

In two different browser/incognito windows:

**User 1:**
- Username: raj
- Email: raj@test.com
- Password: 123456

**User 2:**
- Username: priya
- Email: priya@test.com
- Password: 123456

Now follow each other and test chat!

## Main URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Socket.IO: ws://localhost:5000

---

**If you have any issues, check README.md or create an issue on GitHub**
