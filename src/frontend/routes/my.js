'use strict';

const {Router} = require(`express`);
const router = new Router();

const axios = require(`axios`);
const {BACKEND_URL} = require(`../../constants`);

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
    const response = await axios.get(`${BACKEND_URL}/api/offers/my/comments`);
    const listCommentsForUserAnnouncements = response.data;
    // console.log(getListCommentsForUserAnnouncements);
    // res.send(`comments`);
    res.render(`comments`, {listCommentsForUserAnnouncements});
  } catch (err) {
    res.render(`errors/500`, {err});
  }
});


module.exports = router;
