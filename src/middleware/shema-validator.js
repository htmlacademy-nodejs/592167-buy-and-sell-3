'use strict';

const fs = require(`fs`);

module.exports = (schema, template) => (
  async (req, res, next) => {
    const {body} = req;

    const newUser = {
      userName: body[`user-name`],
      email: body[`user-email`],
      password: body[`user-password`],
      repeat: body[`user-password-again`],
    };
    await schema.validateAsync(newUser, {abortEarly: false})
      .then((response) => {
        req.user = response;
        req.user.avatar = req.file !== undefined ? req.file.filename : ``;
        return next();
      })
      .catch((err) => {
        if (req.file !== undefined) {
          fs.unlinkSync(`${__dirname}/../static/upload/${req.file.filename}`);
        }
        const {details} = err;
        res.render(template, {errorMessages: details.map((errorDescription) => errorDescription.message)});
        return;
      });
  }
);
