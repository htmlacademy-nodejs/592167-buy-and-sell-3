'use strict';

const request = require(`supertest`);
const app = require(`../app`);

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
  test(`When get offers status code should be 200`, async () => {
    const res = await request(app).get(`/api/offers`);
    expect(res.statusCode).toBe(200);
  });

  test(`when route is not correct status code should be 404`, async () => {
    const res = await request(app).get(`/api/no-offers`);
    expect(res.statusCode).toBe(404);
  });
});

describe(`get announcement`, () => {
  test(`when get announce should had properties id and title`, async () => {
    const res = await request(app).get(`/api/offers/rxc7bK`);
    expect(res.body).toHaveProperty(`id`);
    expect(res.body).toHaveProperty(`title`);
  });

  test(`for non-existing announcement status code should be 410`, async () => {
    const res = await request(app).get(`/api/offers/${MOCK_ID}`);
    expect(res.statusCode).toBe(410);
  });
});

describe(`post announcement`, () => {
  test(`when adding new announcement should return new id`, async () => {
    const res = await request(app).post(`/api/offers`).send(newAnnouncement);

    const id = res.body.id;

    const announcement = await request(app).get(`/api/offers/${id}`);

    expect(announcement.body.title).toBe(newAnnouncement.title);
  });

  test(`when sending not all params status code should be 400`, async () => {
    const tempAnnouncement = {title: `some title`};
    const res = await request(app).post(`/api/offers`).send(tempAnnouncement);

    expect(res.statusCode).toBe(400);
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

  test(`when sending not all params status code should be 400`, async () => {
    const tempAnnouncement = {title: `some title`};
    const announcement = await request(app).post(`/api/offers`)
      .send(newAnnouncement);
    const res = await request(app).put(`/api/offers/${announcement.body.id}`)
      .send(tempAnnouncement);

    expect(res.statusCode).toBe(400);
  });

  test(`when updating non-existing announcement status code should be 410`, async () => {
    const res = await request(app).put(`/api/offers/${MOCK_ID}`)
      .send(updateAnnouncement);

    expect(res.statusCode).toBe(410);
  });
});

describe(`delete announcement`, () => {
  test(`for existing announcement after delete should return status
  code 204`, async () => {
    const tempAnnouncement = await request(app).post(`/api/offers`)
      .send(newAnnouncement);
    const res = await request(app).delete(`/api/offers/${tempAnnouncement.body.id}`);

    expect(res.statusCode).toBe(204);
  });

  test(`when deleting non-existing announcement status code should be 410`, async () => {
    const res = await request(app).delete(`/api/offers/${MOCK_ID}`);

    expect(res.statusCode).toBe(410);
  });
});

describe(`get all comments from announcement`, () => {
  test(`for existing announcement should return all comments`, async () => {
    const tempAnnouncement = await request(app).post(`/api/offers`)
      .send(newAnnouncement);
    const res = await request(app).get(`/api/offers/${tempAnnouncement.body.id}/comments`);

    expect(res.body).toEqual(newAnnouncement.comments);
  });

  test(`for non-existing announcement status code should be 410`, async () => {
    const res = await request(app).get(`/api/offers/${MOCK_ID}/comments`);

    expect(res.statusCode).toBe(410);
  });
});

describe(`delete comments from announcement`, () => {
  test(`for existing announcement and comment delete it by id`, async () => {
    const tempAnnouncement = await request(app).post(`/api/offers`).send(newAnnouncement);
    const res = await request(app)
      .delete(`/api/offers/${tempAnnouncement.body.id}/comments/${newAnnouncement.comments[1].id}`);

    expect(res.statusCode).toBe(204);
  });

  test(`for non-existing comment status code should be 410`, async () => {
    const tempAnnouncement = await request(app).post(`/api/offers`)
      .send(newAnnouncement);
    const res = await request(app)
      .delete(`/api/offers/${tempAnnouncement.body.id}/comments/${MOCK_ID}`);

    expect(res.statusCode).toBe(410);
  });
});

describe(`add comment`, () => {
  test(`when add comment for existing announcement should return new comment id`, async () => {
    const tempAnnouncement = await request(app).post(`/api/offers`)
      .send(newAnnouncement);
    const res = await request(app)
      .post(`/api/offers/${tempAnnouncement.body.id}/comments`)
      .send(newComment);

    expect(res.statusCode).toBe(201);
  });

  test(`when sending not all params status code should be 400`, async () => {
    const tempAnnouncement = await request(app).post(`/api/offers`)
      .send(newAnnouncement);
    const res = await request(app)
      .post(`/api/offers/${tempAnnouncement.body.id}/comments`)
      .send({text: `some text`, orText: `another text`});

    expect(res.statusCode).toBe(400);
  });
});
