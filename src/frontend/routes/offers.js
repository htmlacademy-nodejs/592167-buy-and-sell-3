'use strict';

// const fs = require(`fs`).promises;
const {Router} = require(`express`);
const router = new Router();

const axios = require(`axios`);
const {BACKEND_URL} = require(`../../constants`);

// const emptyAnnouncement = {
//   categories: ``,
//   description: ``,
//   title: ``,
//   type: ``,
//   sum: ``,
// };
// let templateAnnouncement;


// router.get(`/category`, async (req, res) => {
//   const elementCountCategory = await axios.get(`${BACKEND_URL}/api/categories`);
//   res.render(`category`);
// });

router.get(`/category/:id`, async (req, res) => {
  const resCategories = await axios.get(`${BACKEND_URL}/api/categories`);
  const categories = resCategories.data;
  const resAnnouncementsOfCategory = await axios.get(`${BACKEND_URL}/api/categories/${req.params.id}`);
  const announcementsOfCategory = resAnnouncementsOfCategory.data;
  const categoryInfo = categories.find((el) => el.id === Number.parseInt(req.params.id, 10));
  const tempCount = Math.floor(categoryInfo.categorycount / 8);
  const paginationCount = (categoryInfo.categorycount > 0 && categoryInfo.categorycount % 8 > 0) ? tempCount + 1 : tempCount;
  const paginationStep = Array(paginationCount).fill(0).map((it, i) => i + 1);
  paginationStep.push(`Дальше`);
  const announcementsOfCategoryPage = {
    categories,
    announcementsOfCategory,
    categoryInfo,
    paginationStep,
  };
  res.render(`category`, {announcementsOfCategoryPage});
});

// router.get(`/add`, (req, res) => {
//   templateAnnouncement = Object.assign({}, emptyAnnouncement);
//   res.render(`new-ticket`, {templateAnnouncement});
// });

// router.post(`/add`, async (req, res) => {
//   try {
//     const {type, size, path, name} = req.files.avatar;
//     const allowTypes = [`image/jpeg`, `image/png`];
//
//     const newAnnouncement = {
//       categories: req.fields.category,
//       description: req.fields.comment,
//       picture: name,
//       title: req.fields[`ticket-name`],
//       type: req.fields.action,
//       sum: parseInt(req.fields.price, 10),
//     };
//
//     templateAnnouncement = Object.assign({}, newAnnouncement);
//
//     if (size === 0 || !allowTypes.includes(type)) {
//       fs.unlink(path);
//       return res.render(`new-ticket`, {templateAnnouncement});
//     }
//
//     await axios.post(`${BACKEND_URL}/api/offers`, newAnnouncement);
//
//     return res.redirect(`/my`);
//   } catch (err) {
//     res.render(`500`, {err});
//   }
// });

// router.get(`/edit/:id`, async (req, res) => {
//   try {
//     const response = await axios.get(`${BACKEND_URL}/api/offers/${req.params.id}`);
//     const announcement = response.data;
//     res.render(`ticket-edit`, {announcement});
//   } catch (err) {
//     res.render(`500`, {err});
//   }
// });

// router.get(`/:id`, (req, res) => res.send(req.originalUrl));


module.exports = router;
