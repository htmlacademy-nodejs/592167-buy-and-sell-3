'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);

const router = new Router();

const commentService = require(`../control-units/comment`);
const annoucementService = require(`../control-units/announcement`);
const errors = require(`../errors/errors`);


router.get(`/`, async (req, res) => {
  try {
    res.send(annoucementService.getContent());
  } catch (err) {
    console.error(chalk.red(err));
    res.send([]);
  }
});

router.get(`/:offerId`, async (req, res) => {
  try {
    res.send(annoucementService.getContentById(req.params.offerId));
  } catch (err) {
    console.error(chalk.red(err));
    res.send([]);
  }
});

router.post(`/`, (req, res) => {
  if (Object.keys(req.body).length !== 6) {
    res.status(400).send({error: `Переданы не все поля для нового объявления.`});
  } else {
    const newId = annoucementService.add(req.body);
    res.status(201).send(`Новое заявление сохранено с id=${newId}.`);
  }
});

router.put(`/:offerId`, (req, res) => {
  if (Object.keys(req.body).length !== 6) {
    res.status(400).send({error: `Переданы не все поля для нового объявления.`});
  } else {
    annoucementService.change(req.body, req.params.offerId);
    res.status(201).send(`Данные успешно изменены.`);
  }
});

router.delete(`/:offerId`, (req, res) => {
  try {
    annoucementService.remove(req.params.offerId);
    res.status(204).send(``);
  } catch (err) {
    console.error(chalk.red(err.code, err.message));
    if (err instanceof errors.AnnouncementNotFoundError) {
      res.status(410).send({code: 410, message: `announcement with id ${req.params.offerId} isn't found`});
    } else {
      res.status(500).send({code: 500, message: `Internal service error`});
    }
  }
});

router.get(`/:offerId/comments`, async (req, res) => {
  try {
    res.send(commentService.getContent(req.params.offerId));
  } catch (err) {
    console.error(chalk.red(err));
    res.send([]);
  }
});

router.delete(`/:offerId/comments/:commentId`, (req, res) => {
  try {
    commentService.remove(req.params.offerId, req.params.commentId);
    res.status(204).send(``);
  } catch (err) {
    console.error(chalk.red(err.code, err.message));
    if (err instanceof errors.CommentNotFoundError) {
      res.status(410).send({code: 410, message: `comment with id ${req.params.commentId} isn't found`});
    } else {
      res.status(500).send({code: 500, message: `Internal service error`});
    }
  }
});

router.put(`/:offerId/comments`, (req, res) => {
  if (Object.keys(req.body).length !== 1) {
    res.status(400).send({error: `Переданы не все поля для нового комментария.`});
  } else {
    const commentId = commentService.add(req.body, req.params.offerId);
    res.status(201).send(`Новый комментарий сохранен с id=${commentId}.`);
  }
});


module.exports = router;
