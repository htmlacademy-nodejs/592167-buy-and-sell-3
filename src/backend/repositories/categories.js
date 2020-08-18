'use strict';

const {db, sequelize, Operator} = require(`../db/db-connect`);

const announcementRepository = require(`../repositories/announcement`);

const findAll = async () => await db.Announcement.findAll({
  attributes: [],
  include: {
    model: db.Category,
    attributes: [`category`],
  },
});

// {
//   const categories = announcementRepository.findAll()
//     .flatMap((announcement) => announcement.categories);
//   const tempSet = new Set(categories);
//
//   return [...tempSet];
// };

const getAnnouncementsOfCategories = async (categoryName) => await db.Announcement.findAll({
  attributes: [`id`, `title`],
  include: {
    model: db.Category,
    attributes: [`category`],
    where: {
      category: categoryName
    }
  }
});

module.exports = {
  findAll,
  getAnnouncementsOfCategories,
};
