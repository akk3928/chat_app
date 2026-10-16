const router = require('express').Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Message = require('../models/Message');

// All other users (for the sidebar)
router.get('/users', auth, async (req, res) => {
  const users = await User.find({ _id: { $ne: req.userId } }).select('username email').sort('username');
  res.json(users);
});

// Conversation history with one user
router.get('/messages/:userId', auth, async (req, res) => {
  const other = req.params.userId;
  if (!mongoose.isValidObjectId(other)) return res.status(400).json({ message: 'Invalid user id' });
  const messages = await Message.find({
    $or: [
      { sender: req.userId, receiver: other },
      { sender: other, receiver: req.userId },
    ],
  })
    .sort('createdAt')
    .limit(200);
  res.json(messages);
});

module.exports = router;
