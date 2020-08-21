'use strict';

const {db, sequelize} = require(`../db/db-connect`);


const findAll = async () => {
  const sql = `select C.id, C.category, count(A.id) as categoryCount
               from "Announcements" A
                      inner join "AnnouncementsToCategories" ATC
                                 on A.id = ATC."AnnouncementId"
                      inner join "Categories" C
                                 on c.id = ATC."CategoryId"
               group by c.id, c.category;`;
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

const getAnnouncementsOfCategories = async (categoryId, selectionParams) => {
  const sql = `select a.id,
                      a.title,
                      a.description,
                      a.sum,
                      (select image from "Images" i where i."announcementId" = a.id limit 1),
                      t.type,
                      string_agg(cat.category, ', ') as categories
               from "Announcements" a
                      inner join "Types" T
                                 on T.id = a."typeId"
                      inner join "AnnouncementsToCategories" ATC
                                 on a.id = ATC."AnnouncementId"
                      inner join "Categories" cat
                                 on ATC."CategoryId" = cat.id
               where cat.id = :id
               group by a.id, t.type, a."createdAt"
               order by a."createdAt" desc
offset :selectionStartIdx
limit :selectionCount;`;
  const type = sequelize.QueryTypes.SELECT;
  const id = Number.parseInt(categoryId, 10);
  const selectionStartIdx = Number.parseInt(selectionParams.start, 10);
  const selectionCount = Number.parseInt(selectionParams.count, 10);
  const replacements = {id, selectionStartIdx, selectionCount};

  return await sequelize.query(sql, {type, replacements});
};

module.exports = {
  findAll,
  getAnnouncementsOfCategories,
};
