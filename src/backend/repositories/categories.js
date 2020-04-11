'use strict';

const announcementRepository = require(`../repositories/announcement`);

const findAll = () => {
  const categories = announcementRepository.findAll()
    .flatMap((announcement) => announcement.categories);
  const tempSet = new Set(categories);

  return [...tempSet];
};

module.exports = {
  findAll,
};
