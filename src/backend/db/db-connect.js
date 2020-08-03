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
    }
);

const Announcements = require(`./models/announcement`)(sequelize, Sequelize);
const AnnouncementsToCategories = require(`./models/announcements_to_category`)(sequelize, Sequelize);
const Categories = require(`./models/category`)(sequelize, Sequelize);
const Comments = require(`./models/comment`)(sequelize, Sequelize);
const Images = require(`./models/image`)(sequelize, Sequelize);
const Types = require(`./models/type`)(sequelize, Sequelize);
const Users = require(`./models/user`)(sequelize, Sequelize);

const initDb = async () => {
  await sequelize.sync({ force: true });
  console.log(`Структура БД успешно создана`);
}

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
  initDb,
};
