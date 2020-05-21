'use strict';

const fs = require(`fs`).promises;
const {Router} = require(`express`);
const router = new Router();

const request = require(`request-promise-native`);
const {MOCK_URL} = require(`../../constants`);

router.get(`/category`, (req, res) => {
  res.render(`category`);
});
router.get(`/category/:id`, (req, res) => {
  res.render(`category`);
});
router.get(`/add`, (req, res) => res.render(`new-ticket`));
router.post(`/add`, (req, res) => {
  const {type, size, path, name} = req.files.avatar;
  const allowTypes = [`image/jpeg`, `image/png`];

  if (size === 0 || !allowTypes.includes(type)) {
    fs.unlink(path);
    return res.redirect(`/offers/add`);
  }

  console.log(req.fields, name);
});
router.get(`/edit/:id`, (req, res) => {
  request(`${MOCK_URL}/api/offers/${req.params.id}`, {json: true})
    .then((announcement) => res.render(`ticket-edit`, {announcement}));
});
router.get(`/:id`, (req, res) => res.send(req.originalUrl));


module.exports = router;
