const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getProfile, getPreferences, updatePreferences } = require('../controllers/userController');

const router = express.Router();

router.use(authMiddleware);
router.get('/profile', getProfile);
router.get('/preferences', getPreferences);
router.put('/preferences', updatePreferences);

module.exports = router;
