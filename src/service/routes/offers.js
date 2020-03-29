'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);

const router = new Router();

const commentService = require(`../control-units/comment`);
const annoucementService = require(`../control-units/announcement`);


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
    res.send(annoucementService.add(req.body));
  }
});

router.put(`/:offerId`, (req, res) => {
  if (Object.keys(req.body).length !== 6) {
    res.status(400).send({error: `Переданы не все поля для нового объявления.`});
  } else {
    res.send(annoucementService.change(req.body, req.params.offerId));
  }
});

router.delete(`/:offerId`, (req, res) => {
  try {
    res.send(annoucementService.remove(req.params.offerId));
  } catch (err) {
    console.error(chalk.red(err));
    res.send([]);
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
    res.send(commentService.remove(req.params.offerId, req.params.commentId));
  } catch (err) {
    console.error(chalk.red(err));
    res.send([]);
  }
});

router.put(`/:offerId/comments`, (req, res) => {
  if (Object.keys(req.body).length !== 1) {
    res.status(400).send({error: `Переданы не все поля для нового комментария.`});
  } else {
    res.send(commentService.add(req.body, req.params.offerId));
  }
});


module.exports = router;
