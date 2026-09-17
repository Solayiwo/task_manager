const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const VALID_STATUSES = new Set(['pending', 'in_progress', 'completed']);

const isValidTaskId = (value) => /^\d+$/.test(String(value)) && Number(value) > 0;

const isValidDate = (value) => {
  // Check both the expected format and the actual calendar date.
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;
};

const getToday = () => new Date().toISOString().slice(0, 10);

const validateTaskInput = ({ title, description, status, due_date }, minimumDueDate = getToday()) => {
  // Keep the same business rules for create and update requests.
  if (typeof title !== 'string' || title.trim() === '') return 'Title is required';
  if (title.trim().length > 255) return 'Title must be 255 characters or fewer';
  if (typeof description !== 'string' || description.trim() === '') return 'Description is required';
  if (description.trim().length > 2000) return 'Description must be 2000 characters or fewer';
  if (status !== undefined && !VALID_STATUSES.has(status)) {
    return 'Status must be pending, in_progress, or completed';
  }
  if (!isValidDate(due_date)) return 'Due date is required and must be in YYYY-MM-DD format';
  if (due_date < minimumDueDate) return `Due date cannot be before ${minimumDueDate}`;
  return null;
};

const normalizeDateValue = (value, isDateOnly = false) => {
  if (!value) return null;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const isoMatch = trimmed.match(/^\d{4}-\d{2}-\d{2}/);
    if (isoMatch) return isoMatch[0];

    const date = new Date(trimmed);
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().slice(0, 10);
    }

    return trimmed;
  }

  if (value instanceof Date) {
    if (isDateOnly) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    return value.toISOString().slice(0, 10);
  }

  return value;
};

const mapTask = (task) => ({
  // Normalize database dates before they are returned to HTML date inputs.
  ...task,
  due_date: normalizeDateValue(task.due_date, true),
  created_at: normalizeDateValue(task.created_at),
});

// 1. GET ALL TASKS
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(rows.map(mapTask));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// 2. GET SINGLE TASK
// router.get('/:id', async (req, res) => {
//   if (!isValidTaskId(req.params.id)) {
//     return res.status(400).json({ error: 'Task ID must be a positive integer' });
//   }

//   try {
//     const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
//     if (rows.length === 0) {
//       return res.status(404).json({ error: 'Task not found' });
//     }
//     res.json(mapTask(rows[0]));
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch task' });
//   }
// });

// 3. CREATE TASK
router.post('/', async (req, res) => {
  const { title, description, status, due_date } = req.body;

  const validationError = validateTaskInput(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const normalizedDueDate = normalizeDateValue(due_date);
    const query = `
      INSERT INTO tasks (title, description, status, due_date)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      title.trim(),
      description.trim(),
      status || 'pending',
      normalizedDueDate || null
    ]);

    const [newTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(mapTask(newTask[0]));
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// 4. UPDATE TASK
router.put('/:id', async (req, res) => {
  const { title, description, status, due_date } = req.body;

  if (!isValidTaskId(req.params.id)) {
    return res.status(400).json({ error: 'Task ID must be a positive integer' });
  }

  try {
    const [existingTasks] = await db.query('SELECT created_at, status FROM tasks WHERE id = ?', [req.params.id]);
    if (existingTasks.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Completed tasks are immutable, even when a client calls the API directly.
    if (existingTasks[0].status === 'completed') {
      return res.status(409).json({ error: 'Completed tasks cannot be edited' });
    }

    const createdDate = normalizeDateValue(existingTasks[0].created_at);
    const minimumDueDate = createdDate > getToday() ? createdDate : getToday();
    const validationError = validateTaskInput(req.body, minimumDueDate);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const normalizedDueDate = normalizeDateValue(due_date);
    const query = `
      UPDATE tasks 
      SET title = ?, description = ?, status = ?, due_date = ?
      WHERE id = ?
    `;
    const [result] = await db.query(query, [
      title.trim(),
      description.trim(),
      status || 'pending',
      normalizedDueDate || null,
      req.params.id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const [updatedTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    res.json(mapTask(updatedTask[0]));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// 5. DELETE TASK
router.delete('/:id', async (req, res) => {
  if (!isValidTaskId(req.params.id)) {
    return res.status(400).json({ error: 'Task ID must be a positive integer' });
  }

  try {
    const [result] = await db.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;