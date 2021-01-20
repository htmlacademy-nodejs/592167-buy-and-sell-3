'use strict';

const {db} = require(`../db/db-connect`);

const checkEmail = async (email) => db.User.findOne({
  where: {
    email,
  },
});

module.exports = {
  checkEmail,
};
