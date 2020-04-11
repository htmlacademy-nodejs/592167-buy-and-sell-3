'use strict';

const app = require(`../backend/app`);
const DEFAULT_PORT = 3000;

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, () => {
      console.log(`Сервер запущен на порту: ${port}`);
    });
  }
};
