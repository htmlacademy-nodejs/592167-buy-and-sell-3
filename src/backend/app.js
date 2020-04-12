'use strict';

const express = require(`express`);
const app = express();

const {getLogger} = require(`./logger`);
const logger = getLogger();


const {initializeRoutes} = require(`./routes`);


app.use(express.json());

initializeRoutes(app);

app.use((req, res, next) => {
  logger.debug(`Запрос пришел с адреса ${req.url}`);
  next();
});

app.use((req, res) => {
  res.status(404).send({code: 404, message: `Нет такой страницы`});
  logger.error(`Запрос завершился с ошибкой ${res.statusCode}`);
});


module.exports = app;
