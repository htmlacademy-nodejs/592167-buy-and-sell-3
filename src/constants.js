'use strict';

const ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  GONE: 410,
  INTERNAL_SERVER_ERROR: 500,
};

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const MOCK_FILE_NAME = `mock.json`;

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


module.exports = {
  ExitCode,
  HttpCode,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  MOCK_FILE_NAME,
  MOCK_ANNOUNCEMENT,
};
