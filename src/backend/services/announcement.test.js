'use strict';

const announcementRepository = require(`../repositories/announcement`);
const categoriesRepository = require(`../repositories/categories`);
jest.mock(`../repositories/announcement`);
jest.mock(`../repositories/categories`);

const underTest = require(`./announcement`);
const {MOCK_USER_ID, MOCK_ANNOUNCEMENT_ID} = require(`../../constants`);

describe(`getAll`, () => {
  test(`actual announcement list should equal expected`, async () => {
    const expectedAnnouncements = [{}, {}];
    announcementRepository.findAll.mockReturnValue(expectedAnnouncements);

    const countAnnouncements = await underTest.getAll();

    expect(countAnnouncements).toBe(expectedAnnouncements);
  });
});

describe(`getMyAnnouncements`, () => {
  test(`actual my announcement list should equal expected`, async () => {
    const returnedAnnouncementsFromRepository = [
      {
        image: ``,
        Announcement: {
          dataValues: {
            id: 1,
            title: ``,
            sum: 11,
            Type: {
              dataValues: {
                type: ``
              }
            },
          },
        },
      }
    ];
    const expectedAnnouncements = [
      {
        image: ``,
        id: 1,
        title: ``,
        sum: 11,
        type: ``,
      }
    ];
    announcementRepository.findMyAnnouncements.mockReturnValue(returnedAnnouncementsFromRepository);

    const countAnnouncements = await underTest.getMyAnnouncements();

    expect(countAnnouncements).toEqual(expectedAnnouncements);
  });
});

describe(`getTheNewestAnnouncements`, () => {
  test(`newest announcements should equal expect`, async () => {
    const returnedValueFromRepository = [{
      id: 1,
      title: ``,
      description: ``,
      sum: 11,
      Type: {
        type: ``,
      },
      Images: [
        {
          image: ``,
        },
        {
          image: ``,
        }
      ],
      Categories: [
        {}, {}, {}
      ],
    }];
    const expectedAnnouncements = [
      {
        id: 1,
        title: ``,
        description: ``,
        sum: 11,
        type: ``,
        image: ``,
        categories: [{}, {}, {}],
      },
    ];
    announcementRepository.getTheNewestAnnouncements.mockReturnValue(returnedValueFromRepository);

    const actualAnnouncements = await underTest.getTheNewestAnnouncements();
    expect(actualAnnouncements).toEqual(expectedAnnouncements);
  });
});

describe(`getMostDiscussed`, () => {
  test(`actual most discussed list should equal expected`, async () => {
    const returnedAnnouncementFromRepository = [
      {comments: `2`}, {comments: `5`}, {comments: `0`}
    ];
    const expectedAnnouncement = [
      {comments: `2`}, {comments: `5`}
    ];
    announcementRepository.getMostDiscussed.mockReturnValue(returnedAnnouncementFromRepository);
    const actualAnnouncements = await underTest.getMostDiscussed();
    expect(actualAnnouncements).toEqual(expectedAnnouncement);
  });
});

describe(`create`, () => {
  test(`add new announcement should return new id`, async () => {
    const expectedAnnouncements = {id: 1};
    const mockAnnouncement = {
      [`ticket-name`]: `salkfjasff`,
      comment: `soda lajsdflk basf wureoiweu lskjflsdj owieuriweu sdjflksdj flksjdf weurweur`,
      category: [`4`, `1`],
      price: `32423`,
      action: `sell`,
      image: `cfa50d60ca6cee563b17fda8d4fffd40.jpg`
    };
    announcementRepository.save.mockReturnValue(expectedAnnouncements);
    const newAnnouncement = await underTest.create(mockAnnouncement);
    expect(newAnnouncement).toEqual(expectedAnnouncements);
  });
});

describe(`search`, () => {
  test(`search should return fill array or empty array`, async () => {
    const expectedAnnouncement = [
      {
        id: 1,
        image: ``,
        title: ``,
        type: 1,
        sum: 2323,
        description: ``,
        categories: [
          {id: 1, category: ``},
          {id: 2, category: ``},
        ]
      }
    ];
    const returnedAnnouncementsFromRepository = [
      {
        image: ``,
        Announcement: {
          id: 1,
          title: ``,
          sum: 2323,
          description: ``,
          Type: {
            type: 1,
          },
          Categories: [
            {
              id: 1, category: ``,
            },
            {
              id: 2, category: ``,
            }
          ],
        },
      }
    ];
    announcementRepository.findByTitle.mockReturnValue(returnedAnnouncementsFromRepository);
    const announcements = await underTest.search(``);
    expect(announcements).toEqual(expectedAnnouncement);
  });
});

