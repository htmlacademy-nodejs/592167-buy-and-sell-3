'use strict';

const categoriesRepository = require(`../repositories/categories`);
jest.mock(`../repositories/categories`);

const underTest = require(`./categories`);

describe(`getCategories`, () => {
  test(`test should return categories`, () => {
    const expectedCategories = [``, ``, ``];
    categoriesRepository.findAll.mockReturnValue(expectedCategories);

    const actual = underTest.getCategories();

    expect(actual).toEqual(expectedCategories);
  });
});
