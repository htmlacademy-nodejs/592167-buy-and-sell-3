'use strict';

const announcementRepository = require(`src/service/repositories/announcement`);

const findAll = () => {
  let categories = [];
  announcementRepository.findAll().map((el) => (categories = categories.concat(el.category)));
  const tempSet = new Set(categories);

  return [...tempSet];
};

module.exports = {
  findAll,
};
