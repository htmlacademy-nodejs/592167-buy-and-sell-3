'use strict';

const categoryRepository = require(`../repositories/categories`);

const getCategories = () => categoryRepository.findAll();

module.exports = {
  getCategories,
};
