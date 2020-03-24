'use strict';

const fs = require(`fs`);
const {Router} = require(`express`);
const chalk = require(`chalk`);

const router = new Router();

const {MOCK_FILE_NAME} = require(`../../constants`);
const {addNewAnnouncement, changeAnnouncment, deleteAnnouncment} = require(`../../utils`);
let content = fs.existsSync(MOCK_FILE_NAME) ? JSON.parse(fs.readFileSync(MOCK_FILE_NAME)) : [];

router.get(`/`, async (req, res) => {
  try {
    res.send(content);
  } catch (err) {
    console.error(chalk.red(err));
    res.send([]);
  }
});
router.get(`/:offerId`, async (req, res) => {
  try {
    res.send(content.filter((el) => el.id === req.params.offerId.toString()));
  } catch (err) {
    console.error(chalk.red(err));
    res.send([]);
  }
});
router.post(`/`, (req, res) => {
  if (Object.keys(req.body).length !== 6) {
    res.status(400).send({error: `Переданы не все поля для нового объявления.`});
  } else {
    content = addNewAnnouncement(content, req.body);
    res.send(content);
  }
});
router.put(`/:offerId`, (req, res) => {
  if (Object.keys(req.body).length !== 6) {
    res.status(400).send({error: `Переданы не все поля для нового объявления.`});
  } else {
    const sendContent = changeAnnouncment(content, req.body, req.params.offerId);
    res.send(sendContent);
  }
});
router.delete(`/:offerId`, (req, res) => {
  try {
    const sendContent = deleteAnnouncment(content, req.params.offerId);
    res.send(sendContent);
  } catch (err) {
    console.error(chalk.red(err));
    res.send([]);
  }
});

module.exports = router;
