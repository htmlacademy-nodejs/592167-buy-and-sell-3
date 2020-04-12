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
    announcementRepository.exists.mockReturnValue(true);
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
    console.log(actual);

    expect(actual).toBe(MOCK_ID);
    expect(announcementRepository.findById).toHaveBeenCalledWith(MOCK_ID);
  });

  test(`for non-existing announcement should throw error`, () => {
    announcementRepository.exists.mockReturnValue(false);

    expect(() => underTest.update({}, MOCK_ID))
      .toThrowError(new AnnouncementNotFoundError(MOCK_ID));
  });
});
