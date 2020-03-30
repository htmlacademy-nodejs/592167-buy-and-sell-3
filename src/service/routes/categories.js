'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);
const categoriesService = require(`../control-units/categories`);

const router = new Router();

router.get(`/`, async (req, res) => {
  try {
    res.send(categoriesService.getCategories());
  } catch (err) {
    console.error(chalk.red(err));
    res.send([]);
  }
});

module.exports = router;
