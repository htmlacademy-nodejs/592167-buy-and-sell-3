'use strict';

const categoriesRepository = require(`../repositories/categories`);
jest.mock(`../repositories/categories`);

const underTest = require(`./categories`);

const {CATEGORY_ID, DEFAULT} = require(`../../constants`);

describe(`getCategories`, () => {
  test(`test should return categories`, async () => {
    const expectedCategories = [``, ``, ``];
    categoriesRepository.findAll.mockReturnValue(expectedCategories);

    const actual = await underTest.getCategories();

    expect(actual).toEqual(expectedCategories);
  });
});

describe(`getAnnouncementsOfCategory`, () => {
  test(`test should return announcements of category`, async () => {
    const expectedAnnouncements = [{}, {}, {}];
    categoriesRepository.getAnnouncementsOfCategories.mockReturnValue(expectedAnnouncements);

    const announcements = await underTest.getAnnouncementsOfCategory(CATEGORY_ID, DEFAULT.PREVIEW_COUNT);
    expect(announcements).toEqual(expectedAnnouncements);
  });
});
