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


// category relted scema  

const createCategorySchema = Joi.object({
  name       : Joi.string().min(2).max(100).required(),
  slug       : Joi.string().max(120).optional(),
  description: Joi.string().optional(),
  icon       : Joi.string().max(255).optional(),
  parent_id  : Joi.number().integer().optional(),
  sort_order : Joi.number().integer().default(0).optional(),
})

const updateCategorySchema = Joi.object({
  name       : Joi.string().min(2).max(100).optional(),
  slug       : Joi.string().max(120).optional(),
  description: Joi.string().optional(),
  icon       : Joi.string().max(255).optional(),
  parent_id  : Joi.number().integer().optional(),
  is_active  : Joi.boolean().optional(),
  sort_order : Joi.number().integer().optional(),
})


const schemas = {
  register      : registerSchema,
  login         : loginSchema,
  changePassword: changePasswordSchema,
  createCategory  : createCategorySchema,
  updateCategory  : updateCategorySchema,
}

export { validate, schemas }