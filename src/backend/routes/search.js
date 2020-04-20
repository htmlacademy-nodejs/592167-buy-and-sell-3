'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);
const {getLogger} = require(`../logger`);
const logger = getLogger();

const router = new Router();

const announcementService = require(`../services/announcement`);
const {HttpCode} = require(`../../constants`);

router.get(`/`, (req, res) => {
  try {
    res.send(announcementService.search(req.query.query));
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(HttpCode.INTERNAL_SERVER_ERROR).send({code: HttpCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
  }
});

module.exports = router;
