// src/modules/tests/tests.routes.js

import { Router } from 'express'
import * as controller from './tests.controller.js'
import authenticate from '../../middleware/auth.js'
import role from '../../middleware/role.js'
import { validate, schemas } from '../../middleware/validate.js'

const router = Router()

// ─── PUBLIC ──────────────────────────────────────────────────
router.get('/course/:course_id', controller.getTestsByCourseId)
router.get('/:id/full',          controller.getTestFull)
router.get('/:id',               controller.getTestById)

// ─── ADMIN / SUB-ADMIN ONLY ───────────────────────────────────
router.post('/create',      authenticate, role('admin', 'sub_admin'), validate(schemas.createTest), controller.createTest)
router.put('/update/:id',    authenticate, role('admin', 'sub_admin'), validate(schemas.updateTest), controller.updateTest)
router.delete('/delete/:id', authenticate, role('admin', 'sub_admin'),                               controller.deleteTest)

export default router