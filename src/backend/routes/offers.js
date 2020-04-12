'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);

const router = new Router();

const commentService = require(`../services/comment`);
const annoucementService = require(`../services/announcement`);
const {AnnouncementNotFoundError, CommentNotFoundError} = require(`../errors/errors`);


router.get(`/`, async (req, res) => {
  try {
    res.send(annoucementService.getAll());
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).send({code: 500, message: `Internal service error`});
  }
});

router.get(`/:offerId`, async (req, res) => {
  try {
    res.send(annoucementService.getById(req.params.offerId));
  } catch (err) {
    console.error(chalk.red(err));
    if (err instanceof AnnouncementNotFoundError) {
      res.status(410).send({code: 410, message: err.message});
    } else {
      res.status(500).send({code: 500, message: `Internal service error`});
    }
  }
});

router.post(`/`, (req, res) => {
  if (Object.keys(req.body).length !== 6) {
    res.status(400).send({code: 1, message: `Переданы не все поля для нового объявления.`});
  } else {
    const id = annoucementService.create(req.body);
    res.status(201).send({id});
  }
});

router.put(`/:offerId`, (req, res) => {
  if (Object.keys(req.body).length !== 6) {
    res.status(400).send({code: 1, message: `Переданы не все поля для нового объявления.`});
  } else {
    annoucementService.update(req.body, req.params.offerId);
    res.status(201).end();
  }
});

router.delete(`/:offerId`, (req, res) => {
  try {
    annoucementService.remove(req.params.offerId);
    res.status(204).end();
  } catch (err) {
    console.error(chalk.red(err.code, err.message));
    if (err instanceof AnnouncementNotFoundError) {
      res.status(410).send({code: 410, message: err.message});
    } else {
      res.status(500).send({code: 500, message: `Internal service error`});
    }
  }
});

router.get(`/:offerId/comments`, async (req, res) => {
  try {
    res.send(commentService.getByAnnouncementId(req.params.offerId));
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).send({code: 500, message: `Internal service error`});
  }
});

router.delete(`/:offerId/comments/:commentId`, (req, res) => {
  try {
    commentService.remove(req.params.offerId, req.params.commentId);
    res.status(204).end();
  } catch (err) {
    console.error(chalk.red(err.code, err.message));
    if (err instanceof CommentNotFoundError) {
      res.status(410).send({code: 410, message: err.message});
    } else {
      res.status(500).send({code: 500, message: `Internal service error`});
    }
  }
});

router.post(`/:offerId/comments`, (req, res) => {
  if (Object.keys(req.body).length !== 1) {
    res.status(400).send({code: 2, message: `Переданы не все поля для нового комментария.`});
  } else {
    commentService.add(req.body, req.params.offerId);
    res.status(201).end();
  }
});


module.exports = router;
