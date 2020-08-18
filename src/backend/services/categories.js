'use strict';

const categoryRepository = require(`../repositories/categories`);

const getCategories = async () => await categoryRepository.findAll();

module.exports = {
  getCategories,
};
