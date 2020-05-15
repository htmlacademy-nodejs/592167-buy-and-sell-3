'use strict';

const {Router} = require(`express`);
const router = new Router();

const request = require(`request-promise-native`);
const {MOCK_URL} = require(`../../constants`);

router.get(`/`, (req, res) => {
  request(`${MOCK_URL}/api/offers`, {json: true})
    .then((content) => console.log(content));
  res.send(req.originalUrl);
});
router.get(`/comments`, (req, res) => {
  // request(`${MOCK_URL}/api/offers/:offerId/comments`, {json: true})
  //   .then((content) => console.log(content));
  res.send(req.originalUrl);
});

module.exports = router;
