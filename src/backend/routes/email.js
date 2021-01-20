'use strict';

const {Router} = require(`express`);
const router = new Router();

const emailServices = require(`../services/email`);

router.get(`/check`, async (req, res) => {
  res.send(await emailServices.checkEmail(req.query.email));
});

module.exports = router;
