'use strict';

const Sequelize = require(`sequelize`);
require(`dotenv`).config();

const {getLogger} = require(`../logger`);
const logger = getLogger();

const sequelize = new Sequelize(`${process.env.DB_NAME}`, `${process.env.DB_USER}`,
    `${process.env.USER_PASSWORD}`,
    {
      host: `${process.env.DB_HOST}`,
      dialect: `${process.env.DIALECT}`,
      logging: (msg) => logger.info(msg),
    }
);

const testConnect = async () => {
  try {
    logger.info(`Устанавливаем соединение с сервером`);
    await sequelize.authenticate();
    logger.info(`Соединение с сервером установлено!`);
  } catch (err) {
    console.error(`Не удалось установить соединение по причине: ${err}`);
    logger.error(`Не удалось установить соединение по причине: ${err}`);
    process.exit();
  }
};

module.exports = {
  testConnect,
};
