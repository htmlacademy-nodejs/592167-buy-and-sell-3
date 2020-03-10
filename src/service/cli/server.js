'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const express = require(`express`);

const {initializeRoutes} = require(`./routes/index`);
const {HttpCode, MOCK_FILE_NAME} = require(`../../constants`);

const DEFAULT_PORT = 3000;


module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
  }
};
