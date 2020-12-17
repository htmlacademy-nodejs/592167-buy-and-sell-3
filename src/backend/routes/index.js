'use strict';

const offersRoutes = require(`../routes/offers`);
const categoriesRoutes = require(`../routes/categories`);
const searchRoutes = require(`../routes/search`);
const usersRoutes = require(`../routes/users`);
const commentsRoutes = require(`../routes/comments`);

const initializeRoutes = (app) => {
  app.use(`/api/offers`, offersRoutes);
  app.use(`/api/categories`, categoriesRoutes);
  app.use(`/api/search`, searchRoutes);
  app.use(`/api/user`, usersRoutes);
  app.use(`/api/comments`, commentsRoutes);
};

module.exports = {
  initializeRoutes
};
