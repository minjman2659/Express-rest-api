const Joi = require('joi');

const registerSchema = Joi.object().keys({
  id: Joi.number().integer().required(),
  username: Joi.string().min(0).max(10).required(),
  email: Joi.string().email().required(),
  updatedAt: Joi.date().required(),
  createdAt: Joi.date().required(),
});

module.exports = registerSchema;
