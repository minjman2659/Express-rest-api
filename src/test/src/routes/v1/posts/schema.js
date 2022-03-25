const Joi = require('joi');

const readSchema = Joi.object().keys({
  id: Joi.number().integer().required(),
  title: Joi.string().min(2).max(20).required(),
  text: Joi.string().max(2000).required(),
  thumbnail: Joi.string().required(),
  updatedAt: Joi.date().required(),
  createdAt: Joi.date().required(),
  writer: Joi.object().keys({
    id: Joi.number().integer().required(),
    username: Joi.string().min(0).max(10).required(),
  }),
});

const listSchema = Joi.object().keys({
  posts: Joi.array().items(readSchema.append()),
  count: Joi.number().integer().required(),
});

module.exports = { readSchema, listSchema };
