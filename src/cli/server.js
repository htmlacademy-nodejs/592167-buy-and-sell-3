'use strict';

const app = require(`../backend/app`);
const {connectDb} = require(`../backend/db/db-connect`);
const {getLogger} = require(`../backend/logger`);
require(`dotenv`).config();

const logger = getLogger();
const DEFAULT_PORT = 3000;

module.exports = {
  name: `--server`,
  run() {
    const port = process.env.SERVER_PORT || DEFAULT_PORT;

    app.listen(port, () => {
      connectDb();
      logger.info(`Сервер запущен на порту: ${port}`);
    }).on(`error`, (err) => {
      logger.error(`Сервер не смог запуститься. Ошибка ${err}`);
    });
  }
};
