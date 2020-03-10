'use strict';

const offersRoutes = require(`./offers`);

const initializeRoutes = (app) => {
  app.use(`/offers`, offersRoutes);
};

module.exports = {
  initializeRoutes
};
