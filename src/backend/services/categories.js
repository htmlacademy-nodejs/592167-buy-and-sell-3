'use strict';

const categoryRepository = require(`../repositories/categories`);

const getCategories = async () => await categoryRepository.findAll();

const getAnnouncementsOfCategory = async (categoryId, selectionParams) => await categoryRepository.getAnnouncementsOfCategories(categoryId, selectionParams);

module.exports = {
  getCategories,
  getAnnouncementsOfCategory,
};
