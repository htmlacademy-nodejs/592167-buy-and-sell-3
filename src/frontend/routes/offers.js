'use strict';

const fs = require(`fs`).promises;
const {Router} = require(`express`);
const router = new Router();

const request = require(`request-promise-native`);
const {BACKEND_URL} = require(`../../constants`);

const emptyAnnouncement = {
  categories: ``,
  description: ``,
  title: ``,
  type: ``,
  sum: ``,
};
let templateAnnouncement;


router.get(`/category`, (req, res) => {
  res.render(`category`);
});

router.get(`/category/:id`, (req, res) => {
  res.render(`category`);
});

router.get(`/add`, (req, res) => {
  templateAnnouncement = Object.assign({}, emptyAnnouncement);
  res.render(`new-ticket`, {templateAnnouncement});
});

router.post(`/add`, (req, res) => {
  const {type, size, path, name} = req.files.avatar;
  const allowTypes = [`image/jpeg`, `image/png`];

  const newAnnouncement = {
    categories: req.fields.category,
    description: req.fields.comment,
    picture: name,
    title: req.fields[`ticket-name`],
    type: req.fields.action,
    sum: parseInt(req.fields.price, 10),
  };

  templateAnnouncement = Object.assign({}, newAnnouncement);

  if (size === 0 || !allowTypes.includes(type)) {
    fs.unlink(path);
    return res.render(`new-ticket`, {templateAnnouncement});
  }

  request.post(`${BACKEND_URL}/api/offers`, {json: newAnnouncement});// .then((content) => console.log(content));

  return res.redirect(`/my`);
});

router.get(`/edit/:id`, (req, res) => {
  request(`${BACKEND_URL}/api/offers/${req.params.id}`, {json: true})
    .then((announcement) => res.render(`ticket-edit`, {announcement}));
});

router.get(`/:id`, (req, res) => res.send(req.originalUrl));


module.exports = router;
