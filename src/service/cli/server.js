'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const express = require(`express`);

const {initializeRoutes} = require(`./routes/index`);
const {HttpCode, MOCK_FILE_NAME} = require(`../../constants`);

const DEFAULT_PORT = 3000;

const sendResponse = (res, statusCode, message) => {
  res.statusCode = statusCode;
  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  const responseBody = `
  <!Doctype html>
    <html lang="ru"
    <head>
      <title>With love from Node</title>
    </head>
    <body>${message}</body>
  </html>`.trim();

  res.end(responseBody);
};

const onClientConnect = async (req, res) => {
  const notFoundMessageText = `Not found`;

  switch (req.url) {
    case `/`:
      try {
        const fileContent = await fs.readFile(MOCK_FILE_NAME);
        const message = JSON.parse(fileContent).map((post) => `<li>${post.title}</li>`).join(``);
        sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }

      break;
    default:
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      break;
  }
};

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    http.createServer(onClientConnect)
      .listen(port)
      .on(`listening`, (err) => {
        if (err) {
          return console.error(chalk.red(`Ошибка при создании сервера`, err));
        }

        return console.info(chalk.green(`Ожидаю соединений на порту ${port}`));
      });
  }
};
