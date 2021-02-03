'use strict';

const axios = require(`axios`);

const shemaValidator = require(`../../middleware/shema-validator`);
const update = require(`../../middleware/save-photo`);
const alreadyRegister = require(`../../middleware/already-register`);
const checkSession = require(`../../middleware/check-session`);
const isUserRegister = require(`../../middleware/is-user-register`);
const checkUserPassword = require(`../../middleware/check-user-password`);

const userSchema = require(`../../backend/validation-schemas/user-schema`);

const {BACKEND_URL, FRONTEND_URL, TEMPLATE} = require(`../../constants`);

const myRoutes = require(`./my`);
const offersRoutes = require(`./offers`);
const errorsRoutes = require(`./errors`);


const initializeRoutes = (app) => {
  app.use(`/my`, myRoutes);
  app.use(`/offers`, offersRoutes);
  app.use(`/errors`, errorsRoutes);


  app.get(`/`, [
    checkSession(),
  ], async (req, res) => {
    try {
      const resCategories = await axios.get(`${BACKEND_URL}/api/categories`);
      const categories = resCategories.data;
      const resNewAnnouncements = await axios.get(`${BACKEND_URL}/api/offers/newestAnnouncements`);
      const newAnnouncements = resNewAnnouncements.data;
      const resMostDiscussed = await axios.get(`${BACKEND_URL}/api/offers/mostdiscussed`);
      const mostDiscussed = resMostDiscussed.data;
      const authorization = req.session && req.session.isLogged ? req.session.isLogged : false;
      const avatar = `avatar04.jpg`;
      const mainPage = {
        categories,
        newAnnouncements,
        mostDiscussed,
        FRONTEND_URL,
        authorization,
        avatar,
      };
      res.render(`index`, {mainPage});
    } catch (err) {
      res.render(`./errors/500`, {err});
    }
  });

  app.get(`/register`, (req, res) => {
    res.render(`sign-up`);
  });

  app.post(`/register`, [
    update(TEMPLATE.REGISTER),
    shemaValidator(userSchema, TEMPLATE.REGISTER),
    alreadyRegister(),
  ], async (req, res) => {
    try {
      await axios.post(`${BACKEND_URL}/api/user`, req.user);
      res.redirect(`/login`);
    } catch (err) {
      res.render(`error/500`);
    }
  });

  app.get(`/login`, (req, res) => {
    res.render(`login`);
  });

  app.post(`/login`, [
    isUserRegister(TEMPLATE.LOGIN),
    checkUserPassword(),
  ], async (req, res) => {
    const session = await axios.post(`${BACKEND_URL}/api/session/login`, req.body);
    const {isLogged, username} = session.data;
    req.session.isLogged = isLogged;
    req.session.username = username;

    res.redirect(`/`);
  });

  app.get(`/logout`, (req, res) => {
    req.session.destroy(() => {
      res.redirect(`/`);
    });
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
