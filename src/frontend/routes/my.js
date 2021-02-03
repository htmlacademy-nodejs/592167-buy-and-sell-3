'use strict';

const {Router} = require(`express`);
const router = new Router();

const axios = require(`axios`);
const privateRoute = require(`../../middleware/private`);
const {BACKEND_URL} = require(`../../constants`);

router.get(`/`, [
  privateRoute(),
], async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/offers/my`);
    const announcements = response.data;
    announcements.avatar = `avatar04.jpg`;
    res.render(`my-tickets`, {announcements});
  } catch (err) {
    res.render(`errors/500`, {err});
  }
});

router.get(`/comments`, [
  privateRoute(),
], async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/offers/my/comments`);
    const listComments = response.data;
    const commentsInfo = {
      listComments,
      avatar: `avatar04.jpg`,
    };
    res.render(`comments`, {commentsInfo});
  } catch (err) {
    res.render(`errors/500`, {err});
  }
});


module.exports = router;
