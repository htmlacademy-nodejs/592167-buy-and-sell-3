'use strict';

const express = require(`express`);
const app = express();

const {initializeRoutes} = require(`./routes`);

app.use(express.json());
initializeRoutes(app);
app.use((req, res) => res.status(404).send({code: 404, message: `Нет такой страницы`}));

module.exports = app;

