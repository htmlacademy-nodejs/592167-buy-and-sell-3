'use strict';

module.exports = (schema, template) => (
  async (req, res, next) => {
    // const {body} = req;
    console.log(req.body);
    const body2 = {
      userName: `Иванов Иван@`,
      email: `safd@dfs.de`,
      password: `123534345`,
      repeat: `123534345`,
    };
    await schema.validateAsync(body2, {abortEarly: false})
      .then(() => next())
      .catch((err) => {
        console.log(req.file.filename);
        const {details} = err;
        res.render(template, {errorMessages: details.map((errorDescription) => errorDescription.message)});
        return;
      });
  }
);
