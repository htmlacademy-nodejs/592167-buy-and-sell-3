'use strict';

const express = require(`express`);
const {initializeRoutes} = require(`./routes/index`);
require(`dotenv`).config();

const app = express();

app.set(`views`, `${__dirname}/templates`);
app.set(`view engine`, `pug`);

app.use(express.static(`${__dirname}/static`));


initializeRoutes(app);

const port = process.env.FRONT_SERVER_PORT;
app.listen(port, () => {
  console.log(`Сервер запущен на порту: ${port}`);
});
