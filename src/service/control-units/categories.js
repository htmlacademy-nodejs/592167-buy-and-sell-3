'use strict';

const categoryRepository = require(`../repositories/categoryRepository`);

const getCategories = () => categoryRepository.findAll();

module.exports = {
  getCategories,
};
