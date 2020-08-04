'use strict';

const types = [
  {type: `Куплю`},
  {type: `Продам`},
];

const users = [
  {firstName: `Иванов`, lastName: `Иван`, email: `my@mail.ru`, password: `123455`},
  {firstName: `Петров`, lastName: `Петр`, email: `petrov@gmail.com`, password: `34523`},
  {firstName: `Сидоров`, lastName: `Илья`, email: `sidorov.iliya@yahoo.com`, password: `I8e#8d`},
];

const categories = [
  {category: `Журналы`},
  {category: `Программирование`},
  {category: `Психология`},
  {category: `Искусство`},
];

const announcements = [
  {
    title: `Продам коллекцию журналов «Огонёк».`,
    description: `Не пытайтесь торговаться. Цену вещам я знаю. Равным образом курс на социально-ориентированный национальный проект способствует подготовке и реализации существующих финансовых и административных. С другой стороны начало повседневной работы по формированию позиции позволяет выполнить важнейшие задания по разработке. Таких предложений больше нет!`,
    sum: 3776,
    typeId: 1,
    userId: 1,
  },
  {
    title: `Отдам в хорошие руки подшивку «Мурзилка».`,
    description: `Не пытайтесь торговаться. Цену вещам я знаю. Равным образом курс на социально-ориентированный национальный проект способствует подготовке и реализации существующих финансовых и административных. С другой стороны начало повседневной работы по формированию позиции позволяет выполнить важнейшие задания по разработке. Таких предложений больше нет!`,
    sum: 90936,
    typeId: 1,
    userId: 2,
  },
  {
    title: `Куплю детские санки.`,
    description: `Товар в отличном состоянии. Две страницы заляпаны свежим кофе.`,
    sum: 81888,
    typeId: 2,
    userId: 3,
  },
];

const announcementsToCategories = [
  {announcementId: 1, categoryId: 2},
  {announcementId: 2, categoryId: 1},
  {announcementId: 3, categoryId: 4},
  {announcementId: 2, categoryId: 3},
];

const images = [
  {announcementId: 1, image: `item01.jpg`},
  {announcementId: 1, image: `item02.jpg`},
  {announcementId: 2, image: `item03.jpg`},
  {announcementId: 3, image: `item04.jpg`},
];

const comments = [
  {announcementId: 1, userId: 1, comment: `some comment1`},
  {announcementId: 1, userId: 2, comment: `some comment2`},
  {announcementId: 2, userId: 1, comment: `some comment3`},
  {announcementId: 3, userId: 3, comment: `some comment4`},
];

module.exports = {
  types,
  users,
  categories,
  announcements,
  announcementsToCategories,
  images,
  comments,
};
