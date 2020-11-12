'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  comment: Joi.string().min(20).required(),
  announcementId: Joi.number().required(),
  userId: Joi.number().required(),
});
