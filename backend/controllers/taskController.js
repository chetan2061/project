const Task = require("../models/task");

// Get all tasks
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// Create a new task
exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// Update a task by ID
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// Delete task by ID
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};

// Delete all tasks
exports.deleteAllTasks = async (req, res, next) => {
  try {
    await Task.deleteMany({});
    res.json({ message: "All tasks deleted" });
  } catch (err) {
    next(err);
  }
};

// Delete only completed tasks
exports.deleteCompletedTasks = async (req, res, next) => {
  try {
    await Task.deleteMany({ completed: true });
    res.json({ message: "Completed tasks deleted" });
  } catch (err) {
    next(err);
  }
};
