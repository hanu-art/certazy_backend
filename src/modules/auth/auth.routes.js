// src/modules/auth/auth.routes.js

import { Router } from 'express'
import passport from '../../config/passport.js'
import * as controller from './auth.controller.js'
import authenticate from '../../middleware/auth.js'
import { validate, schemas } from '../../middleware/validate.js'
import { loginLimiter, registerLimiter } from '../../middleware/rateLimit.js'

const router = Router()

// ─── LOCAL AUTH ──────────────────────────────────────────────
router.post('/register', registerLimiter, validate(schemas.register), controller.register)
router.post('/login',    loginLimiter,    validate(schemas.login),    controller.login)
router.post('/refresh',                                                controller.refresh)
router.post('/logout',                                                 controller.logout)

router.post('/change-password', authenticate, validate(schemas.changePassword), controller.changePassword)
router.get('/me', authenticate, controller.me)

// ─── GOOGLE OAuth ────────────────────────────────────────────
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
)

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/api/auth/oauth/failure' }),
  controller.googleCallback
)

// ─── GITHUB OAuth ────────────────────────────────────────────
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'], session: false })
)

router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/api/auth/oauth/failure' }),
  controller.githubCallback
)

// ─── OAUTH FAILURE ───────────────────────────────────────────
router.get('/oauth/failure', (req, res) => {
  res.status(401).json({ success: false, message: 'OAuth login failed. Please try again.' })
})

export default router