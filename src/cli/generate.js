'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {getLogger} = require(`../backend/logger`);
const logger = getLogger();

const {getRandomInit, shuffle, getNewId} = require(`../utils`);
const {ExitCode, MOCK_FILE_NAME} = require(`../constants`);

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const DEFAULT_COUNT = 1;
const MAX_OFFER = 1000;

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const Description = {
  MIN: 1,
  MAX: 5,
};

const Comment = {
  MIN: 0,
  MAX: 8,
};

const writeDataToFile = async (fileName, content) => {
  try {
    await fs.writeFile(fileName, content);
    return logger.info(chalk.green(`Operation success. File created.`));
  } catch (err) {
    return logger.error(chalk.red(`Can't write data to file...`));
  }
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    logger.error(chalk.red(err));
    return [];
  }
};

const getPictureFileName = (num) => {
  const countPicture = num < 10 ? `0${num}` : `${num}`;
  return `item${countPicture}.jpg`;
};

const getComments = (countComments, comments) => {
  return Array(countComments).fill({}).map(() => ({
    id: getNewId(),
    text: shuffle(comments).slice(0, getRandomInit(Comment.MIN, Comment.MAX)).join(` `),
  }));
};

const getCategories = (categories) => {
  const Categories = {
    MIN: 0,
    MAX: categories.length - 1,
  };
  return Array(getRandomInit(Categories.MIN + 1, Categories.MAX))
    .fill(`1`).map(() => categories[getRandomInit(Categories.MIN + 1, Categories.MAX)]);
};

const generateOffers = (count, titles, categories, sentences, comments) => (
  Array(count).fill({}).map(() => ({
    id: getNewId(),
    categories: getCategories(categories),
    description: shuffle(sentences).slice(0, getRandomInit(Description.MIN, Description.MAX)).join(` `),
    picture: getPictureFileName(getRandomInit(PictureRestrict.MIN, PictureRestrict.MAX)),
    title: titles[getRandomInit(0, titles.length - 1)],
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomInit(SumRestrict.MIN, SumRestrict.MAX),
    comments: getComments(getRandomInit(Comment.MIN, Comment.MAX), comments),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    categories.pop();
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer > MAX_OFFER) {
      logger.error(chalk.red(`Не больше 1000 объявлений`));
      process.exit(ExitCode.error);
    }
    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences, comments));
    await writeDataToFile(MOCK_FILE_NAME, content);
  }
};
