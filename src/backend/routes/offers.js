'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);
const {getLogger} = require(`../logger`);
const logger = getLogger();

const router = new Router();

const commentService = require(`../services/comment`);
const annoucementService = require(`../services/announcement`);
const {AnnouncementNotFoundError, CommentNotFoundError} = require(`../errors/errors`);
const {HttpCode} = require(`../../constants`);


router.get(`/`, async (req, res) => {
  try {
    res.send(annoucementService.getAll());
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(HttpCode.INTERNAL_SERVER_ERROR).send({code: HttpCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
  }
});

router.get(`/:offerId`, async (req, res) => {
  try {
    res.send(annoucementService.getById(req.params.offerId));
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    if (err instanceof AnnouncementNotFoundError) {
      res.status(HttpCode.GONE).send({code: HttpCode.GONE, message: err.message});
    } else {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).send({code: HttpCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
    }
  }
});

router.post(`/`, (req, res) => {
  if (Object.keys(req.body).length !== 6) {
    res.status(HttpCode.BAD_REQUEST).send({code: 1, message: `Переданы не все поля для нового объявления.`});
  } else {
    const id = annoucementService.create(req.body);
    res.status(HttpCode.CREATED).send({id});
  }
});

router.put(`/:offerId`, (req, res) => {
  if (Object.keys(req.body).length !== 6) {
    res.status(HttpCode.BAD_REQUEST).send({code: 1, message: `Переданы не все поля для нового объявления.`});
  } else {
    try {
      const id = annoucementService.update(req.body, req.params.offerId);
      res.status(HttpCode.CREATED).send({id});
    } catch (err) {
      logger.error(chalk.red(err.code, err.message));
      if (err instanceof AnnouncementNotFoundError) {
        res.status(HttpCode.GONE).send({code: HttpCode.GONE, message: err.message});
      } else {
        res.status(HttpCode.INTERNAL_SERVER_ERROR).send({code: HttpCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
      }
    }
  }
});

router.delete(`/:offerId`, (req, res) => {
  try {
    annoucementService.remove(req.params.offerId);
    res.status(HttpCode.NO_CONTENT).end();
  } catch (err) {
    logger.error(chalk.red(err.code, err.message));
    if (err instanceof AnnouncementNotFoundError) {
      res.status(HttpCode.GONE).send({code: HttpCode.GONE, message: err.message});
    } else {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).send({code: HttpCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
    }
  }
});

router.get(`/:offerId/comments`, async (req, res) => {
  try {
    res.send(commentService.getByAnnouncementId(req.params.offerId));
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    if (err instanceof AnnouncementNotFoundError) {
      res.status(HttpCode.GONE).send({code: HttpCode.GONE, message: err.message});
    } else {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).send({code: HttpCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
    }
  }
});

router.delete(`/:offerId/comments/:commentId`, (req, res) => {
  try {
    commentService.remove(req.params.offerId, req.params.commentId);
    res.status(HttpCode.NO_CONTENT).end();
  } catch (err) {
    logger.error(chalk.red(err.code, err.message));
    if (err instanceof CommentNotFoundError) {
      res.status(HttpCode.GONE).send({code: HttpCode.GONE, message: err.message});
    } else {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).send({code: HttpCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
    }
  }
});

router.post(`/:offerId/comments`, (req, res) => {
  if (Object.keys(req.body).length !== 1) {
    res.status(HttpCode.BAD_REQUEST).send({code: 2, message: `Переданы не все поля для нового комментария.`});
  } else {
    commentService.add(req.body, req.params.offerId);
    res.status(HttpCode.CREATED).end();
  }
});


module.exports = router;
