// src/middleware/rateLimit.js

import rateLimit from 'express-rate-limit'

const loginLimiter = rateLimit({
  windowMs       : 15 * 60 * 1000,
  max            : 5,
  message        : { success: false, message: 'Too many login attempts. Try after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders  : false,
})

const registerLimiter = rateLimit({
  windowMs       : 60 * 60 * 1000,
  max            : 10,
  message        : { success: false, message: 'Too many registrations from this IP.' },
  standardHeaders: true,
  legacyHeaders  : false,
})

const apiLimiter = rateLimit({
  windowMs       : 60 * 1000,
  max            : 100,
  message        : { success: false, message: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders  : false,
})

export { loginLimiter, registerLimiter, apiLimiter }