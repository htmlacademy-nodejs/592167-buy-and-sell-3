'use strict';

const {db} = require(`../db/db-connect`);

const add = async (user) => {
  console.log(user);
  return db.User.create(user);
};

const getUserPassword = async (email) => db.User.findOne({
  attributes: [`password`],
  where: {
    email,
  },
});

module.exports = {
  add,
  getUserPassword,
};
