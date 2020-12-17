'use strict';

const usersRepository = require(`../repositories/users`);
const bcrypt = require(`bcrypt`);
const salt = 10;

const userSchema = require(`../validation-schemas/user-schema`);

const add = async (data) => {
  try {
    const user = {
      firstName: data[`user-name`],
      lastName: data[`user-name`],
      email: data[`user-email`],
      password: await bcrypt.hash(data[`user-password`], salt),
      avatar: data.avatar,
    };
    userSchema.validateAsync(user)
      .then(async (response) => {
        return await usersRepository.add(response);
      }).catch((err) => {
        const {details} = err;
        return {
          errorMessages: details.map((errorDescription) => errorDescription.message),
        };
      });
    return await usersRepository.add(user);
  } catch (err) {
    return err;
  }
};

module.exports = {
  add
};
