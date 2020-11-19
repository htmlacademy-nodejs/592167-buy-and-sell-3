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
      const resCategories = await axios.get(`${BACKEND_URL}/api/categories`);
      const categories = resCategories.data;
      const resNewAnnouncements = await axios.get(`${BACKEND_URL}/api/offers/newestAnnouncements`);
      const newAnnouncements = resNewAnnouncements.data;
      const resMostDiscussed = await axios.get(`${BACKEND_URL}/api/offers/mostdiscussed`);
      const mostDiscussed = resMostDiscussed.data;
      const mainPage = {
        categories,
        newAnnouncements,
        mostDiscussed,
      };
      res.render(`index`, {mainPage});
    } catch (err) {
      res.render(`./errors/500`, {err});
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
