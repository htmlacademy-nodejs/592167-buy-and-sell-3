'use strict';

const UserException = function (message, code) {
  this.message = message;
  this.code = code;
};

const offerNotFound = () => {
  throw new UserException(`Заявление не найдено.`, 410);
};

const commentNotFound = () => {
  throw new UserException(`Комментарий не найден.`, 410);
};

module.exports = {
  offerNotFound,
  commentNotFound
};
