'use strict';

const {db, Operator} = require(`../db/db-connect`);
const {sequelize} = require(`../db/db-connect`);
const {DEFAULT} = require(`../../constants`);

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
               offset :selectionOffset limit :selectionCount;`;
  const type = sequelize.QueryTypes.SELECT;
  const id = Number.parseInt(categoryId, 10);
  let selectionOffset = Number.parseInt(selectionParams.start, 10) || DEFAULT.OFFSET;
  selectionOffset = selectionOffset === DEFAULT.OFFSET ? selectionOffset : (selectionOffset - 1) * DEFAULT.PREVIEW_COUNT;

  const selectionCount = Number.parseInt(selectionParams.count, 10) || DEFAULT.PREVIEW_COUNT;
  const order = `a."createdAt" ${selectionParams.order ? selectionParams.order : DEFAULT.ORDER}`;
  const replacements = {id, selectionOffset, selectionCount, order};

  return await sequelize.query(sql, {type, replacements});
};

const getCategoriesByListId = async (listId) => db.Category.findAll({
  attributes: [`id`, `category`],
  where: {
    announcementId: {
      [Operator.in]: listId,
    },
  },
});

module.exports = {
  findAll,
  getAnnouncementsOfCategories,
  getCategoriesByListId,
};
