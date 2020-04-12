'use strict';

const commentRepository = require(`../repositories/comment`);
const announcementRepository = require(`../repositories/announcement`);
jest.mock(`../repositories/comment`);
jest.mock(`../repositories/announcement`);

const underTest = require(`./comment`);
const {AnnouncementNotFoundError, CommentNotFoundError} = require(`../errors/errors`);

const MOCK_ID = 123456;

describe(`getByAnnouncementId`, () => {
  test(`method should return comments`, () => {
    const expectedComments = [``, ``, ``];
    commentRepository.findByAnnouncementId.mockReturnValue(expectedComments);

    const actual = underTest.getByAnnouncementId(MOCK_ID);

    expect(actual).toEqual(expectedComments);
  });
});

describe(`add`, () => {
  test(`for exists comment should return id`, () => {
    announcementRepository.exists.mockReturnValue(true);
    const expectedComments = [{}, {}];
    commentRepository.save.mockReturnValue(expectedComments);

    const actual = underTest.add({text: `some text`}, MOCK_ID);

    expect(actual).toEqual(expectedComments);
  });

  test(`for non-exists comment should return error`, () => {
    announcementRepository.exists.mockReturnValue(false);

    expect(() => underTest.add({}, MOCK_ID))
      .toThrowError(new AnnouncementNotFoundError(MOCK_ID));
  });
});

describe(`remove`, () => {
  test(`for exists comment should return message`, () => {
    commentRepository.exists.mockReturnValue(true);
    const message = `comment with id ${MOCK_ID} deleted successful`;
    commentRepository.remove.mockReturnValue(message);

    const actual = underTest.remove(MOCK_ID, MOCK_ID);

    expect(actual).toBe(message);
  });

  test(`for non-exists comment should return error`, () => {
    commentRepository.exists.mockReturnValue(false);

    expect(() => underTest.remove(MOCK_ID, MOCK_ID))
      .toThrowError(new CommentNotFoundError(MOCK_ID, MOCK_ID));
  });
});
