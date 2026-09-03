const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
} = require('../controllers/taskController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/toggle', toggleTaskCompletion);

module.exports = router;
