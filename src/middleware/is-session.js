'use strict';

module.exports = () => (
  (req, res, next) => {
    if (req.session.isLogged) {
      next();
    } else {
      res.redirect(`/login`);
    }
  }
);
