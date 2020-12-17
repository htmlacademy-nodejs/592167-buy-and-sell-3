'use strict';

const Joi = require(`joi`);
const {REGISTER_MESSAGE} = require(`../../constants`);

module.exports = Joi.object({
  userName: Joi.string()
    .required()
    .pattern(new RegExp(`^[a-zA-Zа-яА-Я ]{0,100}$`))
    .max(100)
    .messages({
      'string.max': REGISTER_MESSAGE.MAX_USER_NAME_LENGTH,
      'any.required': REGISTER_MESSAGE.USER_NAME_REQUIRED_FIELD,
      'string.pattern.base': REGISTER_MESSAGE.USER_NAME_WRONG,
    }),

  email: Joi.string()
    .required()
    .email()
    .messages({
      'string.email': REGISTER_MESSAGE.EMAIL_WRONG,
      'any.required': REGISTER_MESSAGE.EMAIL_REQUIRED_FIELD,
    }),

  password: Joi.string()
    .required()
    .min(6)
    .max(50)
    .messages({
      'any.required': REGISTER_MESSAGE.PASSWORD_REQUIRED_FIELD,
      'string.min': REGISTER_MESSAGE.MIN_PASSWORD_LENGTH,
      'string.max': REGISTER_MESSAGE.MAX_PASSWORD_LENGTH,
    }),

  repeat: Joi.string()
    .required()
    .valid(Joi.ref(`password`))
    .messages({
      'any.required': REGISTER_MESSAGE.REPEAT_REQUIRED_FIELD,
      'any.only': REGISTER_MESSAGE.PASSWORDS_NOT_EQUALS,
    }),
});
