// src/modules/admin/admin.queries.js

import { pool } from '../../config/db.js'

// ── Get permissions by user_id ─────────────────────────────────────────────
const getPermissionsByUserId = (user_id) =>
  pool.query(
    `SELECT * FROM admin_permissions WHERE user_id = ? LIMIT 1`,
    [user_id]
  )

// ── Create permissions ─────────────────────────────────────────────────────
const createPermissions = ({ user_id, can_manage_courses, can_manage_students, can_send_discounts, can_view_payments, can_manage_tests, created_by }) =>
  pool.query(
    `INSERT INTO admin_permissions
       (user_id, can_manage_courses, can_manage_students, can_send_discounts, can_view_payments, can_manage_tests, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [user_id, can_manage_courses ?? 0, can_manage_students ?? 0, can_send_discounts ?? 0, can_view_payments ?? 0, can_manage_tests ?? 0, created_by]
  )

// ── Update permissions ─────────────────────────────────────────────────────
const updatePermissions = (user_id, { can_manage_courses, can_manage_students, can_send_discounts, can_view_payments, can_manage_tests }) =>
  pool.query(
    `UPDATE admin_permissions
     SET can_manage_courses = ?, can_manage_students = ?,
         can_send_discounts = ?, can_view_payments = ?,
         can_manage_tests = ?
     WHERE user_id = ?`,
    [can_manage_courses, can_manage_students, can_send_discounts, can_view_payments, can_manage_tests, user_id]
  )

// ── Delete permissions ─────────────────────────────────────────────────────
const deletePermissions = (user_id) =>
  pool.query(
    `DELETE FROM admin_permissions WHERE user_id = ?`,
    [user_id]
  )

export {
  getPermissionsByUserId,
  createPermissions,
  updatePermissions,
  deletePermissions,
}