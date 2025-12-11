# ShareThought - Technical Documentation

## Architecture Overview

### High-Level Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────┐
│   React Client  │ ◄─────► │  Express Server  │ ◄─────► │   MongoDB   │
│   (Frontend)    │  HTTP   │    (Backend)     │  CRUD   │  (Database) │
└─────────────────┘         └──────────────────┘         └─────────────┘
         │                            │
         │        WebSocket           │
         └────────────────────────────┘
                Socket.IO
```

## Technology Stack Details

### Frontend Stack
- **React 18.2** - UI library
- **Vite 5.0** - Build tool (faster than Create React App)
- **React Router DOM 6.21** - Client-side routing
- **Socket.IO Client 4.6** - Real-time communication
- **Axios 1.6** - HTTP client
- **CSS3** - Styling with CSS variables for theming

### Backend Stack
- **Node.js** - Runtime environment
- **Express 4.18** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 8.0** - ODM for MongoDB
- **Socket.IO 4.6** - Real-time engine
- **JWT (jsonwebtoken 9.0)** - Authentication
- **bcryptjs 2.4** - Password hashing
- **express-validator 7.0** - Input validation

## Database Schema

### User Model
```javascript
{
  username: String (unique, required, min: 3),
  email: String (unique, required, lowercase),
  password: String (hashed, required, min: 6),
  bio: String (max: 200),
  followers: [ObjectId] (ref: User),
  following: [ObjectId] (ref: User),
  createdAt: Date
}
```

### Post Model
```javascript
{
  author: ObjectId (ref: User, required),
  title: String (required, max: 200),
  content: String (required, max: 5000),
  likes: [ObjectId] (ref: User),
  comments: [{
    user: ObjectId (ref: User),
    text: String (required, max: 500),
    createdAt: Date
  }],
  createdAt: Date
}
```

### Message Model
```javascript
{
  sender: ObjectId (ref: User, required),
  receiver: ObjectId (ref: User, required),
  message: String (required, max: 1000),
  read: Boolean (default: false),
  createdAt: Date
}
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "username": "string (min: 3)",
  "email": "string (valid email)",
  "password": "string (min: 6)"
}
```

**Response:**
```json
{
  "message": "पंजीकरण सफल",
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "username": "string",
    "email": "string"
  }
}
```

#### POST /auth/login
Login existing user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "लॉगिन सफल",
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "username": "string",
    "email": "string"
  }
}
```

#### GET /auth/me
Get current user details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "user_id",
  "username": "string",
  "email": "string",
  "bio": "string",
  "followers": [...],
  "following": [...]
}
```

### User Endpoints

#### GET /users?search=query
Search users.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `search` (optional): Search by username or email

**Response:**
```json
[
  {
    "_id": "user_id",
    "username": "string",
    "email": "string",
    "bio": "string",
    "followers": [...],
    "following": [...]
  }
]
```

#### POST /users/:id/follow
Follow a user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "फॉलो सफल"
}
```

### Post Endpoints

#### POST /posts
Create a new post.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "string (max: 200)",
  "content": "string (max: 5000)"
}
```

**Response:**
```json
{
  "message": "पोस्ट बनाई गई",
  "post": {
    "_id": "post_id",
    "author": {...},
    "title": "string",
    "content": "string",
    "likes": [],
    "comments": [],
    "createdAt": "date"
  }
}
```

#### POST /posts/:id/like
Like/Unlike a post.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "सफल",
  "likes": 5
}
```

#### POST /posts/:id/comment
Add a comment to post.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "text": "string (max: 500)"
}
```

### Message Endpoints

#### GET /messages/conversations
Get all conversations.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "user": {
      "_id": "user_id",
      "username": "string"
    },
    "lastMessage": "string",
    "lastMessageTime": "date",
    "unread": false
  }
]
```

#### GET /messages/:userId
Get messages with a specific user.

**Headers:** `Authorization: Bearer <token>`

**Note:** Only works if users are mutual followers.

**Response:**
```json
[
  {
    "_id": "message_id",
    "sender": {...},
    "receiver": {...},
    "message": "string",
    "read": false,
    "createdAt": "date"
  }
]
```

## Socket.IO Events

### Client to Server

#### sendMessage
Send a message to another user.

**Payload:**
```javascript
{
  receiverId: "user_id",
  message: "string"
}
```

**Restrictions:**
- Only mutual followers can send messages

#### typing
Notify that user is typing.

**Payload:**
```javascript
{
  receiverId: "user_id",
  isTyping: boolean
}
```

### Server to Client

#### receiveMessage
Receive a new message.

**Payload:**
```javascript
{
  _id: "message_id",
  sender: {...},
  receiver: {...},
  message: "string",
  createdAt: "date"
}
```

#### messageSent
Confirmation that message was sent.

#### userOnline
User came online.

**Payload:** `userId`

#### userOffline
User went offline.

**Payload:** `userId`

#### userTyping
User is typing.

**Payload:**
```javascript
{
  userId: "user_id",
  isTyping: boolean
}
```

#### error
Socket error occurred.

**Payload:**
```javascript
{
  message: "error_message"
}
```

## Frontend Architecture

### Context Providers

#### AuthContext
Manages authentication state.

