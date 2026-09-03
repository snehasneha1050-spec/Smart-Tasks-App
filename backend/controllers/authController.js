const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const createToken = (user) => jwt.sign(
  { id: user.id, email: user.email, name: user.name },
  process.env.JWT_SECRET || 'smarttasks_secret_key_2026',
  { expiresIn: '7d' }
);

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required.',
      });
    }

    const [existingRows] = await db.query('SELECT id FROM users WHERE email = ?', [email.trim()]);
    if (existingRows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name.trim(), email.trim(), hashedPassword]
    );

    const userId = result.insertId;
    const [rows] = await db.query('SELECT id, name, email, created_at FROM users WHERE id = ?', [userId]);
    const user = rows[0];
    const token = createToken(user);

    return res.status(201).json({
      success: true,
      token,
      user,
      message: 'User registered successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Signup failed.',
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, username, name, password } = req.body || {};
    const identifier = (email || username || name || '').trim();

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email or username and password are required.',
      });
    }

    const [rows] = await db.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER(?) OR LOWER(name) = LOWER(?) LIMIT 1',
      [identifier, identifier]
    );
    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = createToken(user);
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    };

    return res.json({
      success: true,
      token,
      user: safeUser,
      message: 'Login successful.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Login failed.',
      error: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
};
