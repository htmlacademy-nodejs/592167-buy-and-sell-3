'use strict';

const {db} = require(`../db/db-connect`);

const add = async (user) => {
  console.log(user);
  return db.User.create(user);
};

module.exports = {
  add,
};
