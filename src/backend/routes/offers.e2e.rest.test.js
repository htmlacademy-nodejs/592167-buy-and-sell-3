'use strict';

const request = require(`supertest`);
const app = require(`../app`);

const {
  OK,
  NOT_FOUND,
  GONE,
  BAD_REQUEST,
  CREATED,
  NO_CONTENT} = require(`../../constants`).HttpCode;

const MOCK_ID = 123456;
const newAnnouncement = {
  title: `some title`,
  comments: [
    {
      id: `yCjvjj`,
      text: ``
    },
    {
      id: `KZ5IcZ`,
      text: `Оплата наличными или перевод на карту? Продаю в связи с переездом. Отрываю от сердца.`
    },
    {
      id: `XswJI4`,
      text: `А где блок питания. С чем связана продажа? Почему так дешёво?`
    }
  ],
  description: `Пользовались бережно и только по большим праздникам.`,
  picture: `item11.jpg`,
  type: `SALE`,
  sum: 54355
};
const updateAnnouncement = {
  title: `another title`,
  category: [],
  description: `Пользовались бережно и только по большим праздникам.`,
  picture: `item11.jpg`,
  type: `SALE`,
  sum: 54355
};
const newComment = {text: `some text`};

describe(`get all announcements`, () => {
  test(`When get offers status code should be OK`, async () => {
    const res = await request(app).get(`/api/offers`);

    expect(res.statusCode).toBe(OK);
    expect(res.body[0]).toHaveProperty(`id`);
    expect(res.body[0]).toHaveProperty(`title`);
    expect(res.body[0]).toHaveProperty(`categories`);
    expect(res.body[0]).toHaveProperty(`description`);
    expect(res.body[0]).toHaveProperty(`picture`);
    expect(res.body[0]).toHaveProperty(`type`);
    expect(res.body[0]).toHaveProperty(`sum`);
    expect(res.body[0]).toHaveProperty(`comments`);
  });

  test(`when route is not correct status code should be NOT_FOUND`, async () => {
    const res = await request(app).get(`/api/no-offers`);

    expect(res.statusCode).toBe(NOT_FOUND);
  });
});

describe(`get announcement`, () => {
  test(`when get announce should had properties id and title`, async () => {
    const res = await request(app).get(`/api/offers/rxc7bK`);

    expect(res.statusCode).toBe(OK);
    expect(res.body).toHaveProperty(`id`);
    expect(res.body).toHaveProperty(`title`);
    expect(res.body).toHaveProperty(`categories`);
    expect(res.body).toHaveProperty(`description`);
    expect(res.body).toHaveProperty(`picture`);
    expect(res.body).toHaveProperty(`type`);
    expect(res.body).toHaveProperty(`sum`);
    expect(res.body).toHaveProperty(`comments`);
  });

  test(`for non-existing announcement status code should be GONE`, async () => {
    const res = await request(app).get(`/api/offers/${MOCK_ID}`);
    expect(res.statusCode).toBe(GONE);
  });
});

describe(`post announcement`, () => {
  test(`when adding new announcement should return new id`, async () => {
    const res = await request(app).post(`/api/offers`).send(newAnnouncement);

    const id = res.body.id;

    const announcement = await request(app).get(`/api/offers/${id}`);

    expect(announcement.body.title).toBe(newAnnouncement.title);
  });

  test(`when sending not all params status code should be BAD_REQUEST`, async () => {
    const tempAnnouncement = {title: `some title`};
    const res = await request(app).post(`/api/offers`).send(tempAnnouncement);

    expect(res.statusCode).toBe(BAD_REQUEST);
  });
});

describe(`update announcement`, () => {
  test(`when updating announcement title should be 'new title'`, async () => {
    const tempAnnouncement = await request(app).post(`/api/offers`)
      .send(newAnnouncement);
    await request(app).put(`/api/offers/${tempAnnouncement.body.id}`)
      .send(updateAnnouncement);
    const res = await request(app).get(`/api/offers/${tempAnnouncement.body.id}`);

    expect(res.body.title).toBe(updateAnnouncement.title);
  });

  test(`when sending not all params status code should be BAD_REQUEST`, async () => {
    const tempAnnouncement = {title: `some title`};
    const announcement = await request(app).post(`/api/offers`)
      .send(newAnnouncement);
    const res = await request(app).put(`/api/offers/${announcement.body.id}`)
      .send(tempAnnouncement);

    expect(res.statusCode).toBe(BAD_REQUEST);
  });

  test(`when updating non-existing announcement status code should be GONE`, async () => {
    const res = await request(app).put(`/api/offers/${MOCK_ID}`)
      .send(updateAnnouncement);

    expect(res.statusCode).toBe(GONE);
  });
});

describe(`delete announcement`, () => {
  test(`for existing announcement after delete should return status
  code NO_CONTENT`, async () => {
    const tempAnnouncement = await request(app).post(`/api/offers`)
      .send(newAnnouncement);
    const res = await request(app).delete(`/api/offers/${tempAnnouncement.body.id}`);

    expect(res.statusCode).toBe(NO_CONTENT);
  });

  test(`when deleting non-existing announcement status code should be GONE`, async () => {
    const res = await request(app).delete(`/api/offers/${MOCK_ID}`);

    expect(res.statusCode).toBe(GONE);
  });
});

describe(`get all comments from announcement`, () => {
  test(`for existing announcement should return all comments`, async () => {
    const tempAnnouncement = await request(app).post(`/api/offers`)
      .send(newAnnouncement);
    const res = await request(app).get(`/api/offers/${tempAnnouncement.body.id}/comments`);

    expect(res.body).toEqual(newAnnouncement.comments);
  });

  test(`for non-existing announcement status code should be GONE`, async () => {
    const res = await request(app).get(`/api/offers/${MOCK_ID}/comments`);

    expect(res.statusCode).toBe(GONE);
  });
});

describe(`delete comments from announcement`, () => {
  test(`for existing announcement and comment delete it by id`, async () => {
    const tempAnnouncement = await request(app).post(`/api/offers`).send(newAnnouncement);
    const res = await request(app)
      .delete(`/api/offers/${tempAnnouncement.body.id}/comments/${newAnnouncement.comments[1].id}`);

    expect(res.statusCode).toBe(NO_CONTENT);
  });

  test(`for non-existing comment status code should be GONE`, async () => {
    const tempAnnouncement = await request(app).post(`/api/offers`)
      .send(newAnnouncement);
    const res = await request(app)
      .delete(`/api/offers/${tempAnnouncement.body.id}/comments/${MOCK_ID}`);

    expect(res.statusCode).toBe(GONE);
  });
});

describe(`add comment`, () => {
  test(`when add comment for existing announcement should return new comment id`, async () => {
    const tempAnnouncement = await request(app).post(`/api/offers`)
      .send(newAnnouncement);
    const res = await request(app)
      .post(`/api/offers/${tempAnnouncement.body.id}/comments`)
      .send(newComment);

    expect(res.statusCode).toBe(CREATED);
  });

  test(`when sending not all params status code should be BAD_REQUEST`, async () => {
    const tempAnnouncement = await request(app).post(`/api/offers`)
      .send(newAnnouncement);
    const res = await request(app)
      .post(`/api/offers/${tempAnnouncement.body.id}/comments`)
      .send({text: `some text`, orText: `another text`});

    expect(res.statusCode).toBe(BAD_REQUEST);
  });
});
