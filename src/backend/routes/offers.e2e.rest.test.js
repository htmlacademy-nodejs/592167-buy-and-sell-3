'use strict';

const request = require(`supertest`);
const announcementRepository = require(`../repositories/announcement`);


const app = require(`../app`);

const {
  OK,
  NO_CONTENT,
  GONE,
  BAD_REQUEST,
  CREATED,
  NOT_FOUND
} = require(`../../constants`).HttpCode;
const {MOCK_ANNOUNCEMENT} = require(`../../constants`);


const MOCK_ID = 123456;
const newAnnouncement = Object.assign({}, MOCK_ANNOUNCEMENT);
delete newAnnouncement.comments;
const expectedComments = MOCK_ANNOUNCEMENT.comments;
const newComment = {text: `some text`};

const addMockAnnouncement = () => announcementRepository.save(MOCK_ANNOUNCEMENT);
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
    const id = addMockAnnouncement();
    const res = await request(app).get(`/api/offers/${id}`);

    expect(res.statusCode).toBe(OK);
    expect(res.body).toHaveProperty(`id`);
    expect(res.body).toHaveProperty(`title`);
    expect(res.body).toHaveProperty(`categories`);
    expect(res.body).toHaveProperty(`description`);
    expect(res.body).toHaveProperty(`picture`);
    expect(res.body).toHaveProperty(`type`);
    expect(res.body).toHaveProperty(`sum`);
    expect(res.body).toHaveProperty(`comments`);

    deleteMockAnnouncement(id);
  });

  test(`for non-existing announcement status code should be GONE`, async () => {
    const res = await request(app).get(`/api/offers/${MOCK_ID}`);
    expect(res.statusCode).toBe(GONE);
  });
});

describe(`post announcement`, () => {
  test(`when adding new announcement should return new id`, async () => {
    const res = await request(app).post(`/api/offers`).send(newAnnouncement);

    const announcementId = res.body.id;

    const announcement = await request(app).get(`/api/offers/${announcementId}`);

    expect(announcement.body.title).toBe(newAnnouncement.title);

    deleteMockAnnouncement(announcementId);
  });

  test(`when sending not all params status code should be BAD_REQUEST`, async () => {
    const tempAnnouncement = {title: `some title`};
    const res = await request(app).post(`/api/offers`).send(tempAnnouncement);

    expect(res.statusCode).toBe(BAD_REQUEST);
  });
});

describe(`update announcement`, () => {
  test(`when updating announcement title should be 'new title'`, async () => {
    const id = addMockAnnouncement();
    await request(app).put(`/api/offers/${id}`)
      .send(newAnnouncement);
    const res = await request(app).get(`/api/offers/${id}`);

    expect(res.body.title).toBe(newAnnouncement.title);

    deleteMockAnnouncement(id);
  });

  test(`when sending not all params status code should be BAD_REQUEST`, async () => {
    const tempAnnouncement = {title: `some title`};
    const id = addMockAnnouncement();
    const res = await request(app).put(`/api/offers/${id}`)
      .send(tempAnnouncement);

    expect(res.statusCode).toBe(BAD_REQUEST);

    deleteMockAnnouncement(id);
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
    const id = addMockAnnouncement();
    const res = await request(app).delete(`/api/offers/${MOCK_ID}${id}`);

    expect(res.statusCode).toBe(GONE);

    deleteMockAnnouncement(id);
  });
});

describe(`get all comments from announcement`, () => {
  test(`for existing announcement should return all comments`, async () => {
    const id = addMockAnnouncement();
    const res = await request(app).get(`/api/offers/${id}/comments`);

    expect(res.body).toEqual(expectedComments);

    deleteMockAnnouncement(id);
  });

  test(`for non-existing announcement status code should be GONE`, async () => {
    const res = await request(app).get(`/api/offers/${MOCK_ID}/comments`);

    expect(res.statusCode).toBe(GONE);
  });
});

describe(`delete comments from announcement`, () => {
  test(`for existing announcement and comment delete it by id`, async () => {
    const id = addMockAnnouncement();
    // const temp = await request(app).get(`/api/offers/${id}`);
    // console.log(temp.body, expectedComments[1].id);
    const res = await request(app)
      .delete(`/api/offers/${id}/comments/${expectedComments[1].id}`);

    // console.log(res.body);
    expect(res.statusCode).toBe(NO_CONTENT);

    deleteMockAnnouncement(id);
  });

  test(`for non-existing comment status code should be GONE`, async () => {
    const id = addMockAnnouncement();
    const res = await request(app)
      .delete(`/api/offers/${id}/comments/${MOCK_ID}`);

    expect(res.statusCode).toBe(GONE);

    deleteMockAnnouncement(id);
  });
});

describe(`add comment`, () => {
  test(`when add comment for existing announcement should return new comment id`, async () => {
    const id = addMockAnnouncement();
    const res = await request(app)
      .post(`/api/offers/${id}/comments`)
      .send(newComment);

    expect(res.statusCode).toBe(CREATED);

    deleteMockAnnouncement(id);
  });

  test(`when sending not all params status code should be BAD_REQUEST`, async () => {
    const id = addMockAnnouncement();
    const res = await request(app)
      .post(`/api/offers/${id}/comments`)
      .send({text: `some text`, orText: `another text`});

    expect(res.statusCode).toBe(BAD_REQUEST);

    deleteMockAnnouncement(id);
  });
});
