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

const checkUserPassword = async (email, password) => {
  console.log(password);
  const user = await usersRepository.getUserPassword(email);
  console.log(user.dataValues.password);
  return await bcrypt.compare(password, user.dataValues.password);
};

module.exports = {
  add,
  checkUserPassword,
};
