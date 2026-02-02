const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return res.status(400).json({ message: 'Validation error', errors });
    }

    req.body = value;
    next();
  };
};

// Validation schemas
const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required(),
    university: Joi.string().min(2).max(200).required(),
    major: Joi.string().min(2).max(100).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  createProject: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().min(10).max(5000).required(),
    requiredSkills: Joi.array().items(Joi.string().max(50)).max(20),
    maxMembers: Joi.number().integer().min(2).max(100),
    deadline: Joi.date().greater('now'),
    category: Joi.string().valid('web-development', 'mobile-app', 'ai-ml', 'research', 'other'),
    status: Joi.string().valid('planning', 'active', 'completed').default('planning')
  }),

  updateProject: Joi.object({
    title: Joi.string().min(3).max(200),
    description: Joi.string().min(10).max(5000),
    requiredSkills: Joi.array().items(Joi.string().max(50)).max(20),
    maxMembers: Joi.number().integer().min(2).max(100),
    deadline: Joi.date().greater('now'),
    category: Joi.string().valid('web-development', 'mobile-app', 'ai-ml', 'research', 'other'),
    status: Joi.string().valid('planning', 'active', 'completed')
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(100),
    bio: Joi.string().max(1000),
    skills: Joi.array().items(Joi.string().max(50)).max(30),
    github: Joi.string().uri().allow(''),
    linkedin: Joi.string().uri().allow(''),
    university: Joi.string().min(2).max(200),
    major: Joi.string().min(2).max(100)
  })
};

module.exports = { validate, schemas };
