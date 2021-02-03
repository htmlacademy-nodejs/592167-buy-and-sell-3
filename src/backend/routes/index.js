'use strict';

const offersRoutes = require(`../routes/offers`);
const categoriesRoutes = require(`../routes/categories`);
const searchRoutes = require(`../routes/search`);
const usersRoutes = require(`../routes/users`);
const commentsRoutes = require(`../routes/comments`);
const emailRoutes = require(`../routes/email`);
const sessionRoutes = require(`../routes/session`);

const initializeRoutes = (app) => {
  app.use(`/api/offers`, offersRoutes);
  app.use(`/api/categories`, categoriesRoutes);
  app.use(`/api/search`, searchRoutes);
  app.use(`/api/user`, usersRoutes);
  app.use(`/api/comments`, commentsRoutes);
  app.use(`/api/email`, emailRoutes);
  app.use(`/api/session`, sessionRoutes);
};

module.exports = {
  initializeRoutes
};
