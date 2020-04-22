'use strict';

const request = require(`supertest`);
const app = require(`../app`);
const {OK} = require(`../../constants`).HttpCode;

describe(`categories`, () => {
  test(`get all categories`, async () => {
    const res = await request(app).get(`/api/categories`);

    expect(res.statusCode).toBe(OK);
    expect(res).toHaveProperty(`body`);
  });
});
