'use strict';

const {Router} = require(`express`);
const router = new Router();

const {getLogger} = require(`../logger`);
const logger = getLogger();

const {StatusCodes} = require(`http-status-codes`);

const sessionServices = require(`../services/session`);

router.post(`/login`, async (req, res) => {
  const {body} = req;
  req.session.isLogged = true;
  req.session.username = body[`user-email`];
  res.send(req.session);
});

router.post(`/check-login`, async (req, res) => {
  try {
    const isSession = await sessionServices.checkLogin(req.body.username);
    if (isSession) {
      res.status(StatusCodes.OK).send({
        code: StatusCodes.OK,
        message: `OK`
      });
    } else {
      res.status(StatusCodes.UNAUTHORIZED).send({
        code: StatusCodes.UNAUTHORIZED,
        message: `user unauthorized`
      });
    }
  } catch (err) {
    logger.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

module.exports = router;
