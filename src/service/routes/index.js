'use strict';

const offersRoutes = require(`./offers`);
const categoriesRoutes = require(`./categories`);

const initializeRoutes = (app) => {
  app.use(`/api/offers`, offersRoutes);
  app.use(`/api/categories`, categoriesRoutes);
};

module.exports = {
  initializeRoutes
};
