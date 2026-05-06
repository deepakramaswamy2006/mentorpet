const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ deadline: 1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await task.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/tasks/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const todoTasks = tasks.filter(t => t.status === 'To Do').length;
    
    // Group by subject
    const subjectStats = {};
    tasks.forEach(t => {
      if (!subjectStats[t.subject]) {
        subjectStats[t.subject] = { total: 0, completed: 0 };
      }
      subjectStats[t.subject].total++;
      if (t.status === 'Completed') subjectStats[t.subject].completed++;
    });

    const formattedSubjectStats = Object.keys(subjectStats).map(subject => ({
      name: subject,
      score: Math.round((subjectStats[subject].completed / subjectStats[subject].total) * 100),
      color: '#' + Math.floor(Math.random()*16777215).toString(16) // Random color for now
    }));

    // Group by day (last 7 days)
    const dailyStats = {};
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailyStats[days[d.getDay()]] = 0;
    }

    tasks.forEach(t => {
      const day = days[new Date(t.createdAt).getDay()];
      if (dailyStats[day] !== undefined) {
        dailyStats[day]++;
      }
    });

    const formattedDailyStats = Object.keys(dailyStats).map(day => ({
      day,
      hours: dailyStats[day] * 1.5 // Mocking "hours" based on task count
    })).reverse();

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        subjectStats: formattedSubjectStats,
        dailyStats: formattedDailyStats
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
