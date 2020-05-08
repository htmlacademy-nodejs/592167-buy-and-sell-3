'use strict';

const request = require(`supertest`);

const app = require(`../app`);
const announcementRepository = require(`../repositories/announcement`);
const {OK} = require(`../../constants`).HttpCode;

const MOCK_ANNOUNCEMENT = {
  categories: [
    `Посуда`,
    `Программирование`
  ],
};

const addMockAnnouncement = () => announcementRepository.save(Object.assign({}, MOCK_ANNOUNCEMENT));
const deleteMockAnnouncement = (id) => announcementRepository.remove(id);

describe(`categories`, () => {
  test(`for non-existing mock.json categories list should be empty`, async () => {
    const res = await request(app).get(`/api/categories`);

    expect(res.statusCode).toBe(OK);
    expect(res.body.length === 0).toBeTruthy();
  });

  test(`is categories with 'Программирование'`, async () => {
    const id = addMockAnnouncement();
    const expectedCategory = `Программирование`;
    const res = await request(app).get(`/api/categories`);

    expect(res.body).toContain(expectedCategory);

    deleteMockAnnouncement(id);
  });
});
