'use strict';

const fs = require(`fs`).promises;
const {Router} = require(`express`);
const chalk = require(`chalk`);

const router = new Router();

const {MOCK_FILE_NAME} = require(`../../constants`);

router.get(`/`, async (req, res) => {
  try {
    const content = await fs.readFile(MOCK_FILE_NAME);
    const categoriesArray = JSON.parse(content);
    let categoriesList = ``;
    categoriesArray.map((el) => (categoriesList += el.category.join(`, `)));
    res.send(categoriesList);
  } catch (err) {
    console.error(chalk.red(err));
    res.send([]);
  }
});

module.exports = router;
