'use strict';

const usersRepository = require(`../repositories/users`);
const bcrypt = require(`bcrypt`);
const salt = 10;


const add = async (user) => {
  try {
    user.password = await bcrypt.hash(user.password, salt);
    return await usersRepository.add(user);
  } catch (err) {
    return err;
  }
};

module.exports = {
  add
};