describe(`getListCommentsForUserAnnouncements`, () => {
  test(`should return announcements only current user`, async () => {
    const expectedAnnouncement = [
      {
        id: 3,
        title: ``,
        sum: 79140,
        type: `Продам`,
        comments: [
          {
            id: 1,
            comment: ``,
            user: `Bob Builder`,
          },
        ],
      },
    ];
    const returnAnnouncementsListUser = [
      {
        id: 3,
        title: ``,
        sum: 79140,
      },
    ];
    const returnCommentsForAnnouncement = [
      {
        id: 1,
        comment: ``,
        User: {
          userName: `Bob Builder`,
        },
      },
    ];
    announcementRepository.getAnnouncementsListUser.mockReturnValue(returnAnnouncementsListUser);
    announcementRepository.getCommentsForAnnouncement.mockReturnValue(returnCommentsForAnnouncement);
    const announcements = await underTest.getListCommentsForUserAnnouncements(MOCK_USER_ID);
    expect(announcements).toEqual(expectedAnnouncement);
  });
});

describe(`getAnnouncement`, () => {
  test(`should return full info by announcement`, async () => {
    const expectedAnnouncement = {
      image: ``,
      id: 1,
      title: ``,
      sum: 11,
      description: ``,
      createdAt: `1 января 2020`,
      type: `Продам`,
      author: `Bob Builder`,
      email: `nikita@mail.ru`,
      categories: [
        {category: `Моделирование`, id: 5, selected: false},
        {category: `Искусство`, id: 4, selected: false},
        {category: `Программирование`, id: 2, selected: false},
        {category: `Журналы`, id: 1, selected: true},
        {category: `Психология`, id: 3, selected: false}
      ],
      comments: [
        {comment: ``, author: `Bob Builder`},
      ],
    };
    const mockGetAnnouncement = [
      {
        image: ``,
        Announcement: {
          id: 1,
          title: ``,
          sum: 11,
          description: ``,
          createdAt: `2020-01-01 23:18:17.290000`,
          Type: {
            type: `Продам`,
          },
          User: {
            email: `nikita@mail.ru`,
            userName: `Bob Builder`,
          },
          Categories: [
            {id: 1, category: `Журналы`},
            {id: 2, category: `Программы`},
          ],
        },
      },
    ];
    const mockGetCommentsForAnnouncement = [
      {
        comment: ``,
        User: {
          userName: `Bob Builder`,
        },
      },
    ];
    const mockFindAllCategories = [
      {id: 5, category: `Моделирование`, categorycount: `7`},
      {id: 4, category: `Искусство`, categorycount: `10`},
      {id: 2, category: `Программирование`, categorycount: `6`},
      {id: 1, category: `Журналы`, categorycount: `8`},
      {id: 3, category: `Психология`, categorycount: `6`},
    ];
    announcementRepository.getAnnouncement.mockReturnValue(mockGetAnnouncement);
    announcementRepository.getCommentsForAnnouncement.mockReturnValue(mockGetCommentsForAnnouncement);
    categoriesRepository.findAll.mockReturnValue(mockFindAllCategories);

    const announcement = await underTest.getAnnouncement(MOCK_ANNOUNCEMENT_ID);
    expect(announcement).toEqual(expectedAnnouncement);
  });
});

describe(`addComment`, () => {
  test(`should return id new comment`, async () => {
    const expectedComment = {
      id: 15,
      comment: ``,
      announcementId: 1,
      userId: 3,
    };
    const mockNewComment = {
      comment: `alsdfjlaj lasjflj aslkjfklasj kfjsakdjflkasdj kfljasdlkfjklasdjf kljads`,
      offersId: 1,
      userId: 3,
    };
    announcementRepository.addComment.mockReturnValue(expectedComment);
    const newComment = await underTest.addComment(mockNewComment);
    expect(newComment).toEqual(expectedComment);
  });
});

describe(`edit`, () => {
  test(`should return something`, async () => {
    const editAnnouncement = {
      action: `sell`,
      [`ticket-name`]: `45 необычных книг без картинок, которые стоит прочитать`,
      comment: `Продаю с болью в сердце. Так как сам очень люблю этого писателя. И просто тащусь от его работ.`,
      price: `1212`,
      category: [`1`, `2`],
    };
    const announcementId = 1;
    const expectedAnnouncement = {
      id: 1,
    };
    announcementRepository.edit.mockReturnValue(expectedAnnouncement);
    const editedAnnouncement = await underTest.edit(editAnnouncement, announcementId);
    expect(editedAnnouncement).toEqual(expectedAnnouncement);
  });
});

describe(`remove`, () => {
  test(`should return id deleted announcement`, async () => {
    const expectedAnnouncement = {
      id: 1,
    };
    const announcementId = 1;
    announcementRepository.remove.mockReturnValue(expectedAnnouncement);
    const removeAnnouncement = await underTest.remove(announcementId);
    expect(removeAnnouncement).toEqual(expectedAnnouncement);
  });
});
