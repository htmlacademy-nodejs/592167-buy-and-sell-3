'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);
const {getLogger} = require(`../logger`);
const logger = getLogger();

const router = new Router();

const commentService = require(`../services/comment`);
const annoucementService = require(`../services/announcement`);
const {AnnouncementNotFoundError, CommentNotFoundError} = require(`../errors/errors`);
const {
  INTERNAL_SERVER_ERROR,
  GONE,
  BAD_REQUEST,
  CREATED,
  NO_CONTENT
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

router.post(`/`, (req, res) => {
  if (Object.keys(req.body).length !== 6) {
    res.status(BAD_REQUEST).send({code: 1, message: `Send not all params for new announcement.`});
  } else {
    const id = annoucementService.create(req.body);
    res.status(CREATED).send({id});
  }
});

router.put(`/:offerId`, (req, res) => {
  if (Object.keys(req.body).length !== 6) {
    res.status(BAD_REQUEST).send({code: 1, message: `Send not all params for new announcement.`});
  } else {
    try {
      const id = annoucementService.update(req.body, req.params.offerId);
      res.status(CREATED).send({id});
    } catch (err) {
      logger.error(chalk.red(err.code, err.message));
      if (err instanceof AnnouncementNotFoundError) {
        res.status(GONE).send({code: GONE, message: err.message});
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({code: INTERNAL_SERVER_ERROR, message: `Internal service error`});
      }
    }
  }
});

router.delete(`/:offerId`, (req, res) => {
  try {
    annoucementService.remove(req.params.offerId);
    res.status(NO_CONTENT).end();
  } catch (err) {
    logger.error(chalk.red(err.code, err.message));
    if (err instanceof AnnouncementNotFoundError) {
      res.status(GONE).send({code: GONE, message: err.message});
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({code: INTERNAL_SERVER_ERROR, message: `Internal service error`});
    }
  }
});

router.get(`/my/comments`, async (req, res) => {
  try {
    const announcements = await annoucementService.getAnnouncementsForComments(1);
    const announcementsId = announcements.map((el) => el.id);
    const comments = await commentService.getCommentsOnMyAnnouncements(announcementsId);

    const commentsSend = [];
    for (let announcement of announcements) {
      const announcementComments = {
        id: announcement.id,
        title: announcement.title,
        sum: announcement.sum,
        type: announcement[`types.type`],
      };
      announcementComments.comments = comments.filter((it) => it.announcementId === announcement.id);
      commentsSend.push(announcementComments);
    }

    res.send(commentsSend);
  } catch (err) {
    console.log(err);
    logger.error(chalk.red(err));
    if (err instanceof AnnouncementNotFoundError) {
      res.status(GONE).send({code: GONE, message: err.message});
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({code: INTERNAL_SERVER_ERROR, message: `Internal service error`});
    }
  }
});

router.delete(`/:offerId/comments/:commentId`, (req, res) => {
  try {
    commentService.remove(req.params.offerId, req.params.commentId);
    res.status(NO_CONTENT).end();
  } catch (err) {
    logger.error(chalk.red(err.code, err.message));
    if (err instanceof CommentNotFoundError) {
      res.status(GONE).send({code: GONE, message: err.message});
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({code: INTERNAL_SERVER_ERROR, message: `Internal service error`});
    }
  }
});

router.post(`/:offerId/comments`, (req, res) => {
  if (Object.keys(req.body).length !== 1) {
    res.status(BAD_REQUEST).send({code: 2, message: `Send not all params for new comment.`});
  } else {
    try {
      const id = commentService.add(req.body, req.params.offerId);
      res.status(CREATED).send({id});
    } catch (err) {
      logger.error(chalk.red(err));
      if (err instanceof AnnouncementNotFoundError) {
        res.status(GONE).send({code: GONE, message: err.message});
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({code: INTERNAL_SERVER_ERROR, message: `Internal service error`});
      }
    }
  }
});


module.exports = router;
