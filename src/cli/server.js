'use strict';

const app = require(`../backend/app`);
const {getLogger} = require(`../backend/logger`);
const logger = getLogger();
const DEFAULT_PORT = 3000;

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, () => {
      logger.info(`Сервер запущен на порту: ${port}`);
    }).on(`error`, (err) => {
      logger.error(`Сервер не смог запуститься. Ошибка ${err}`);
    });
  }
};
