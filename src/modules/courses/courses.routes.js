// src/modules/courses/courses.routes.js

import { Router } from 'express'
import * as controller from './courses.controller.js'
import authenticate from '../../middleware/auth.js'
import role from '../../middleware/role.js'
import { validate, schemas } from '../../middleware/validate.js'

const router = Router()

// ─── PUBLIC ──────────────────────────────────────────────────
router.get('/',          controller.getAllCourses)
router.get('/:slug',     controller.getCourseBySlug)

// ─── ADMIN / SUB-ADMIN ONLY ───────────────────────────────────
router.post('/create',     authenticate, role('admin', 'sub_admin'), validate(schemas.createCourse), controller.createCourse)
router.put('/update/:id',   authenticate, role('admin', 'sub_admin'), validate(schemas.updateCourse), controller.updateCourse)
router.delete('/delete/:id', authenticate, role('admin'),                                              controller.deleteCourse)

export default router