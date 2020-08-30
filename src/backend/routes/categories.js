'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`http-status-codes`);
const chalk = require(`chalk`);
const {getLogger} = require(`../logger`);
const logger = getLogger();

const categoriesService = require(`../services/categories`);

const router = new Router();

router.get(`/`, async (req, res) => {
  try {
    res.send(await categoriesService.getCategories());
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({code: StatusCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
  }
});

router.get(`/:categoryId`, async (req, res) => {
  try {
    res.send(await categoriesService.getAnnouncementsOfCategory(req.params.categoryId, req.query));
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({code: StatusCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
  }
});

module.exports = router;
