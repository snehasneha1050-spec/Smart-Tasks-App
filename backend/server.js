const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/health', async (_req, res) => {
  try {
    await db.query('SELECT 1');
    return res.json({ success: true, message: 'Backend is running and MySQL is connected.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Database connection failed.', error: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/user', userRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  return res.status(500).json({
    success: false,
    message: 'Internal server error.',
    error: err.message,
  });
});

const initializeDatabase = async () => {
  try {
    const adminConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    await adminConnection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'smarttasks_db'}\``);
    await adminConnection.end();

    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(100) NOT NULL,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(50) DEFAULT 'Other',
        priority VARCHAR(20) DEFAULT 'Medium',
        completed BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        due_date DATETIME NULL,
        is_daily BOOLEAN DEFAULT FALSE,
        subtasks JSON,
        PRIMARY KEY (id),
        KEY idx_user_id (user_id),
        CONSTRAINT fk_tasks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        user_id INT NOT NULL PRIMARY KEY,
        dark_mode BOOLEAN DEFAULT FALSE,
        language VARCHAR(20) DEFAULT 'English',
        notifications_enabled BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_preferences_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

(async () => {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`SmartTasks backend running on port ${PORT}`);
  });
})();
