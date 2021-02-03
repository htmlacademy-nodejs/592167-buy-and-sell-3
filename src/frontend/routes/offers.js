'use strict';

const {Router} = require(`express`);
const router = new Router();

const axios = require(`axios`);
const checkSession = require(`../../middleware/check-session`);
const {BACKEND_URL} = require(`../../constants`);

const DEFAULT_PREVIEW_COUNT = 8;

router.get(`/add`, async (req, res) => {
  try {
    const resCategories = await axios.get(`${BACKEND_URL}/api/categories`);
    const categories = resCategories.data;
    const resCsrfToken = await axios.get(`${BACKEND_URL}/api/offers/csrftoken`);
    const {csrf} = resCsrfToken.data;
    const ticketInfo = {
      url: `${BACKEND_URL}`,
      avatar: `avatar04.jpg`,
      categories,
      csrf,
    };
    res.render(`new-ticket`, {ticketInfo});
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
  paginationStep.push({
    step: `Дальше`,
    offset: ``
  });
  const announcementsOfCategoryPage = {
    categories,
    announcementsOfCategory,
    categoryInfo,
    paginationStep,
    avatar: `avatar04.jpg`,
  };
  res.render(`category`, {announcementsOfCategoryPage});
});

router.get(`/:id`, [
  checkSession(),
], async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/offers/${req.params.id}`);
    const announcement = response.data;
    const authorization = req.session && req.session.isLogged ? req.session.isLogged : false;
    announcement.backend = `${BACKEND_URL}`;
    announcement.avatar = `avatar04.jpg`;
    announcement.authorization = authorization;
    res.render(`ticket`, {announcement});
  } catch (err) {
    res.render(`./errors/500`, {err});
  }
});

router.get(`/edit/:id`, async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/offers/${req.params.id}`);
    const announcement = response.data;
    const resCategories = await axios.get(`${BACKEND_URL}/api/categories`);
    announcement.backend = `${BACKEND_URL}`;
    announcement.avatar = `avatar04.jpg`;
    announcement.categoriesList = resCategories.data;
    res.render(`ticket-edit`, {announcement});
  } catch (err) {
    res.render(`./errors/500`, {err});
  }
});

module.exports = router;
