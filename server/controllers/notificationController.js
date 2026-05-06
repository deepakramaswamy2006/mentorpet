const Notification = require('../models/Notification');
const Task = require('../models/Task');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    // 1. Auto-generate deadline notifications for upcoming tasks
    const upcomingTasks = await Task.find({
      user: req.user.id,
      status: { $ne: 'Completed' },
      deadline: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 24 * 60 * 60 * 1000) // Within next 24h
      }
    });

    for (const task of upcomingTasks) {
      // Check if notification already exists for this task today
      const existing = await Notification.findOne({
        user: req.user.id,
        title: 'Upcoming Deadline',
        message: { $regex: task.title },
        createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) }
      });

      if (!existing) {
        await Notification.create({
          user: req.user.id,
          title: 'Upcoming Deadline',
          message: `Your task "${task.title}" is due within 24 hours!`,
          type: 'Deadline'
        });
      }
    }

    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(20);
    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ success: false, message: 'Not found' });
    
    notification.read = true;
    await notification.save();
    
    res.status(200).json({ success: true, data: notification });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ success: false, message: 'Not found' });
    
    await notification.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