**Provides:**
- `user` - Current user object
- `login(email, password)` - Login function
- `register(username, email, password)` - Register function
- `logout()` - Logout function
- `loading` - Loading state

#### ThemeContext
Manages theme (dark/light mode).

**Provides:**
- `theme` - Current theme ('light' or 'dark')
- `toggleTheme()` - Toggle theme function

### Route Protection

All authenticated routes require login:
- `/dashboard`
- `/profile`
- `/chat`
- `/chat/:userId`
- `/user/:userId`

Unauthenticated users are redirected to `/login`.

## Security Features

### Password Security
- Passwords hashed using bcrypt (10 rounds)
- Never stored or transmitted in plain text

### JWT Authentication
- Tokens expire after 7 days
- Stored in localStorage
- Sent in Authorization header
- Verified on every protected route

### Input Validation
- Server-side validation using express-validator
- Client-side validation in forms
- XSS protection through proper escaping
- SQL injection prevented (NoSQL database)

### Chat Security
- Only mutual followers can message
- Server-side validation of follower status
- Socket authentication using JWT

## Performance Optimizations

### Frontend
- Vite for fast builds and HMR
- CSS variables for theme switching (no re-render)
- Lazy loading components (can be added)
- Debounced search inputs
- Optimistic UI updates

### Backend
- JWT for stateless authentication
- MongoDB indexes on frequently queried fields
- Connection pooling
- Efficient population of references

### Recommended Indexes
```javascript
// User model
username: 1 (unique)
email: 1 (unique)

// Post model
author: 1
createdAt: -1

// Message model
sender: 1, receiver: 1
createdAt: -1
```

## Deployment Guide

### Environment Variables (Production)

**Backend:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/sharethought
JWT_SECRET=<long_random_secure_string>
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

**Frontend:**
```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_SOCKET_URL=https://api.yourdomain.com
```

### Steps for Deployment

1. **MongoDB Atlas Setup:**
   - Create cluster
   - Whitelist IP addresses
   - Create database user
   - Get connection string

2. **Backend Deployment (e.g., Heroku, Railway):**
   ```bash
   cd backend
   npm install
   # Set environment variables in hosting platform
   npm start
   ```

3. **Frontend Deployment (e.g., Vercel, Netlify):**
   ```bash
   cd frontend
   npm install
   npm run build
   # Deploy 'dist' folder
   ```

4. **Enable HTTPS:**
   - Use SSL/TLS certificates
   - Update CORS settings
   - Update Socket.IO configuration

## Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout
- [ ] Access protected routes without auth

**Posts:**
- [ ] Create post
- [ ] View posts feed
- [ ] Like/unlike post
- [ ] Add comment
- [ ] Delete own post
- [ ] View user's posts on profile

**Followers:**
- [ ] Search for users
- [ ] Follow user
- [ ] Unfollow user
- [ ] View followers list
- [ ] View following list

**Chat:**
- [ ] Try to message non-follower (should fail)
- [ ] Follow each other (mutual follow)
- [ ] Send message
- [ ] Receive message in real-time
- [ ] View typing indicator
- [ ] See conversation list
- [ ] View message history

**Theme:**
- [ ] Toggle to dark mode
- [ ] Toggle to light mode
- [ ] Theme persists on refresh

**Responsive:**
- [ ] Test on mobile (320px+)
- [ ] Test on tablet (768px+)
- [ ] Test on desktop (1200px+)

## Common Issues & Solutions

### MongoDB Connection Failed
**Problem:** Cannot connect to MongoDB
**Solution:**
- Check if MongoDB is running (`mongod`)
- Verify MONGODB_URI in .env
- Check network/firewall settings
- For Atlas: Whitelist your IP

### Socket.IO Connection Failed
**Problem:** Real-time chat not working
**Solution:**
- Check if backend server is running
- Verify CORS settings
- Check browser console for errors
- Ensure JWT token is valid

### Port Already in Use
**Problem:** Cannot start server
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

### JWT Token Expired
**Problem:** Logged out unexpectedly
**Solution:**
- Login again
- Increase JWT expiry time
- Implement refresh tokens

## Future Enhancements

### High Priority
1. **Image Upload** - Posts and profile pictures
2. **Notifications** - Real-time notifications for likes, comments, follows
3. **Email Verification** - Email confirmation on registration
4. **Password Reset** - Forgot password functionality

### Medium Priority
5. **Search Improvements** - Advanced search, hashtags
6. **Post Editing** - Edit posts after creation
7. **Message Read Receipts** - Show when message was read
8. **Group Chat** - Create group conversations
9. **Story Feature** - 24-hour stories like Instagram

### Low Priority
10. **Analytics** - User dashboard with stats
11. **Report/Block Users** - Safety features
12. **Export Data** - GDPR compliance
13. **Multi-language** - Full internationalization
14. **Progressive Web App** - Install as native app

## Contributing

### Code Style
- Use meaningful variable names
- Add comments for complex logic
- Follow existing code structure
- Use async/await over promises
- Handle errors properly

### Git Workflow
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Commit with clear messages
5. Create pull request

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

Types: feat, fix, docs, style, refactor, test, chore

---

**Documentation Version:** 1.0.0  
**Last Updated:** December 2025  
**Maintained By:** ShareThought Team
