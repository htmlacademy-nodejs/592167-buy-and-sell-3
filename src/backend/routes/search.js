'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);
const {getLogger} = require(`../logger`);
const logger = getLogger();

const router = new Router();

const announcementService = require(`../services/announcement`);
const {INTERNAL_SERVER_ERROR} = require(`../../constants`).HttpCode;

router.get(`/`, async (req, res) => {
  try {
    res.send(await announcementService.search(req.query.query));
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(INTERNAL_SERVER_ERROR).send({code: INTERNAL_SERVER_ERROR, message: `Internal service error`});
  }
});

module.exports = router;
