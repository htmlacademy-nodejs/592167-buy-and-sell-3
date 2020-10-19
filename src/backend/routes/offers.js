'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`http-status-codes`);
const chalk = require(`chalk`);
const {getLogger} = require(`../logger`);
const logger = getLogger();

const router = new Router();

const annoucementService = require(`../services/announcement`);
const {DEFAULT} = require(`../../constants`);


router.get(`/`, async (req, res) => {
  try {
    res.send(await annoucementService.getAll());
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({code: StatusCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
  }
});

router.get(`/my`, async (req, res) => {
  try {
    res.send(await annoucementService.getMyAnnouncements());
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({code: StatusCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
  }
});

router.get(`/newestAnnouncements`, async (req, res) => {
  try {
    res.send(await annoucementService.getTheNewestAnnouncements(DEFAULT.PREVIEW_COUNT));
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({code: StatusCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
  }
});

router.get(`/mostDiscussed`, async (req, res) => {
  try {
    res.send(await annoucementService.getMostDiscussed(DEFAULT.PREVIEW_COUNT));
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({code: StatusCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
  }
});

router.post(`/add`, async (req, res) => {
  try {
    res.send(await annoucementService.create(req.body));
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
