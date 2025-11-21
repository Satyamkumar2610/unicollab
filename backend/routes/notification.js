const express = require('express');
const Notification = require('../models/notification');
const auth = require('../middleware/auth');
const { buildListResponse } = require('../utils/listResponse');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, read } = req.query;
    let query = { recipient: req.user.userId };

    if (read !== undefined) {
      query.read = read === 'true';
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'name avatar')
      .populate('relatedProject', 'title')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);
    res.json(buildListResponse(notifications, total, page, limit));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ recipient: req.user.userId, read: false });
    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    ).populate('sender', 'name avatar');

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user.userId, read: false }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
