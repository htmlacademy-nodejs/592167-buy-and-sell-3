'use strict';

const request = require(`request-promise-native`);
const {MOCK_URL} = require(`../../constants`);

const myRoutes = require(`./my`);
const offersRoutes = require(`./offers`);

const initializeRoutes = (app) => {
  app.use(`/my`, myRoutes);
  app.use(`/offers`, offersRoutes);


  app.get(`/`, (req, res) => {
    request(`${MOCK_URL}/api/offers`, {json: true})
      .then((announcements) => res.render(`index`, {announcements}))
      .catch((err) => res.render(`500`, {err}));
  });

  app.get(`/register`, (req, res) => {
    res.render(`sign-up`);
  });

  app.get(`/login`, (req, res) => {
    res.render(`login`);
  });

  app.get(`/search`, (req, res) => {
    request(encodeURI(`${MOCK_URL}/api/search?query=${req.query.search}`))
      .then((content) => {
        const announcements = JSON.parse(content);
        res.render(`search-result`, {announcements});
      })
      .catch((err) => res.render(`500`, {err}));
  });
};


module.exports = {
  initializeRoutes
};
