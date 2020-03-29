'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);

const router = new Router();

const announcementService = require(`../control-units/announcement`);

router.get(`/`, (req, res) => {
  try {

    res.send(announcementService.search(req.query));
  } catch (err) {
    console.log(chalk.red(err));
    res.status(404).send(`Нет такой страницы`);
  }
});

module.exports = router;
