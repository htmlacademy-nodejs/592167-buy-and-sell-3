'use strict';

const announcementRepository = require(`../repositories/announcement`);
jest.mock(`../repositories/announcement`);

const underTest = require(`./announcement`);
const {AnnouncementNotFoundError} = require(`../errors/errors`);

const MOCK_ID = 123456;

describe(`getAll`, () => {
  test(`for all announcements array length should be 3`, () => {
    const expectedAnnouncements = [{}, {}, {}];
    announcementRepository.findAll.mockReturnValue(expectedAnnouncements);

    const countAnnouncements = underTest.getAll().length;

    expect(countAnnouncements).toBe(3);
  });
});

describe(`getById`, () => {
  test(`for existing announcement should return it`, () => {
    announcementRepository.exists.mockReturnValue(true);
    const expectedAnnouncement = {id: MOCK_ID, title: `some title`};
    announcementRepository.findById.mockReturnValue(expectedAnnouncement);

    const actual = underTest.getById(MOCK_ID);

    expect(actual).toBe(expectedAnnouncement);
    expect(announcementRepository.exists).toHaveBeenCalledWith(MOCK_ID);
    expect(announcementRepository.findById).toHaveBeenCalledWith(MOCK_ID);
  });

  test(`for non-existing announcement should throw error`, () => {
    announcementRepository.exists.mockReturnValue(false);

    expect(() => underTest.getById(MOCK_ID))
      .toThrowError(new AnnouncementNotFoundError(MOCK_ID));
  });
});

describe(`create`, () => {
  test(`when adding new announcement should return new id`, () => {
    announcementRepository.save.mockReturnValue(MOCK_ID);
    const newAnnouncement = {title: `some title`};

    const annoncementId = underTest.create(newAnnouncement);

    expect(annoncementId).toBe(MOCK_ID);
  });
});

describe(`update`, () => {
  test(`for existing announcement should return id`, () => {
    announcementRepository.exists.mockReturnValue(true);
    const newAnnouncement = {title: `some title`};
    announcementRepository.save.mockReturnValue(MOCK_ID);

    const actual = underTest.update(newAnnouncement, MOCK_ID);

    expect(actual).toBe(MOCK_ID);
    expect(announcementRepository.findById).toHaveBeenCalledWith(MOCK_ID);
  });

  test(`for non-existing announcement should throw error`, () => {
    announcementRepository.exists.mockReturnValue(false);

    expect(() => underTest.update({}, MOCK_ID))
      .toThrowError(new AnnouncementNotFoundError(MOCK_ID));
  });
});

describe(`remove`, () => {
  test(`for existing announcement should return message`, () => {
    announcementRepository.exists.mockReturnValue(true);
    const message = `announcement with id ${MOCK_ID} deleted successful`;
    announcementRepository.remove.mockReturnValue(message);

    const actual = underTest.remove(MOCK_ID);

    expect(actual).toBe(message);
    expect(announcementRepository.remove).toHaveBeenCalledWith(MOCK_ID);
  });

  test(`for non-existing anouncement should return error`, () => {
    announcementRepository.exists.mockReturnValue(false);

    expect(() => underTest.remove(MOCK_ID))
      .toThrowError(new AnnouncementNotFoundError(MOCK_ID));
  });
});

describe(`search`, () => {
  const expectedAnnouncement = {id: MOCK_ID, title: `some title`};
  announcementRepository.findByTitle.mockReturnValue(expectedAnnouncement);

  const actual = underTest.search(`title`);

  expect(actual).toBe(expectedAnnouncement);
  expect(announcementRepository.findByTitle).toHaveBeenCalledWith(`title`);
});
