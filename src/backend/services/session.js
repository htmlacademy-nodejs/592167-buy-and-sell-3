'use strict';

const sessionRepository = require(`../repositories/session`);

const isSession = 1;
const isNotSession = 0;

const checkLogin = async (userName) => {
  const ses = await sessionRepository.checkLogin(userName);
  return ses.length > 0 ? isSession : isNotSession;
};

module.exports = {
  checkLogin,
};
