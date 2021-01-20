'use strict';

const axios = require(`axios`);
const {BACKEND_URL, TEMPLATE, REGISTER_MESSAGE} = require(`../constants`);

module.exports = () => (
  async (req, res, next) => {
    const resCheckEmail = await axios.get(`${BACKEND_URL}/api/email/check?email=${req.user.email}`);
    const {userRegister} = resCheckEmail.data;
    if (!userRegister) {
      return next();
    } else {
      res.render(TEMPLATE.REGISTER, {
        errorMessages: [REGISTER_MESSAGE.USER_ALREADY_REGISTER],
      });
      // eslint-disable-next-line consistent-return
      return;
    }
  }
);
