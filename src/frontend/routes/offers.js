'use strict';

const {Router} = require(`express`);
const router = new Router();

const request = require(`request-promise-native`);
const {MOCK_URL} = require(`../../constants`);

router.get(`/category`, (req, res) => {
  res.render(`category`);
});
router.get(`/category/:id`, (req, res) => {
  res.render(`category`);
});
router.get(`/add`, (req, res) => res.render(`new-ticket`));
router.post(`/add`, (req, res) => {
  console.log(req.body, res.body);
});
router.get(`/edit/:id`, (req, res) => {
  request(`${MOCK_URL}/api/offers/${req.params.id}`, {json: true})
    .then((announcement) => res.render(`ticket-edit`, {announcement}));
});
router.get(`/:id`, (req, res) => res.send(req.originalUrl));


module.exports = router;
