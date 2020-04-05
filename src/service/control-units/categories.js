'use strict';

const categoryRepository = require(`src/service/repositories/categories`);

const getCategories = () => categoryRepository.findAll();

module.exports = {
  getCategories,
};
