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

const getPreferences = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT dark_mode, language, notifications_enabled FROM user_preferences WHERE user_id = ? LIMIT 1',
      [req.user.id]
    );

    const preferences = rows[0] || {
      dark_mode: false,
      language: 'English',
      notifications_enabled: true,
    };

    return res.json({
      success: true,
      preferences: {
        darkMode: Boolean(preferences.dark_mode),
        language: preferences.language || 'English',
        notificationsEnabled: preferences.notifications_enabled !== false,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch preferences.',
      error: error.message,
    });
  }
};

const updatePreferences = async (req, res) => {
  try {
    const { darkMode, language, notificationsEnabled } = req.body || {};
    const preferences = {
      darkMode: Boolean(darkMode),
      language: language || 'English',
      notificationsEnabled: notificationsEnabled !== false,
    };

    await db.query(
      `INSERT INTO user_preferences (user_id, dark_mode, language, notifications_enabled)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         dark_mode = VALUES(dark_mode),
         language = VALUES(language),
         notifications_enabled = VALUES(notifications_enabled)`,
      [req.user.id, preferences.darkMode, preferences.language, preferences.notificationsEnabled]
    );

    return res.json({ success: true, preferences });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to save preferences.',
      error: error.message,
    });
  }
};

module.exports = { getProfile, getPreferences, updatePreferences };
