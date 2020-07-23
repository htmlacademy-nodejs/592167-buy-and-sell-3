'use strict';

const Sequelize = require(`sequelize`);

require(`dotenv`).config();

const sequelize = new Sequelize(`${process.env.DB_NAME}`, `${process.env.DB_USER}`,
  `${process.env.USER_PASSWORD}`,
  {
  host: `${process.env.DB_HOST}`,
  dialect: `${process.env.DIALECT}`,
});

const testConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Соединение с сервером установлено!`);
  } catch (err) {
    console.error(`Не удалось установить соединение по причине: ${err}`);
    process.exit();
  }
};

module.exports = {
  testConnect,
}
