'use strict';

const axios = require(`axios`);
const {BACKEND_URL, TEMPLATE, LOGIN_MESSAGES} = require(`../constants`);

module.exports = () => (
  async (req, res, next) => {
    const {body} = req;
    const userInfo = {
      email: body[`user-email`],
      password: body[`user-password`],
    };
    try {
      await axios.post(`${BACKEND_URL}/api/user/check-password`, userInfo);
      next();
    } catch (err) {
      res.render(TEMPLATE.LOGIN, {
        errorMessages: [LOGIN_MESSAGES.USER_PASSWORD_IS_BAD],
      });
      return;
    }
  }
);
