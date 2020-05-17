'use strict';

const {Router} = require(`express`);
const router = new Router();

const request = require(`request-promise-native`);
const {MOCK_URL} = require(`../../constants`);

const MAX_ANNOUNCEMENTS_COMMENTS = 3;

router.get(`/`, (req, res) => {
  request(`${MOCK_URL}/api/offers`, {json: true})
    .then((content) => console.log(content));
  res.send(req.originalUrl);
});
router.get(`/comments`, (req, res) => {
  request(`${MOCK_URL}/api/offers`, {json: true})
    .then((announcements) => {
      const commentsOnAnnouncements = announcements.length > MAX_ANNOUNCEMENTS_COMMENTS ? announcements.slice(0, MAX_ANNOUNCEMENTS_COMMENTS) : announcements;
      const comments = commentsOnAnnouncements.map((it) => it.comments);
      console.log(comments);
    });
  console.log(`We are here`);
  res.send(req.originalUrl);
});

module.exports = router;
