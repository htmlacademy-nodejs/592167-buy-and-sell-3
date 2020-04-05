'use strict';

const categoryRepository = require(`../repositories/categoriesRepository`);

const getCategories = () => categoryRepository.findAll();

module.exports = {
  getCategories,
};
