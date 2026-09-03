const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function verifyDatabaseAndLogin() {
  const connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  };

  const dbName = process.env.DB_NAME || 'smarttasks_db';

  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log('✅ MySQL connection established.');

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.query(`USE \`${dbName}\``);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
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
        KEY idx_user_id (user_id)
      )
    `);

    const email = 'verify.user@example.com';
    const plainPassword = 'Password123!';
    const hashed = await bcrypt.hash(plainPassword, 10);

    await connection.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password = VALUES(password)',
      ['Verify User', email, hashed]
    );

    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    const isMatch = await bcrypt.compare(plainPassword, user.password);

    if (!user || !isMatch) {
      throw new Error('Login verification failed.');
    }

    console.log('✅ Login verification passed. User found and password check succeeded.');
    console.log(`User: ${user.name} <${user.email}>`);
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database/login verification failed:', error.message);
    process.exit(1);
  }
}

verifyDatabaseAndLogin();
