'use strict';

const request = require(`supertest`);
const app = require(`../app`);

describe(`categories`, () => {
  test(`get all categories`, async () => {
    const res = await request(app).get(`/api/categories`);

    expect(res.statusCode).toBe(200);
    expect(res).toHaveProperty(`body`);
  });
});
