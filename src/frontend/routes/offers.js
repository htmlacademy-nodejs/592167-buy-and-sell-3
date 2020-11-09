'use strict';

// const fs = require(`fs`).promises;
const {Router} = require(`express`);
const router = new Router();

// const {upload} = require(`./index`);


const axios = require(`axios`);
const {BACKEND_URL} = require(`../../constants`);
// const {getRandomInit} = require(`../../utils`);

const DEFAULT_PREVIEW_COUNT = 8;

router.get(`/add`, async (req, res) => {
  try {
    res.render(`new-ticket`);
  } catch (err) {
    res.render(`./errors/500`, {err});
  }
});

router.get(`/category/:id`, async (req, res) => {
  const resCategories = await axios.get(`${BACKEND_URL}/api/categories`);
  const categories = resCategories.data;
  const resAnnouncementsOfCategory = await axios.get(`${BACKEND_URL}/api/categories/${req.params.id}?start=${req.query.start}&count=${req.query.count}`);
  const announcementsOfCategory = resAnnouncementsOfCategory.data;
  const categoryInfo = categories.find((el) => el.id === Number.parseInt(req.params.id, 10));
  const tempCount = Math.floor(categoryInfo.categorycount / DEFAULT_PREVIEW_COUNT);
  const paginationCount = (categoryInfo.categorycount > 0 && categoryInfo.categorycount % DEFAULT_PREVIEW_COUNT > 0) ? tempCount + 1 : tempCount;
  const paginationStep = Array(paginationCount).fill({}).map((it, i) => {
    return {
      step: i + 1,
      offset: Number.parseInt(req.query.start, 10) === i + 1,
      categoryId: req.params.id,
    };
  });
  if (!req.query.start) {
    paginationStep[0].offset = true;
  }
  // console.log(req.query.start);
  paginationStep.push({
    step: `Дальше`,
    offset: ``
  });
  // console.log(req.query.start);
  const announcementsOfCategoryPage = {
    categories,
    announcementsOfCategory,
    categoryInfo,
    paginationStep,
  };
  res.render(`category`, {announcementsOfCategoryPage});
});

router.get(`/:id`, async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/offers/${req.params.id}`);
    const announcement = response.data;
    res.render(`ticket`, {announcement});
  } catch (err) {
    res.render(`./errors/500`, {err});
  }
});

router.get(`/edit/:id`, async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/offers/${req.params.id}`);
    const announcement = response.data;
    res.render(`ticket-edit`, {announcement});
  } catch (err) {
    res.render(`./errors/500`, {err});
  }
});


// router.post(`/add`, async (req, res) => {
//   const {type, size, path, name} = req.files.avatar;
//   const allowTypes = [`image/jpeg`, `image/png`];
//
//   if (size === 0 || !allowTypes.includes(type)) {
//     fs.unlink(path);
//     return res.redirect(`/add`);
//   }
//
//   try {
//     await fs.rename(path, `${__dirname}/../images/${name}`);
//   } catch (error) {
//     return res.send(`Oops! Error: ${error.message}`);
//   }
//
//   try {
//     const params = req.fields;
//     params.image = `${getRandomInit(1, 16)}`.padStart(6, `item00`);
//     console.log(req);
//     const answer = await axios.post(`${BACKEND_URL}/api/offers/add`, params);
//     res.send(answer.data);
//   } catch (err) {
//     res.send(`post is not successful`);
//   }
// });

// router.post(`/add`, upload.single(`avatar`), async (req, res) => {
//   const {file} = req;
//   res.send(file);
// });

module.exports = router;
