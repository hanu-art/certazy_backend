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
import coursesRoutes from './modules/courses/courses.routes.js'
import sectionRoutes from './modules/sections/sections.routes.js'
import lessonRoutes from './modules/lessons/lessons.routes.js'
import testRoutes from './modules/tests/tests.routes.js'
import questionRoutes from './modules/questions/questions.routes.js'
import optionRoutes from './modules/options/options.routes.js'
import enrollmentRoutes from './modules/enrollments/enrollments.routes.js'
import attemptRoutes from './modules/attempts/attempts.routes.js'
import progressRoutes from './modules/progress/progress.routes.js'
import paymentRoutes from "./modules/payments/payments.routes.js"
import discountRoutes from "./modules/discounts/discounts.routes.js"
import certificateRoutes from "./modules/certificates/certificates.routes.js"
import reviewRoutes from "./modules/reviews/reviews.routes.js"
import adminRoutes from "./modules/admin/admin.routes.js"
import contactRoutes from "./modules/contact/contact.routes.js"
import uploadRoutes from "./modules/upload/upload.routes.js"

const app = express()

// ─── SECURITY ────────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin     : env.frontendUrl,
  credentials: true,
  methods    : ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}))

app.use('/api/payments/razorpay/webhook', express.raw({ type: 'application/json' }))

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
app.use('/api/v1/auth', authRoutes)
app.use("/api/v1/categories", categoryRoutes)
app.use('/api/v1/courses', coursesRoutes)
app.use('/api/v1/sections', sectionRoutes)
app.use('/api/v1/lessons', lessonRoutes)
app.use('/api/v1/tests', testRoutes)
app.use('/api/v1/questions', questionRoutes)
app.use('/api/v1/options', optionRoutes)
app.use('/api/v1/enrollments', enrollmentRoutes)
app.use('/api/v1/attempts', attemptRoutes)
app.use('/api/v1/progress', progressRoutes)
app.use('/api/v1/payments', paymentRoutes)
app.use('/api/v1/discounts', discountRoutes)
app.use('/api/v1/certificates', certificateRoutes)
app.use('/api/v1/reviews', reviewRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use("/api/v1/contact", contactRoutes)
app.use('/api/v1/upload', uploadRoutes)

// ─── 404 ─────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// ─── GLOBAL ERROR HANDLER ────────────────────────────────────
app.use(errorHandler)

export default app