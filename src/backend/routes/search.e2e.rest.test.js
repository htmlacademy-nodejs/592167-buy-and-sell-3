'use strict';

const request = require(`supertest`);
const app = require(`../app`);

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

describe(`search title`, () => {
  test(`search announcements by substring`, async () => {
    const tempAnnouncement = await request(app).post(`/api/offers`)
      .send(newAnnouncement);
    const res = await request(app).get(encodeURI(`/api/search?query=title`));

    expect(res.body[0].id).toBe(tempAnnouncement.body.id);
  });
});
