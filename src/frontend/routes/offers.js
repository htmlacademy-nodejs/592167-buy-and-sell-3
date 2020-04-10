'use strict';

const {Router} = require(`express`);
const router = new Router();

router.get(`/category`, (req, res) => {
  res.render(`category`);
});
router.get(`/category/:id`, (req, res) => {
  res.render(`category`);
});
router.get(`/add`, (req, res) => res.send(req.originalUrl));
router.get(`/edit/:id`, (req, res) => res.send(req.originalUrl));
router.get(`/:id`, (req, res) => res.send(req.originalUrl));

module.exports = router;
