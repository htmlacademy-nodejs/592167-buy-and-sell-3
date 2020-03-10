'use strict';

const fs = require(`fs`).promises;
const {Router} = require(`express`);
const router = new Router();

const {MOCK_FILE_NAME} = require(`../../constants`);

router.get(`/`, async (req, res) => {
  const fileContent = await fs.readFile(MOCK_FILE_NAME);
  res.json(JSON.parse(fileContent).map((el) => el.title));
});

module.exports = router;
