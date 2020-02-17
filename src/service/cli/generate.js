'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {getRandomInit, shuffle} = require(`../../utils`);
const {ExitCode, MOCK_FILE_NAME} = require(`../../constants`);

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

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

const writeDataToFile = async (fileName, content) => {
  try {
    await fs.writeFile(fileName, content);
    return console.info(chalk.green(`Operation success. File created.`));
  } catch (err) {
    return console.error(chalk.red(`Can't write data to file...`));
  }
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const getPictureFileName = (num) => {
  const countPicture = num < 10 ? `0${num}` : `${num}`;
  return `item${countPicture}.jpg`;
};

const generateOffers = (count, titles, categories, sentences) => (
  Array(count).fill({}).map(() => ({
    category: [categories[getRandomInit(0, categories.length - 1)]],
    description: shuffle(sentences).slice(0, getRandomInit(Description.MIN, Description.MAX)).join(` `),
    picture: getPictureFileName(getRandomInit(PictureRestrict.MIN, PictureRestrict.MAX)),
    title: titles[getRandomInit(0, titles.length - 1)],
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomInit(SumRestrict.MIN, SumRestrict.MAX),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer > MAX_OFFER) {
      console.error(chalk.red(`Не больше 1000 объявлений`));
      process.exit(ExitCode.error);
    }
    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences));
    await writeDataToFile(MOCK_FILE_NAME, content);
  }
};
