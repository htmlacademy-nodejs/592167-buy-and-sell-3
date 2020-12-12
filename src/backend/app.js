'use strict';

const express = require(`express`);
const app = express();

const {getLogger} = require(`./logger`);
const logger = getLogger();


const {initializeRoutes} = require(`./routes`);


app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.on(`finish`, () => {
    logger.info(`End request with status code ${res.statusCode}`);
  });
  logger.debug(`Request came from address ${req.url}`);
  next();
});

initializeRoutes(app);

app.use((req, res) => {
  res.status(404).send({code: 404, message: `Resource not found`});
  logger.error(`End request with error ${res.statusCode}, resource not found`);
});


module.exports = app;
