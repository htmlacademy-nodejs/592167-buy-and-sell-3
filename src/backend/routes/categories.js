'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);
const {getLogger} = require(`../logger`);
const logger = getLogger();

const categoriesService = require(`../services/categories`);
const {INTERNAL_SERVER_ERROR} = require(`../../constants`).HttpCode;

const router = new Router();

router.get(`/`, async (req, res) => {
  try {
    res.send(await categoriesService.getCategories());
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(INTERNAL_SERVER_ERROR).send({code: INTERNAL_SERVER_ERROR, message: `Internal service error`});
  }
});

// router.get(`/:categoryId`, async (req, res) => {
//   try {
//     res.send(categoriesService.getAnnouncementsOfCategory)
//   }
// });

module.exports = router;
