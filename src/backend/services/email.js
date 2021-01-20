'use strict';

const emailRepository = require(`../repositories/email`);

const checkEmail = async (email) => {
  const isRegister = await emailRepository.checkEmail(email);
  if (isRegister) {
    return {userRegister: true};
  }
  return {userRegister: false};
};

module.exports = {
  checkEmail
};

