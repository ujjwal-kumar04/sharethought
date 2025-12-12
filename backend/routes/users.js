import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

const router = express.Router();

// Get all users (search)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search } = req.query;
    let query = { _id: { $ne: req.userId } };
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('username email bio followers following')
      .limit(20)
      .lean();

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'username')
      .populate('following', 'username');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Follow user
router.post('/:id/follow', authMiddleware, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.userId;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentUser = await User.findById(currentUserId);

    // Check if already following
    if (currentUser.following.includes(targetUserId)) {
      return res.status(400).json({ error: 'Already following' });
    }

    // Add to following and followers
    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    // Create notification
    await Notification.create({
      recipient: targetUserId,
      sender: currentUserId,
      type: 'follow',
      message: `${currentUser.username} started following you`
    });

    res.json({ message: 'Follow successful' });
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Unfollow user
router.post('/:id/unfollow', authMiddleware, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.userId;

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentUser = await User.findById(currentUserId);

    // Remove from following and followers
    currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);

    await currentUser.save();
    await targetUser.save();

    res.json({ message: 'Unfollow successful' });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
