'use strict';

const fs = require(`fs`);
const {Router} = require(`express`);
const router = new Router();

const {MOCK_FILE_NAME} = require(`../../constants`);

router.get(`/`, async (req, res) => {
  try {
    fs.accessSync(MOCK_FILE_NAME, fs.constants.F_OK, (err) => {
      if (err) throw err;
    });
    const fileStat = fs.statSync(MOCK_FILE_NAME);
    if (fileStat.size > 0) {
      const fileContent = fs.readFileSync(MOCK_FILE_NAME);
      res.json(JSON.parse(fileContent).map((el) => el.title));
    } else {
      res.send([]);
    }
  } catch (err) {
    res.send([]);
  }
});

module.exports = router;
