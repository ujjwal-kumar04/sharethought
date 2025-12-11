import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

const router = express.Router();

// Get conversations list
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.userId }, { receiver: req.userId }]
    })
      .populate('sender', 'username')
      .populate('receiver', 'username')
      .sort({ createdAt: -1 });

    // Get unique conversations
    const conversationsMap = new Map();
    
    messages.forEach(msg => {
      const otherUserId = msg.sender._id.toString() === req.userId 
        ? msg.receiver._id.toString() 
        : msg.sender._id.toString();
      
      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          user: msg.sender._id.toString() === req.userId ? msg.receiver : msg.sender,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          unread: !msg.read && msg.receiver._id.toString() === req.userId
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());
    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get messages with a specific user
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    // Check if users are followers of each other
    const currentUser = await User.findById(req.userId);
    const otherUser = await User.findById(otherUserId);

    if (!otherUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const areFollowers = currentUser.following.includes(otherUserId) && 
                        otherUser.following.includes(req.userId);

    if (!areFollowers) {
      return res.status(403).json({ 
        error: 'Only mutual followers can message' 
      });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: otherUserId },
        { sender: otherUserId, receiver: req.userId }
      ]
    })
      .populate('sender', 'username')
      .populate('receiver', 'username')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { sender: otherUserId, receiver: req.userId, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
