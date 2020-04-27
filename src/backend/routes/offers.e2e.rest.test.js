'use strict';

const request = require(`supertest`);
const fs = require(`fs`).promises;
const fsSync = require(`fs`);


const app = require(`../app`);

const {
  OK,
  NO_CONTENT,
  GONE,
  BAD_REQUEST,
  // CREATED,
  NOT_FOUND} = require(`../../constants`).HttpCode;
const {MOCK_FILE_NAME, MOCK_ANNOUNCEMENT} = require(`../../constants`);


const MOCK_ID = 123456;
const newAnnouncement = {
  title: `some title`,
  comments: [
    {
      id: `EvDdCm`,
      text: `Почему в таком ужасном состоянии? Неплохо, но дорого.`
    },
    {
      id: `z65rvX`,
      text: `Продаю в связи с переездом. Отрываю от сердца. Вы что?! В магазине дешевле. Совсем немного...  А сколько игр в комплекте? Неплохо, но дорого. А где блок питания. Почему в таком ужасном состоянии?`
    },
    {
      id: `nFBrDX`,
      text: `В магазине дешевле.`
    },
    {
      id: `-OB7D4`,
      text: `Продаю в связи с переездом. Отрываю от сердца. Совсем немного... Неплохо, но дорого. А сколько игр в комплекте? Почему в таком ужасном состоянии?`
    },
    {
      id: `C6DDtC`,
      text: `Вы что?! В магазине дешевле. А сколько игр в комплекте?`
    },
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
// const newComment = {text: `some text`};

const createMockDatabase = async () => {
  let announcement;
  await fs.writeFile(MOCK_FILE_NAME, JSON.stringify(MOCK_ANNOUNCEMENT));
  if (fsSync.existsSync(MOCK_FILE_NAME)) {
    try {
      announcement = JSON.parse(fsSync.readFileSync(MOCK_FILE_NAME));
      return announcement[0].id;
    } catch (err) {
      console.log(err);
    }
  }

  return MOCK_ID;
};


describe(`get all announcements`, () => {
  test(`When get offers status code should be OK`, async () => {
    await createMockDatabase();
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
    await createMockDatabase();
    const res = await request(app).get(`/api/no-offers`);

    expect(res.statusCode).toBe(NOT_FOUND);
  });
});

describe(`get announcement`, () => {
  test(`when get announce should had properties id and title`, async () => {
    const id = await createMockDatabase();
    const res = await request(app).get(`/api/offers/${id}`);
    // const res = await request(app).get(`/api/offers/F4brz5`);

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

    const AnnouncementId = res.body.id;

    const announcement = await request(app).get(`/api/offers/${AnnouncementId}`);

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
    const id = await createMockDatabase();
    await request(app).put(`/api/offers/${id}`)
      .send(updateAnnouncement);
    const res = await request(app).get(`/api/offers/${id}`);

    expect(res.body.title).toBe(updateAnnouncement.title);
  });

  test(`when sending not all params status code should be BAD_REQUEST`, async () => {
    const tempAnnouncement = {title: `some title`};
    const id = await createMockDatabase();
    const res = await request(app).put(`/api/offers/${id}`)
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
    const id = await createMockDatabase();
    const res = await request(app).delete(`/api/offers/${id}`);

    expect(res.statusCode).toBe(NO_CONTENT);
  });

  test(`when deleting non-existing announcement status code should be GONE`, async () => {
    const id = await createMockDatabase();
    const res = await request(app).delete(`/api/offers/${MOCK_ID}${id}`);

    expect(res.statusCode).toBe(GONE);
  });
});

describe(`get all comments from announcement`, () => {
  test(`for existing announcement should return all comments`, async () => {
    const id = await createMockDatabase();
    const res = await request(app).get(`/api/offers/${id}/comments`);
    console.log(res.body);

    expect(res.body).toEqual(newAnnouncement.comments);
  });

  test(`for non-existing announcement status code should be GONE`, async () => {
    const res = await request(app).get(`/api/offers/${MOCK_ID}/comments`);

    expect(res.statusCode).toBe(GONE);
  });
});

describe(`delete comments from announcement`, () => {
  // test(`for existing announcement and comment delete it by id`, async () => {
  //   const id = await createMockDatabase();
  //   const res = await request(app)
  //     .delete(`/api/offers/${id}/comments/${newAnnouncement.comments[1].id}`);
  //
  //   expect(res.statusCode).toBe(NO_CONTENT);
  // });

  test(`for non-existing comment status code should be GONE`, async () => {
    const id = await createMockDatabase();
    const res = await request(app)
      .delete(`/api/offers/${id}/comments/${MOCK_ID}`);

    expect(res.statusCode).toBe(GONE);
  });
});

describe(`add comment`, () => {
  // test(`when add comment for existing announcement should return new comment id`, async () => {
  //   const id = await createMockDatabase();
  //   const res = await request(app)
  //     .post(`/api/offers/${id}/comments`)
  //     .send(newComment);
  //
  //   expect(res.statusCode).toBe(CREATED);
  // });

  test(`when sending not all params status code should be BAD_REQUEST`, async () => {
    const id = await createMockDatabase();
    const res = await request(app)
      .post(`/api/offers/${id}/comments`)
      .send({text: `some text`, orText: `another text`});

    expect(res.statusCode).toBe(BAD_REQUEST);
  });
});
