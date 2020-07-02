'use strict';

const fs = require(`fs`).promises;
const {getLogger} = require(`../backend/logger`);
const logger = getLogger();

const {getRandomInit, shuffle} = require(`../utils`);

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;

const DEFAULT_COUNT = 1;
const FILE_NAME_FILL_DATABASE = `fill-db.sql`;

const Description = {
  MIN: 1,
  MAX: 5,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const Categories = {
  MIN: 1,
  MAX: 5,
};


const addCategories = (countAnnouncements) => {
  let categories = `\n\n-- Добавляет связи между объявлениями и категориями
insert into announcements_to_categories values `;
  for (let i = 1; i <= countAnnouncements; i++) {
    const countCategories = getRandomInit(Categories.MIN, Categories.MAX);
    for (let j = 1; j <= countCategories; j++) {
      categories += `(${i}, ${j})`;
      categories += `${(i === countAnnouncements && j === countCategories) ? `;` : `,`}\n`;
    }
  }

  return categories;
};

const addImages = (countAnnouncements) => {
  let images = `\n-- Добавляет картинки
insert into images values `;
  for (let i = 1; i <= countAnnouncements; i++) {
    images += `(default, ${i}, 'image${i}')`;
    images += `${i === countAnnouncements ? `;` : `,`}\n`;
  }

  return images;
};

const addComments = (countAnnouncements) => {
  let comments = `\n-- Добавляет комментарии
insert into comments values `;
  for (let i = 1; i <= countAnnouncements; i++) {
    comments += `(default, ${i}, 2, 'comment text${i}')`;
    comments += `${i === countAnnouncements ? `;` : `,`}\n`;
  }

  return comments;
};

const writeDataToFile = async (fileName, content) => {
  try {
    await fs.writeFile(fileName, content);
    return logger.info(`Operation success. File created.`);
  } catch (err) {
    return logger.error(`Can't write data to file ${err.message()}`);
  }
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return content.split(`\n`);
  } catch (err) {
    logger.error(err.message());
    return [];
  }
};



const generateAnnouncements = (countAnnouncements, titles, sentences) => {
  let announcementList = ``;

  announcementList += `-- Добавляет типы объявлений
insert into types values (default, 'Купить'),
                         (default, 'Продать');

-- Добавляет пользователей
insert into users values (default, 'Иванов', 'Иван', 'my@mail.ru', '123455'),
                         (default, 'Петров', 'Петр', 'petrov@gmail.com', '34523'),
                         (default, 'Сидоров', 'Илья', 'sidorov.iliya@yahoo.com', 'I8e#8d');

-- Добавляет категории
insert into categories values (default, 'Разное'),
                              (default, 'Журналы'),
                              (default, 'Программирование'),
                              (default, 'Психология'),
                              (default, 'Искусство');

-- Добавляет объявления`;

  for (let i = 0; i < countAnnouncements; i++) {
    if (announcementList.length > 0) {
      announcementList += `\n`;
    }
    const title = titles[getRandomInit(0, titles.length - 2)];
    const description = shuffle(sentences).slice(0, getRandomInit(Description.MIN, Description.MAX)).join(` `);
    const sum = getRandomInit(SumRestrict.MIN, SumRestrict.MAX);
    announcementList += `insert into announcements values (
      default,
      '${title}',
      '${description}',
      ${sum},
      1,
      1);`;
  }

  announcementList += addCategories(countAnnouncements);
  announcementList += addImages(countAnnouncements);
  announcementList += addComments(countAnnouncements);


  return announcementList;
};

module.exports = {
  name: `--fill`,
  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);

    const [count] = args;
    const countAnnouncements = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = generateAnnouncements(countAnnouncements, titles, sentences);
    await writeDataToFile(FILE_NAME_FILL_DATABASE, content);
  }
};
