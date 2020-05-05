'use strict';

const request = require(`supertest`);

const app = require(`../app`);
const announcementRepository = require(`../repositories/announcement`);

const {
  OK,
  NO_CONTENT,
  GONE,
  BAD_REQUEST,
  CREATED,
  NOT_FOUND
} = require(`../../constants`).HttpCode;

const MOCK_ANNOUNCEMENT = {
  categories: [
    `Посуда`,
    `Программирование`
  ],
  description: `Это настоящая находка для коллекционера! Задача организации, в особенности же постоянное информационно-техническое обеспечение нашей деятельности требует от нас анализа модели. Повседневная практика показывает, что консультация с профессионалами из IT играет важную роль в формировании позиций. Даю недельную гарантию.`,
  picture: `item08.jpg`,
  title: `Двадцать пять невероятных животных, которые покорили мир`,
  type: `OFFER`,
  sum: 64652,
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
  ]
};


const MOCK_ID = 123456;
const newAnnouncement = Object.assign({}, MOCK_ANNOUNCEMENT);
delete newAnnouncement.comments;
const expectedComments = MOCK_ANNOUNCEMENT.comments;
const newComment = {text: `some text`};

let tempId;

beforeEach(() => {
  tempId = addMockAnnouncement();
});

afterEach(() => {
  deleteMockAnnouncement(tempId);
});

const addMockAnnouncement = () => announcementRepository.save(Object.assign({}, MOCK_ANNOUNCEMENT));
const deleteMockAnnouncement = (id) => announcementRepository.remove(id);


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
    const res = await request(app).get(`/api/offers/${tempId}`);
    expect(res.statusCode).toBe(OK);

    const expectedBody = Object.assign({}, MOCK_ANNOUNCEMENT);
    expectedBody.id = tempId;
    expect(res.body).toEqual(expectedBody);
  });

  test(`for non-existing announcement status code should be GONE`, async () => {
    const res = await request(app).get(`/api/offers/${MOCK_ID}`);
    expect(res.statusCode).toBe(GONE);
  });
});

describe(`post announcement`, () => {
  test(`when adding new announcement should return new id`, async () => {
    const res = await request(app).post(`/api/offers`).send(newAnnouncement);
    const expectedAnnouncement = Object.assign({}, newAnnouncement);
    expectedAnnouncement.id = res.body.id;

    const announcement = await request(app).get(`/api/offers/${expectedAnnouncement.id}`);

    expect(announcement.body).toEqual(expectedAnnouncement);

    deleteMockAnnouncement(expectedAnnouncement.id);
  });

  test(`when sending not all params status code should be BAD_REQUEST`, async () => {
    const tempAnnouncement = {title: `some title`};
    const res = await request(app).post(`/api/offers`).send(tempAnnouncement);

    const expectedResponse = {code: 1, message: `Send not all params for new announcement.`};
    expect(res.statusCode).toBe(BAD_REQUEST);
    expect(res.body).toEqual(expectedResponse);
  });
});

describe(`update announcement`, () => {
  test(`when updating announcement title should be 'new title'`, async () => {
    await request(app).put(`/api/offers/${tempId}`)
      .send(newAnnouncement);
    const res = await request(app).get(`/api/offers/${tempId}`);

    expect(res.body.title).toBe(newAnnouncement.title);
  });

  test(`when sending not all params status code should be BAD_REQUEST`, async () => {
    const tempAnnouncement = {title: `some title`};
    const res = await request(app).put(`/api/offers/${tempId}`)
      .send(tempAnnouncement);

    expect(res.statusCode).toBe(BAD_REQUEST);
  });

  test(`when updating non-existing announcement status code should be GONE`, async () => {
    const res = await request(app).put(`/api/offers/${MOCK_ID}`)
      .send(newAnnouncement);

    expect(res.statusCode).toBe(GONE);
  });
});

describe(`delete announcement`, () => {
  test(`for existing announcement after delete should return status
  code NO_CONTENT`, async () => {
    const id = addMockAnnouncement();
    const res = await request(app).delete(`/api/offers/${id}`);

    expect(res.statusCode).toBe(NO_CONTENT);
  });

  test(`when deleting non-existing announcement status code should be GONE`, async () => {
    const res = await request(app).delete(`/api/offers/${MOCK_ID}`);

    expect(res.statusCode).toBe(GONE);
  });
});

describe(`get all comments from announcement`, () => {
  test(`for existing announcement should return all comments`, async () => {
    const res = await request(app).get(`/api/offers/${tempId}/comments`);

    expect(res.body).toEqual(expectedComments);
  });

  test(`for non-existing announcement status code should be GONE`, async () => {
    const res = await request(app).get(`/api/offers/${MOCK_ID}/comments`);

    expect(res.statusCode).toBe(GONE);
  });
});

describe(`delete comments from announcement`, () => {
  test(`for existing announcement and comment delete it by id`, async () => {
    const res = await request(app)
      .delete(`/api/offers/${tempId}/comments/${expectedComments[1].id}`);

    expect(res.statusCode).toBe(NO_CONTENT);
  });

  test(`for existing announcement and non-existing comment status code should be GONE`, async () => {
    const res = await request(app)
      .delete(`/api/offers/${tempId}/comments/${MOCK_ID}`);

    expect(res.statusCode).toBe(GONE);
  });
});

describe(`add comment`, () => {
  test(`when add comment for existing announcement should return new comment id`, async () => {
    const res = await request(app)
      .post(`/api/offers/${tempId}/comments`)
      .send(newComment);

    expect(res.statusCode).toBe(CREATED);
  });

  test(`when sending not all params status code should be BAD_REQUEST`, async () => {
    const res = await request(app)
      .post(`/api/offers/${tempId}/comments`)
      .send({text: `some text`, orText: `another text`});

    expect(res.statusCode).toBe(BAD_REQUEST);
  });
});
