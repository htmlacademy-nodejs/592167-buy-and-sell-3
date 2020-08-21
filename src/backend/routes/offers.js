'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);
const {getLogger} = require(`../logger`);
const logger = getLogger();

const router = new Router();

const annoucementService = require(`../services/announcement`);
const {
  INTERNAL_SERVER_ERROR,
} = require(`../../constants`).HttpCode;


router.get(`/`, async (req, res) => {
  try {
    res.send(await annoucementService.getAll());
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(INTERNAL_SERVER_ERROR).send({code: INTERNAL_SERVER_ERROR, message: `Internal service error`});
  }
});

router.get(`/my`, async (req, res) => {
  try {
    res.send(await annoucementService.getMyAnnouncements());
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(INTERNAL_SERVER_ERROR).send({code: INTERNAL_SERVER_ERROR, message: `Internal service error`});
  }
});

router.get(`/newestAnnouncements`, async (req, res) => {
  try {
    res.send(await annoucementService.getTheNewestAnnouncements());
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(INTERNAL_SERVER_ERROR).send({code: INTERNAL_SERVER_ERROR, message: `Internal service error`});
  }
});

router.get(`/mostDiscussed`, async (req, res) => {
  try {
    res.send(await annoucementService.getMostDiscussed());
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(INTERNAL_SERVER_ERROR).send({code: INTERNAL_SERVER_ERROR, message: `Internal service error`});
  }
});


module.exports = router;
