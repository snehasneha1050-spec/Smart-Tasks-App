const db = require('../config/db');

const getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.json({
      success: true,
      user: rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profile.',
      error: error.message,
    });
  }
};

module.exports = { getProfile };
