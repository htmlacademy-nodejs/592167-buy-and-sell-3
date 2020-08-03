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


module.exports = {
  types,
  users,
  categories,
};
