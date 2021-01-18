'use strict';

const express = require(`express`);
const helmet = require(`helmet`);
const session = require(`express-session`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);
require(`dotenv`).config();

const app = express();

const cors = require(`cors`);

const {getLogger} = require(`./logger`);
const logger = getLogger();


const {initializeRoutes} = require(`./routes`);
const {FRONTEND_URL} = require(`../constants`);
const {sequelize} = require(`./db/db-connect`);


app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [`'self'`],
      scriptSrc: [`'self'`]
    }
  },
}));
app.use(helmet.xssFilter());

const sessionStore = new SequelizeStore({
  db: sequelize,
  // expiration: 1000 * 60 * 3,
  // checkExpirationInterval: 1000 * 60,
  expiration: 1000 * 30,
  checkExpirationInterval: 1000 * 30,
});

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  proxy: true,
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
