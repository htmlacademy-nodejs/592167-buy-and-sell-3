'use strict';

const express = require(`express`);
const formidableMiddleware = require(`express-formidable`);
const {initializeRoutes} = require(`./routes/index`);

const app = express();

app.set(`views`, `${__dirname}/templates`);
app.set(`view engine`, `pug`);

app.use(express.static(`${__dirname}/static`));
app.use(`/my`, express.static(`${__dirname}/static`));
app.use(`/offers`, express.static(`${__dirname}/static`));

// app.use(express.urlencoded({extended: false}));
app.use(formidableMiddleware({
  encoding: `utf-8`,
  uploadDir: `${__dirname}/tmp`,
  multiple: false,
}));

initializeRoutes(app);

const port = 8080;
app.listen(port, () => {
  console.log(`Сервер запущен на порту: ${port}`);
});
