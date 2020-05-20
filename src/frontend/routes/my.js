'use strict';

const {Router} = require(`express`);
const router = new Router();

const request = require(`request-promise-native`);
const {MOCK_URL} = require(`../../constants`);

const MAX_ANNOUNCEMENTS_COMMENTS = 3;

router.get(`/`, (req, res) => {
  request(`${MOCK_URL}/api/offers`, {json: true})
    .then((announcements) => res.render(`my-tickets`, {announcements}))
    .catch((err) => res.render(`500`, {err}));
});
router.get(`/comments`, (req, res) => {
  request(`${MOCK_URL}/api/offers`, {json: true})
    .then((announcements) => {
      const commentsOnAnnouncements = announcements.length > MAX_ANNOUNCEMENTS_COMMENTS ? announcements.slice(0, MAX_ANNOUNCEMENTS_COMMENTS) : announcements;
      const comments = commentsOnAnnouncements.map((it) => it.comments);
    });
  res.render(`comments`);
  // res.send(req.originalUrl);
});

module.exports = router;
