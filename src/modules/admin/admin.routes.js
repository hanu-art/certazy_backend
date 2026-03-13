// src/modules/admin/admin.routes.js

import { Router }      from 'express'
import * as controller from './admin.controller.js'
import authenticate    from '../../middleware/auth.js'
import role            from '../../middleware/role.js'

const router = Router()

// ─── ADMIN ONLY ───────────────────────────────────────────────
router.get('/permissions/:userId',    authenticate, role('admin'), controller.getPermissions)
router.post('/permissions',           authenticate, role('admin'), controller.createPermissions)
router.put('/permissions/:userId',    authenticate, role('admin'), controller.updatePermissions)
router.delete('/permissions/:userId', authenticate, role('admin'), controller.deletePermissions)

export default router