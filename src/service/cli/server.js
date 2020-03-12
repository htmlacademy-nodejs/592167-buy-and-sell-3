'use strict';

const express = require(`express`);

const {initializeRoutes} = require(`../routes/index`);

const DEFAULT_PORT = 3000;
const app = express();

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.use(express.json());
    initializeRoutes(app);

    app.listen(port, () => {
      console.log(`Сервер запущен на порту: ${port}`);
    });
  }
};
