'use strict';

const request = require(`supertest`);

const app = require(`../app`);
const announcementRepository = require(`../repositories/announcement`);
const {OK} = require(`../../constants`).HttpCode;

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

const addMockAnnouncement = () => announcementRepository.save(Object.assign({}, MOCK_ANNOUNCEMENT));
const deleteMockAnnouncement = (id) => announcementRepository.remove(id);

describe(`categories`, () => {
  test(`for non-existing mock.json categories list should be empty`, async () => {
    const res = await request(app).get(`/api/categories`);

    expect(res.statusCode).toBe(OK);
    expect(res.body.length === 0).toBeTruthy();
  });

  test(`is categories with 'Программирование'`, async () => {
    const id = addMockAnnouncement();
    const expectedCategory = `Программирование`;
    const res = await request(app).get(`/api/categories`);

    expect(res.body).toContain(expectedCategory);

    deleteMockAnnouncement(id);
  });
});
