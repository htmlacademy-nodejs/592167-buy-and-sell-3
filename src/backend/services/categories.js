'use strict';

const categoryRepository = require(`../repositories/categories`);

const getCategories = async () => await categoryRepository.findAll();

const getAnnouncementsOfCategory = async (categoryId) => await categoryRepository.getAnnouncementsOfCategories(categoryId);

module.exports = {
  getCategories,
  getAnnouncementsOfCategory,
};
