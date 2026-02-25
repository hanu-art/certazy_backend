import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import env from './config/env.js'
import './config/passport.js'
import errorHandler from './middleware/errorHandler.js'
import { apiLimiter } from './middleware/rateLimit.js'
import authRoutes from './modules/auth/auth.routes.js'
import categoryRoutes from './modules/categories/categories.routes.js'
const app = express()

// ─── SECURITY ────────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin     : env.frontendUrl,
  credentials: true,
  methods    : ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}))

// ─── BODY PARSING ────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ─── LOGGING ─────────────────────────────────────────────────
if (!env.isProd) {
  app.use(morgan('dev'))
}

// ─── RATE LIMIT ──────────────────────────────────────────────
app.use('/api/', apiLimiter)

// ─── HEALTH CHECK ────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', env: env.NODE_ENV })
})

// ─── ROUTES ──────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use("/api/category", categoryRoutes)
// app.use('/api/courses', coursesRoutes)
// app.use('/api/admin', adminRoutes)

// ─── 404 ─────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// ─── GLOBAL ERROR HANDLER ────────────────────────────────────
app.use(errorHandler)

export default app