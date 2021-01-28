'use strict';

const {Router} = require(`express`);
const router = new Router();
const {StatusCodes} = require(`http-status-codes`);

const {getLogger} = require(`../logger`);
const logger = getLogger();

const usersServices = require(`../services/users`);


router.post(`/`, async (req, res) => {
  try {
    await usersServices.add(req.body);
    res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: `OK`,
    });
  } catch (err) {
    logger.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

router.post(`/check-password`, async (req, res) => {
  const {email, password} = req.body;
  try {
    const checkPassword = await usersServices.checkUserPassword(email, password);
    console.log(checkPassword);
    res.sendStatus(checkPassword ? StatusCodes.OK : StatusCodes.UNAUTHORIZED);
  } catch (err) {
    logger.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

module.exports = router;
