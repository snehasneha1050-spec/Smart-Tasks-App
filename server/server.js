const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smart_tasks',
  waitForConnections: true,
  connectionLimit: 10,
};

let pool;

async function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

async function ensureSchema() {
  const connection = await getPool();

  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(150) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id VARCHAR(100) NOT NULL,
      username VARCHAR(150) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(50),
      priority VARCHAR(20),
      completed BOOLEAN DEFAULT FALSE,
      created_at DATETIME,
      due_date DATETIME NULL,
      is_daily BOOLEAN DEFAULT FALSE,
      subtasks JSON,
      PRIMARY KEY (id, username),
      KEY idx_username (username)
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS preferences (
      username VARCHAR(150) NOT NULL PRIMARY KEY,
      dark_mode BOOLEAN DEFAULT FALSE,
      language VARCHAR(20) DEFAULT 'English',
      notifications_enabled BOOLEAN DEFAULT TRUE,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(150) NOT NULL,
      session_token VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_session_token (session_token),
      KEY idx_session_username (username)
    )
  `);
}

app.get('/health', async (_req, res) => {
  try {
    await ensureSchema();
    res.json({ ok: true, message: 'MySQL API is running' });
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Username, email, and password are required.' });
    }

    const connection = await getPool();
    const [rows] = await connection.query('SELECT id FROM users WHERE LOWER(username)=LOWER(?)', [username.trim()]);
    if (rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Account already exists with this username.' });
    }

    await connection.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username.trim(), email.trim(), password]
    );

    res.status(201).json({ success: true, message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    const connection = await getPool();
    const [rows] = await connection.query(
      'SELECT id, username FROM users WHERE LOWER(username)=LOWER(?) AND password=?',
      [username.trim(), password]
    );

    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const user = rows[0];
    const sessionToken = `${user.username}:${Date.now()}:${Math.random().toString(16).slice(2)}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');

    await connection.query(
      'INSERT INTO sessions (username, session_token, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE session_token = VALUES(session_token), expires_at = VALUES(expires_at)',
      [user.username, sessionToken, expiresAt]
    );

    res.json({
      success: true,
      user,
      session: {
        token: sessionToken,
        expiresAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

app.get('/api/auth/session/:username/:sessionToken', async (req, res) => {
  try {
    const username = decodeURIComponent(req.params.username || '');
    const sessionToken = decodeURIComponent(req.params.sessionToken || '');
    const connection = await getPool();

    const [rows] = await connection.query(
      'SELECT username, session_token, expires_at FROM sessions WHERE username = ? AND session_token = ? AND expires_at > NOW() LIMIT 1',
      [username, sessionToken]
    );

    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'Session expired or invalid.' });
    }

    res.json({ success: true, session: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Session validation failed', error: error.message });
  }
});

app.delete('/api/auth/session/:username/:sessionToken', async (req, res) => {
  try {
    const username = decodeURIComponent(req.params.username || '');
    const sessionToken = decodeURIComponent(req.params.sessionToken || '');
    const connection = await getPool();

    await connection.query(
      'DELETE FROM sessions WHERE username = ? AND session_token = ?',
      [username, sessionToken]
    );

    res.json({ success: true, message: 'Session cleared.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Session logout failed', error: error.message });
  }
});

app.put('/api/auth/reset-password', async (req, res) => {
  try {
    const { username, newPassword } = req.body || {};
    if (!username || !newPassword) {
      return res.status(400).json({ success: false, message: 'Username and new password are required.' });
    }

    const connection = await getPool();
    const [result] = await connection.query(
      'UPDATE users SET password=? WHERE LOWER(username)=LOWER(?)',
      [newPassword, username.trim()]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Password reset failed', error: error.message });
  }
});

app.get('/api/tasks/:username', async (req, res) => {
  try {
    const username = decodeURIComponent(req.params.username || '');
    const connection = await getPool();
    const [rows] = await connection.query(
      'SELECT * FROM tasks WHERE username = ? ORDER BY created_at DESC',
      [username]
    );

    const tasks = rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description || '',
      category: row.category || 'Other',
      priority: row.priority || 'Medium',
      completed: !!row.completed,
      createdAt: row.created_at,
      dueDate: row.due_date,
      isDaily: !!row.is_daily,
      subtasks: row.subtasks ? JSON.parse(row.subtasks) : [],
    }));

    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch tasks', error: error.message });
  }
});

app.put('/api/tasks/:username', async (req, res) => {
  try {
    const username = decodeURIComponent(req.params.username || '');
    const tasks = Array.isArray(req.body?.tasks) ? req.body.tasks : [];

    const connection = await getPool();
    await connection.query('DELETE FROM tasks WHERE username = ?', [username]);

    if (tasks.length === 0) {
      return res.json({ success: true, tasks: [] });
    }

    const values = tasks.map((task) => [
      String(task.id || `${Date.now()}-${Math.random()}`),
      username,
      task.title || 'Untitled task',
      task.description || '',
      task.category || 'Other',
      task.priority || 'Medium',
      task.completed ? 1 : 0,
      task.createdAt || new Date().toISOString(),
      task.dueDate || null,
      task.isDaily ? 1 : 0,
      JSON.stringify(task.subtasks || [])
    ]);

    await connection.query(
      `INSERT INTO tasks (id, username, title, description, category, priority, completed, created_at, due_date, is_daily, subtasks) VALUES ?`,
      [values]
    );

    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ message: 'Unable to save tasks', error: error.message });
  }
});

app.get('/api/preferences/:username', async (req, res) => {
  try {
    const username = decodeURIComponent(req.params.username || '');
    const connection = await getPool();
    const [rows] = await connection.query(
      'SELECT dark_mode, language, notifications_enabled FROM preferences WHERE username = ? LIMIT 1',
      [username]
    );

    const preferences = rows[0] || {
      dark_mode: false,
      language: 'English',
      notifications_enabled: true,
    };

    res.json({
      preferences: {
        darkMode: !!preferences.dark_mode,
        language: preferences.language || 'English',
        notificationsEnabled: preferences.notifications_enabled !== false,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch preferences', error: error.message });
  }
});

app.put('/api/preferences/:username', async (req, res) => {
  try {
    const username = decodeURIComponent(req.params.username || '');
    const { darkMode, language, notificationsEnabled } = req.body || {};

    const connection = await getPool();
    const payload = {
      dark_mode: Boolean(darkMode),
      language: language || 'English',
      notifications_enabled: notificationsEnabled !== false,
    };

    await connection.query(
      `INSERT INTO preferences (username, dark_mode, language, notifications_enabled)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE dark_mode = VALUES(dark_mode), language = VALUES(language), notifications_enabled = VALUES(notifications_enabled)`,
      [username, payload.dark_mode, payload.language, payload.notifications_enabled]
    );

    res.json({ success: true, preferences: payload });
  } catch (error) {
    res.status(500).json({ message: 'Unable to save preferences', error: error.message });
  }
});

app.delete('/api/tasks/:username', async (req, res) => {
  try {
    const username = decodeURIComponent(req.params.username || '');
    const connection = await getPool();
    await connection.query('DELETE FROM tasks WHERE username = ?', [username]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Unable to clear tasks', error: error.message });
  }
});

(async () => {
  try {
    await ensureSchema();
    app.listen(PORT, () => {
      console.log(`MySQL task API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start API server:', error);
    process.exit(1);
  }
})();
