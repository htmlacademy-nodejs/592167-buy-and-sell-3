'use strict';

const Sequelize = require(`sequelize`);
const Operator = Sequelize.Op;
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

const Announcement = require(`./models/announcement`)(sequelize, Sequelize);
const AnnouncementsToCategory = require(`./models/announcements_to_category`)(sequelize, Sequelize);
const Category = require(`./models/category`)(sequelize, Sequelize);
const Comment = require(`./models/comment`)(sequelize, Sequelize);
const Image = require(`./models/image`)(sequelize, Sequelize);
const Type = require(`./models/type`)(sequelize, Sequelize);
const User = require(`./models/user`)(sequelize, Sequelize);

Announcement.belongsTo(Type, {
  foreignKey: `typeId`,
});

// Связь между таблицами announcements и users
Announcement.belongsTo(User, {
  foreignKey: `userId`,
});

// Связь между таблицами comments и users
Comment.belongsTo(User, {
  foreignKey: `userId`,
});

// Связь между таблицами comments и announcements
Comment.belongsTo(Announcement, {
  foreignKey: `announcementId`,
});

// Связь между таблицами images и announcements
Image.belongsTo(Announcement, {
  foreignKey: `announcementId`,
});

// Связь между таблицами categories и announcements
Category.belongsToMany(Announcement, {through: `AnnouncementsToCategories`});
Announcement.belongsToMany(Category, {through: `AnnouncementsToCategories`});


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
};

const connectDb = async () => {
  try {
    logger.info(`Устанавливаем соединение с сервером`);
    await sequelize.authenticate();
    logger.info(`Соединение с сервером установлено!`);
  } catch (err) {
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
  connectDb,
  addData,
  sequelize,
  Sequelize,
  Operator,
};
