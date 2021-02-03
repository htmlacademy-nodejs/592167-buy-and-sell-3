'use strict';

const axios = require(`axios`);
const {BACKEND_URL, LOGIN_MESSAGES} = require(`../constants`);

module.exports = (template) => (
  async (req, res, next) => {
    const {body} = req;
    const user = {
      email: body[`user-email`],
    };
    const resCheckEmail = await axios.get(`${BACKEND_URL}/api/email/check?email=${user.email}`);
    const {userRegister} = resCheckEmail.data;
    if (userRegister) {
      return next();
    } else {
      res.render(template, {
        errorMessages: [LOGIN_MESSAGES.USER_NOT_REGISTER],
      });
      // eslint-disable-next-line consistent-return
      return;
    }
  }
);
