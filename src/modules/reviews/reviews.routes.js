// src/modules/reviews/reviews.routes.js

import { Router }      from 'express'
import * as controller from './reviews.controller.js'
import authenticate    from '../../middleware/auth.js'
import role            from '../../middleware/role.js'

const router = Router()

// ─── PUBLIC ───────────────────────────────────────────────────
router.get('/:courseId',         controller.getReviewsByCourseId)

// ─── STUDENT ──────────────────────────────────────────────────
router.post('/',                 authenticate, role('student'),            controller.createReview)

// ─── ADMIN ────────────────────────────────────────────────────
router.get('/admin/all',         authenticate, role('admin', 'sub_admin'), controller.getAllReviews)
router.put('/:id/approval',      authenticate, role('admin', 'sub_admin'), controller.updateApprovalStatus)
router.delete('/:id',            authenticate, role('admin'),              controller.deleteReview)

export default router