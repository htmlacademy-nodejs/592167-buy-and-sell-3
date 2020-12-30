'use strict';

const axios = require(`axios`);
const {BACKEND_URL} = require(`../constants`);

module.exports = () => (
  async (req, res, next) => {
    if (req.session) {
      try {
        if (req.session.isLogged) {
          await axios.post(`${BACKEND_URL}/api/session/check-login`, {
            username: req.session.username,
          });
        }
        next();
      } catch (err) {
        req.session.destroy();
        res.redirect(req.originalUrl);
      }
    }
  }
);
