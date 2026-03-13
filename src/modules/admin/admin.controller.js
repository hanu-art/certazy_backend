// src/modules/admin/admin.controller.js

import * as service from './admin.service.js'
import { success }  from '../../utils/response.js'

// ── GET /admin/permissions/:userId ────────────────────────────────────────
const getPermissions = async (req, res, next) => {
  try {
    const permissions = await service.getPermissions(req.params.userId)
    return success(res, { message: 'Permissions fetched', data: { permissions } })
  } catch (err) {
    next(err)
  }
}

// ── POST /admin/permissions ────────────────────────────────────────────────
const createPermissions = async (req, res, next) => {
  try {
    const permissions = await service.createPermissions(req.user.id, req.body)
    return success(res, { statusCode: 201, message: 'Permissions created', data: { permissions } })
  } catch (err) {
    next(err)
  }
}

// ── PUT /admin/permissions/:userId ────────────────────────────────────────
const updatePermissions = async (req, res, next) => {
  try {
    const permissions = await service.updatePermissions(req.params.userId, req.body)
    return success(res, { message: 'Permissions updated', data: { permissions } })
  } catch (err) {
    next(err)
  }
}

// ── DELETE /admin/permissions/:userId ─────────────────────────────────────
const deletePermissions = async (req, res, next) => {
  try {
    await service.deletePermissions(req.params.userId)
    return success(res, { message: 'Permissions deleted' })
  } catch (err) {
    next(err)
  }
}

export { getPermissions, createPermissions, updatePermissions, deletePermissions }