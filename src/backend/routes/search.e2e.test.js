'use strict';

const request = require(`supertest`);
const app = require(`../app`);
const announcementRepository = require(`../repositories/announcement`);

const MOCK_ANNOUNCEMENT = {
  categories: [
    `Посуда`,
    `Программирование`
  ],
  description: `Это настоящая находка для коллекционера! Задача организации, в особенности же постоянное информационно-техническое обеспечение нашей деятельности требует от нас анализа модели. Повседневная практика показывает, что консультация с профессионалами из IT играет важную роль в формировании позиций. Даю недельную гарантию.`,
  picture: `item08.jpg`,
  title: `Самый остроумный заголовок, который я смог придумать.`,
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

const addMockAnnouncement = () => announcementRepository.save(MOCK_ANNOUNCEMENT);
const deleteMockAnnouncement = (id) => announcementRepository.remove(id);

describe(`search title`, () => {
  test(`if title contains substring search should return announcements list`, async () => {
    const id = addMockAnnouncement();

    const expectedAnnouncements = [];
    const announcement = Object.assign({}, MOCK_ANNOUNCEMENT);
    announcement.id = id;
    expectedAnnouncements.push(announcement);

    const res = await request(app).get(encodeURI(`/api/search?query=Самый остроумный`));

    expect(res.body).toEqual(expectedAnnouncements);

    deleteMockAnnouncement(id);
  });

  test(`if title not contains substring search should return empty list`, async () => {
    const res = await request(app).get(`/api/search?query=111111`);

    expect(res.body.length === 0).toBeTruthy();
  });
});
