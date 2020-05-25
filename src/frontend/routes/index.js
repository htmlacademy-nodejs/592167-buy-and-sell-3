'use strict';

const axios = require(`axios`);
const {BACKEND_URL} = require(`../../constants`);

const myRoutes = require(`./my`);
const offersRoutes = require(`./offers`);

const initializeRoutes = (app) => {
  app.use(`/my`, myRoutes);
  app.use(`/offers`, offersRoutes);


  app.get(`/`, async (req, res) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/offers`);
      const announcements = response.data;
      res.render(`index`, {announcements});
    } catch (err) {
      res.render(`500`, {err});
    }
  });

  app.get(`/register`, (req, res) => {
    res.render(`sign-up`);
  });

  app.get(`/login`, (req, res) => {
    res.render(`login`);
  });

  app.get(`/search`, async (req, res) => {
    try {
      const response = await axios.get(encodeURI(`${BACKEND_URL}/api/search?query=${req.query.search}`));
      const announcements = response.data;
      res.render(`search-result`, {announcements});
    } catch (err) {
      res.render(`500`, {err});
    }
  });
};


module.exports = {
  initializeRoutes
};
