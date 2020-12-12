'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  title: Joi.string().min(10).max(100).required(),
  description: Joi.string().min(50).max(1000).required(),
  sum: Joi.number().min(100).required(),
  userId: Joi.number().required(),
  typeId: Joi.number().required(),
  categories: Joi.array().items(Joi.string()).min(1).required()
});
