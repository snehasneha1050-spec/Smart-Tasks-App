const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getProfile } = require('../controllers/userController');

const router = express.Router();

router.use(authMiddleware);
router.get('/profile', getProfile);

module.exports = router;
