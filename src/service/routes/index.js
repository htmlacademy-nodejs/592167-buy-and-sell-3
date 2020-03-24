'use strict';

const offersRoutes = require(`./offers`);
const categoriesRoutes = require(`./categories`);
const searchRoutes = require(`./search`);

const initializeRoutes = (app) => {
  app.use(`/api/offers`, offersRoutes);
  app.use(`/api/categories`, categoriesRoutes);
  app.use(`/api/search`, searchRoutes);
};

module.exports = {
  initializeRoutes
};
