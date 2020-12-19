'use strict';

const express = require(`express`);
const helmet = require(`helmet`);
const app = express();

const cors = require(`cors`);

const {getLogger} = require(`./logger`);
const logger = getLogger();


const {initializeRoutes} = require(`./routes`);
const {FRONTEND_URL} = require(`../constants`);


app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      scriptSrc: [`self`]
    }
  },
  xssFilter: true,
}));

app.use((req, res, next) => {
  res.on(`finish`, () => {
    logger.info(`End request with status code ${res.statusCode}`);
  });
  logger.debug(`Request came from address ${req.url}`);
  next();
});

app.use(cors({
  origin: FRONTEND_URL,
}));

initializeRoutes(app);

app.use((req, res) => {
  res.status(404).send({code: 404, message: `Resource not found`});
  logger.error(`End request with error ${res.statusCode}, resource not found`);
});


module.exports = app;
