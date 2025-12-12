import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.js';
import messageRoutes from './routes/messages.js';
import notificationRoutes from './routes/notifications.js';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';

import Message from './models/Message.js';
import Notification from './models/Notification.js';
import User from './models/User.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL ,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Socket.IO Authentication Middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
});

// Online users tracking
const onlineUsers = new Map();

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.userId}`);
  
  // Add user to online users
  onlineUsers.set(socket.userId, socket.id);
  
  // Broadcast online status
  io.emit('userOnline', socket.userId);

  // Join personal room
  socket.join(socket.userId);

  // Handle sending messages
  socket.on('sendMessage', async (data) => {
    try {
      const { receiverId, message } = data;
      console.log(`📨 Message from ${socket.userId} to ${receiverId}: ${message}`);

      // Check if users are mutual followers
      const sender = await User.findById(socket.userId);
      const receiver = await User.findById(receiverId);

      if (!sender || !receiver) {
        socket.emit('error', { message: 'User not found' });
        return;
      }

      const areMutualFollowers = 
        sender.following.some(id => id.toString() === receiverId.toString()) && 
        receiver.following.some(id => id.toString() === socket.userId.toString());

      console.log(`🔍 Mutual followers check: ${areMutualFollowers}`);

      if (!areMutualFollowers) {
        socket.emit('error', { 
          message: 'Only mutual followers can message' 
        });
        console.log('❌ Not mutual followers');
        return;
      }

      // Save message to database
      const newMessage = new Message({
        sender: socket.userId,
        receiver: receiverId,
        message
      });

      await newMessage.save();
      
      // Populate sender and receiver details
      await newMessage.populate([
        { path: 'sender', select: 'username' },
        { path: 'receiver', select: 'username' }
      ]);

      // Create notification
      await Notification.create({
        recipient: receiverId,
        sender: socket.userId,
        type: 'message',
        message: `${sender.username} sent you a message`
      });

      // Send to receiver if online
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', newMessage);
        io.to(receiverSocketId).emit('newNotification');
      }

      // Send confirmation to sender
      socket.emit('messageSent', newMessage);
      console.log(`✅ Message saved and sent successfully`);

    } catch (error) {
      console.error('❌ Send message error:', error);
      socket.emit('error', { message: 'Error sending message' });
    }
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    const receiverSocketId = onlineUsers.get(data.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('userTyping', {
        userId: socket.userId,
        isTyping: data.isTyping
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.userId}`);
    onlineUsers.delete(socket.userId);
    io.emit('userOffline', socket.userId);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
