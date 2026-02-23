// src/modules/auth/auth.queries.js

import { pool } from "../../config/db.js"

const findByEmail = async (email) => {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [email]
  )
  return rows[0] || null
}

const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, name, email, role, gender, mobile, avatar,
            oauth_provider, is_verified, is_active, is_first_login,
            created_at
     FROM users WHERE id = ? LIMIT 1`,
    [id]
  )
  return rows[0] || null
}

const createUser = async ({ name, email, password, role = 'student' }) => {
  const [result] = await pool.query(
    `INSERT INTO users (name, email, password, role, oauth_provider)
     VALUES (?, ?, ?, ?, 'local')`,
    [name, email, password, role]
  )
  return result.insertId
}

const saveRefreshToken = async ({ userId, token, expiresAt }) => {
  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
    [userId, token, expiresAt]
  )
}

const findRefreshToken = async (token) => {
  const [rows] = await pool.query(
    `SELECT rt.*, u.id as uid, u.role, u.is_active
     FROM refresh_tokens rt
     JOIN users u ON u.id = rt.user_id
     WHERE rt.token = ? AND rt.expires_at > NOW()
     LIMIT 1`,
    [token]
  )
  return rows[0] || null
}

const deleteRefreshToken = async (token) => {
  await pool.query('DELETE FROM refresh_tokens WHERE token = ?', [token])
}

const deleteAllRefreshTokens = async (userId) => {
  await pool.query('DELETE FROM refresh_tokens WHERE user_id = ?', [userId])
}

const updatePassword = async (userId, hashedPassword) => {
  await pool.query(
    'UPDATE users SET password = ?, is_first_login = 0 WHERE id = ?',
    [hashedPassword, userId]
  )
}

const verifyEmail = async (userId) => {
  await pool.query('UPDATE users SET is_verified = 1 WHERE id = ?', [userId])
}

export {
  findByEmail,
  findById,
  createUser,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  deleteAllRefreshTokens,
  updatePassword,
  verifyEmail,
}