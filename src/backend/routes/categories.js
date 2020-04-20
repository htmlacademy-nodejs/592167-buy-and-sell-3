'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);
const {getLogger} = require(`../logger`);
const logger = getLogger();

const categoriesService = require(`../services/categories`);
const {HttpCode} = require(`../../constants`);

const router = new Router();

router.get(`/`, async (req, res) => {
  try {
    res.send(categoriesService.getCategories());
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(HttpCode.INTERNAL_SERVER_ERROR).send({code: HttpCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
  }
});

module.exports = router;
