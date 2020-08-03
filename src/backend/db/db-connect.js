'use strict';

const Sequelize = require(`sequelize`);
require(`dotenv`).config();

const {getLogger} = require(`../logger`);
const logger = getLogger();

const {types, users, categories} = require(`./mocks`);

const sequelize = new Sequelize(`${process.env.DB_NAME}`, `${process.env.DB_USER}`,
    `${process.env.USER_PASSWORD}`,
    {
      host: `${process.env.DB_HOST}`,
      dialect: `${process.env.DIALECT}`,
    }
);

const Announcement = require(`./models/announcement`)(sequelize, Sequelize);
const AnnouncementsToCategory = require(`./models/announcements_to_category`)(sequelize, Sequelize);
const Category = require(`./models/category`)(sequelize, Sequelize);
const Comment = require(`./models/comment`)(sequelize, Sequelize);
const Image = require(`./models/image`)(sequelize, Sequelize);
const Type = require(`./models/type`)(sequelize, Sequelize);
const User = require(`./models/user`)(sequelize, Sequelize);

// Связь между таблицами announcements и types
Type.hasMany(Announcement, {
  as: `announcements`,
  foreignKey: `typeId`,
});

// Связь между таблицами announcements и users
User.hasMany(Announcement, {
  as: `announcements`,
  foreignKey: `userId`,
});


const initDb = async () => {
  await sequelize.sync({ force: true });
  console.log(`Структура БД успешно создана`);

  await Type.bulkCreate(types);
  await User.bulkCreate(users);
  await Category.bulkCreate(categories);
}

const addData = async () => {
  try {
    return await Announcement.create({
      title: `some title`,
      description: `some description`,
      sum: 5345,
      userId: 3,
      typeId: 1,
    });
  } catch (err) {
    return err.message;
  }
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
  db: {
    Announcement,
    AnnouncementsToCategory,
    Category,
    Comment,
    Image,
    Type,
    User,
  },
  testConnect,
  initDb,
  addData,
  sequelize,
};
