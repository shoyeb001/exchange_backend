import Joi from 'joi';

export const registerValidator = Joi.object({
    name: Joi.string().required().messages({
      "string.base": "Name must be a string.",
      "string.empty": "Name is required.",
      "any.required": "Name is required."
    }),
    email: Joi.string().email().required().messages({
      "string.base": "Email must be a string.",
      "string.email": "Please enter a valid email address.",
      "string.empty": "Email is required.",
      "any.required": "Email is required."
    }),
    password: Joi.string().min(6).required().messages({
      "string.base": "Password must be a string.",
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 6 characters long.",
      "any.required": "Password is required."
    }),
    role: Joi.string().valid("user", "admin").optional().messages({
      "any.only": 'Role must be either "user" or "admin".',
      "string.base": "Role must be a string."
    }),
    isActive: Joi.boolean().optional().messages({
      "boolean.base": "isActive must be true or false."
    })
  });
