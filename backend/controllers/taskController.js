const db = require('../config/db');

const parseSubtasks = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed || trimmed === 'null') return [];
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }
  return [];
};

const normalizeDueDate = (value) => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString().slice(0, 19).replace('T', ' ');
};

const normalizeTask = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description || '',
  category: row.category || 'Other',
  priority: row.priority || 'Medium',
  completed: Boolean(row.completed),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  dueDate: row.due_date,
  isDaily: Boolean(row.is_daily),
  subtasks: parseSubtasks(row.subtasks),
});

const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    return res.json({
      success: true,
      tasks: rows.map(normalizeTask),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks.',
      error: error.message,
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    return res.json({
      success: true,
      task: normalizeTask(rows[0]),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch task.',
      error: error.message,
    });
  }
};

const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const task = req.body || {};

    if (!task.title || !task.description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required.',
      });
    }

    const taskId = task.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const payload = {
      id: String(taskId),
      user_id: userId,
      title: task.title,
      description: task.description || '',
      category: task.category || 'Other',
      priority: task.priority || 'Medium',
      completed: Boolean(task.completed),
      due_date: normalizeDueDate(task.dueDate),
      is_daily: Boolean(task.isDaily),
      subtasks: JSON.stringify(task.subtasks || []),
    };

    await db.query(
      `INSERT INTO tasks (id, user_id, title, description, category, priority, completed, due_date, is_daily, subtasks)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.id,
        payload.user_id,
        payload.title,
        payload.description,
        payload.category,
        payload.priority,
        payload.completed ? 1 : 0,
        payload.due_date,
        payload.is_daily ? 1 : 0,
        payload.subtasks,
      ]
    );

    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [payload.id, userId]);
    return res.status(201).json({
      success: true,
      task: normalizeTask(rows[0]),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create task.',
      error: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const task = req.body || {};

    const [rows] = await db.query(
      'SELECT id FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    await db.query(
      `UPDATE tasks SET
        title = ?,
        description = ?,
        category = ?,
        priority = ?,
        completed = ?,
        due_date = ?,
        is_daily = ?,
        subtasks = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [
        task.title || 'Untitled task',
        task.description || '',
        task.category || 'Other',
        task.priority || 'Medium',
        task.completed ? 1 : 0,
        normalizeDueDate(task.dueDate),
        task.isDaily ? 1 : 0,
        JSON.stringify(task.subtasks || []),
        id,
        userId,
      ]
    );

    const [updatedRows] = await db.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);

    return res.json({
      success: true,
      task: normalizeTask(updatedRows[0]),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update task.',
      error: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    return res.json({
      success: true,
      message: 'Task deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete task.',
      error: error.message,
    });
  }
};

const toggleTaskCompletion = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [taskRows] = await db.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!taskRows.length) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    const updatedCompleted = !Boolean(taskRows[0].completed);
    await db.query(
      'UPDATE tasks SET completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [updatedCompleted ? 1 : 0, id, userId]
    );

    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);

    return res.json({
      success: true,
      task: normalizeTask(rows[0]),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle task completion.',
      error: error.message,
    });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
};
