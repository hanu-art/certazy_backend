// src/middleware/validate.js

import Joi from 'joi'

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly  : false,
      stripUnknown: true,
    })

    if (error) {
      const err = new Error('Validation failed')
      err.statusCode = 422
      err.errors = error.details.map((d) => d.message.replace(/['"]/g, ''))
      return next(err)
    }

    req.body = value
    next()
  }
}

const registerSchema = Joi.object({
  name    : Joi.string().min(2).max(100).required(),
  email   : Joi.string().email().max(150).lowercase().required(),
  password: Joi.string()
    .min(8)
    .max(72)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required()
    .messages({
      'string.pattern.base': 'Password must have uppercase, lowercase, number and special character',
    }),
})

const loginSchema = Joi.object({
  email   : Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
})

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword    : Joi.string()
    .min(8)
    .max(72)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required()
    .messages({
      'string.pattern.base': 'Password must have uppercase, lowercase, number and special character',
    }),
})

const schemas = {
  register      : registerSchema,
  login         : loginSchema,
  changePassword: changePasswordSchema,
}

export { validate, schemas }