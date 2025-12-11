# ShareThought - Social Media Platform

A fully featured social media application where users can register, login, share stories, and chat in real-time with followers.

## 🛠️ Tech Stack

### Frontend
- **Vite + React** - Fast and modern development
- **React Router** - Navigation
- **Socket.IO Client** - Real-time messaging
- **Axios** - API calls
- **CSS3** - Responsive styling with Dark/Light mode

### Backend
- **Node.js + Express.js** - Server framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## ✨ Key Features

### 1. User Authentication
- ✅ Secure registration and login
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Persistent sessions

### 2. Posts & Content
- ✅ Create text-based stories/posts
- ✅ Like posts
- ✅ Comment on posts
- ✅ Delete your own posts
- ✅ View user feed

### 3. Follower System
- ✅ Follow/unfollow any user
- ✅ View followers and following lists
- ✅ User search functionality
- ✅ User profile pages

### 4. Live Messaging
- ✅ **Only mutual followers can message** (secure chat)
- ✅ Real-time messaging with Socket.IO
- ✅ Typing indicators
- ✅ Online/Offline status
- ✅ Message history
- ✅ Conversation list

### 5. User Experience
- ✅ **Dark and Light Mode** toggle
- ✅ **Fully Responsive** (Mobile, Tablet, Desktop)
- ✅ Smooth animations
- ✅ Modern UI/UX design
- ✅ English interface

## 📁 Project Structure

```
sharethought/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── posts.js
│   │   └── messages.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── PostCard.jsx
    │   │   ├── CreatePost.jsx
    │   │   └── UserSearch.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Profile.jsx
    │   │   ├── UserProfile.jsx
    │   │   └── Chat.jsx
    │   ├── services/
    │   │   └── socket.js
    │   ├── styles/
    │   │   ├── Auth.css
    │   │   ├── Dashboard.css
    │   │   ├── Post.css
    │   │   ├── Profile.css
    │   │   ├── Chat.css
    │   │   ├── Navbar.css
    │   │   └── UserSearch.css
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone Project
```bash
cd sharethought
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sharethought
JWT_SECRET=your_secret_key_change_this_in_production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas:**
- Go to MongoDB Atlas and create a cluster
- Add connection string to `.env`

### 5. Start Application

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

Application will open at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🎯 Usage Guide

### 1. Registration
- Go to Register page
- Enter Username, Email, Password
- Click Register

### 2. Creating Posts
- Go to Dashboard
- Write Title and Content in "Create New Post"
- Click Post button

### 3. Following Users
- Search for users in search box
- Go to user profile
- Click "Follow" button

### 4. Chatting
- Follow a user and they must follow you back
- Click "Message" button
- Chat in real-time

### 5. Change Theme
- Click 🌙/☀️ icon in Navbar
- Dark/Light mode will toggle

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user details
- `PUT /api/auth/profile` - Update profile

### Users
- `GET /api/users` - All users (with search)
- `GET /api/users/:id` - User details
- `POST /api/users/:id/follow` - Follow user
- `POST /api/users/:id/unfollow` - Unfollow user

### Posts
- `POST /api/posts` - Create new post
- `GET /api/posts` - All posts
- `GET /api/posts/user/:userId` - User's posts
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Comment on post
- `DELETE /api/posts/:id` - Delete post

### Messages
- `GET /api/messages/conversations` - All conversations
- `GET /api/messages/:userId` - Messages with user

### Socket.IO Events
- `sendMessage` - Send message
- `receiveMessage` - Receive message
- `typing` - Typing indicator
- `userOnline` - User came online
- `userOffline` - User went offline

## 📱 Responsive Design

Application works on all screen sizes:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🎨 Theme System

### Light Mode
- White background
- Dark text
- Blue accent color

### Dark Mode
- Black background
- Light text
- Light blue accent color

Theme preference is saved in localStorage.

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT authentication
- ✅ Protected routes
- ✅ Input validation
- ✅ CORS enabled
- ✅ Follower-restricted messaging

## 🐛 Known Issues & Future Improvements

### Future Enhancements:
- 📸 Image upload support
- 🔔 Notification system
- 📊 Analytics dashboard
- 🔍 Advanced search filters
- 💾 Message persistence improvements
- 🌍 Multi-language support

## 📝 License

MIT License

## 👨‍💻 Developer Notes

### For Better Performance:
- Add MongoDB indexes
- Implement Redis caching
- Use CDN for static assets
- Image optimization
- Lazy loading

### Production Deployment:
1. Set environment variables properly
2. Enable HTTPS
3. Add rate limiting
4. Use MongoDB Atlas
5. Build and deploy frontend

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Submit pull request

## 📧 Support

For any issues, please report in GitHub issues.

---

**Made with ❤️ using React, Node.js, MongoDB, and Socket.IO**
