'use strict';

const {Router} = require(`express`);
const router = new Router();

const axios = require(`axios`);
const {BACKEND_URL} = require(`../../constants`);

const MAX_ANNOUNCEMENTS_COMMENTS = 3;


router.get(`/`, async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/offers/my`);
    const announcements = response.data;
    res.render(`my-tickets`, {announcements});
  } catch (err) {
    res.render(`500`, {err});
  }
});

router.get(`/comments`, async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/offers`);
    const announcements = response.data;
    const amountOfAnnouncements = Math.min(MAX_ANNOUNCEMENTS_COMMENTS, announcements.length);
    const commentsOnAnnouncements = announcements.slice(0, amountOfAnnouncements);
    const firstNAnnouncements = commentsOnAnnouncements.map((it) => ({
      title: it.title,
      type: it.type,
      sum: it.sum,
      comments: it.comments
    }));
    res.render(`comments`, {firstNAnnouncements});
  } catch (err) {
    res.render(`500`, {err});
  }
});


module.exports = router;
