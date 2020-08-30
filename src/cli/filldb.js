'use strict';

const fs = require(`fs`).promises;

const {sequelize, db, connectDb, Operator} = require(`../backend/db/db-connect`);
const {getLogger} = require(`../backend/logger`);
const logger = getLogger();

const {getRandomInit, shuffle} = require(`../utils`);

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const DEFAULT_COUNT = 1;

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const Description = {
  MIN: 1,
  MAX: 5,
};

const ArticlesToCategories = {
  MIN: 1,
  MAX: 5,
};

const Images = {
  MIN: 1,
  MAX: 16,
};
const Comments = {
  MIN: 0,
  MAX: 5,
};

const Users = {
  MIN: 1,
  MAX: 3,
};

const Types = {
  MIN: 1,
  MAX: 2,
};


const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    logger.error(err.message);
    return [];
  }
};

const getPictureFileName = (num) => {
  return `${num}`.padStart(6, `item00`);
};

const getAnnouncementsToCategories = (countAnnouncement) => {
  const announcementsToCategories = [];
  const categoriesKey = [1, 2, 3, 4, 5];
  for (let i = 1; i <= countAnnouncement; i++) {
    const announcementsToCategory = shuffle(categoriesKey).slice(0, getRandomInit(ArticlesToCategories.MIN, ArticlesToCategories.MAX));
    announcementsToCategories.push(announcementsToCategory);
  }

  return announcementsToCategories;
};

const initDb = async (countAnnouncement, titles, sentences, commentsTemplate) => {
// генерируем моки
  const announcements = [];
  const announcementsToCategories = getAnnouncementsToCategories(countAnnouncement);
  const images = [];
  const comments = [];

  const types = [
    {type: `Куплю`},
    {type: `Продам`},
  ];

  const users = [
    {firstName: `Иванов`, lastName: `Иван`, email: `my@mail.ru`, password: `123455`},
    {firstName: `Петров`, lastName: `Петр`, email: `petrov@gmail.com`, password: `34523`},
    {firstName: `Сидоров`, lastName: `Илья`, email: `sidorov.iliya@yahoo.com`, password: `I8e#8d`},
  ];

  const categories = [
    {category: `Журналы`},
    {category: `Программирование`},
    {category: `Психология`},
    {category: `Искусство`},
    {category: `Моделирование`},
  ];

  for (let i = 1; i <= countAnnouncement; i++) {
    const announcement = {
      title: titles[getRandomInit(0, titles.length - 2)],
      description: shuffle(sentences).slice(0, getRandomInit(Description.MIN, Description.MAX)).join(` `),
      sum: getRandomInit(SumRestrict.MIN, SumRestrict.MAX),
      typeId: getRandomInit(Types.MIN, Types.MAX),
      userId: getRandomInit(Users.MIN, Users.MAX),
    };
    announcements.push(announcement);

    const image = {
      announcementId: i, image: getPictureFileName(getRandomInit(Images.MIN, Images.MAX))
    };
    images.push(image);
  }

  for (let i = 1; i <= countAnnouncement; i++) {
    const countComments = getRandomInit(Comments.MIN, Comments.MAX);
    for (let j = 1; j < countComments; j++) {
      const comment = {
        announcementId: i,
        userId: getRandomInit(Users.MIN, Users.MAX),
        comment: commentsTemplate[getRandomInit(0, commentsTemplate.length - 2)],
      };
      comments.push(comment);
    }
  }


  await sequelize.sync({force: true});
  console.log(`Структура БД успешно создана`);

  await db.Type.bulkCreate(types);
  await db.User.bulkCreate(users);
  await db.Category.bulkCreate(categories);
  await db.Announcement.bulkCreate(announcements);
  await db.Image.bulkCreate(images);
  await db.Comment.bulkCreate(comments);

  for (let i = 0; i < countAnnouncement; i++) {
    const categories = await db.Category.findAll({
      where: {
        id: {
          [Operator.in]: announcementsToCategories[i]
        }
      },
    });

    const announcements = await db.Announcement.findByPk(i + 1);
    await announcements.addCategories(categories);
  }
};


module.exports = {
  name: `--filldb`,
  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const commentsTemplate = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countAnnouncement = Number.parseInt(count, 10) || DEFAULT_COUNT;
    await connectDb();
    await initDb(countAnnouncement, titles, sentences, commentsTemplate);
    sequelize.close();
  }
};
