'use strict';

const {db, sequelize} = require(`../db/db-connect`);


const findAll = async () => {
  const sql = `select C.category, count(A.id) as categoryCount
               from "Announcements" A
                      inner join "AnnouncementsToCategories" ATC
                                 on A.id = ATC."AnnouncementId"
                      inner join "Categories" C
                                 on c.id = ATC."CategoryId"
               group by c.category;`;
  const type = sequelize.QueryTypes.SELECT;

  return await sequelize.query(sql, {type});
};

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
