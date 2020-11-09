'use strict';

// const fs = require(`fs`);
// const {deleteItemFromArray, getNewId} = require(`../../utils`);
const {db, sequelize, Operator} = require(`../db/db-connect`);

// const {MOCK_FILE_NAME} = require(`../../constants`);
// let announcements = fs.existsSync(MOCK_FILE_NAME) ? JSON.parse(fs.readFileSync(MOCK_FILE_NAME)) : [];

const findAll = async () => await db.Announcement.findAll({
  attributes: {
    include: [
      [
        sequelize.literal(`(
                    SELECT image.image
        FROM "Images" AS image
        WHERE
                image."announcementId" = "Announcement".id
        limit 1
                )`),
        `images.image`
      ]
    ]
  },
  include: [{
    model: db.Type,
  }],
  raw: true,
});

const findMyAnnouncements = async () => await db.Image.findAll({
  attributes: [`image`],
  include: {
    model: db.Announcement,
    attributes: [`title`, `sum`],
    where: {
      userId: 3,
    },
    include: {
      model: db.Type,
      attributes: [`type`],
    },
  },
});

const getAnnouncementsListUser = async (userId) => await db.Announcement.findAll({
  attributes: [`id`, `title`, `sum`, `typeId`],
  where: {
    'userId': userId,
  }
});

const getCommentsForAnnouncement = async (announcementId) => await db.Comment.findAll({
  attributes: [`comment`],
  where: {
    'announcementId': announcementId,
  },
  include: {
    model: db.User,
    attributes: [`firstName`, `lastName`],
  },
  // raw: true,
});

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

const getTheNewestAnnouncements = async (limitAnnouncements) => {
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
               group by a.id, t.type, a."createdAt"
               order by a."createdAt" desc
               limit :limitAnnouncements;`;
  const type = sequelize.QueryTypes.SELECT;
  const replacements = {limitAnnouncements};
  return await sequelize.query(sql, {type, replacements});
};

const getMostDiscussed = async (limitAnnouncements) => {
  const sql = `select a.id,
                      a.title,
                      a.description,
                      a.sum,
                      (select count(c.id) from "Comments" c where c."announcementId" = a.id) as comments,
                      (select image from "Images" i where i."announcementId" = a.id limit 1),
                      t.type,
                      string_agg(cat.category, ', ')                                         as categories
               from "Announcements" a
                      inner join "Types" T
                                 on T.id = a."typeId"
                      inner join "AnnouncementsToCategories" ATC
                                 on a.id = ATC."AnnouncementId"
                      inner join "Categories" cat
                                 on ATC."CategoryId" = cat.id
               group by a.id, t.type
               order by comments desc
               limit :limitAnnouncements;`;
  const type = sequelize.QueryTypes.SELECT;
  const replacements = {limitAnnouncements};
  return await sequelize.query(sql, {type, replacements});
};

const save = async (announcement, image) => {
  try {
    const temp = await db.Announcement.create(announcement);

    image.announcementId = temp.id;
    await db.Image.create(image);

    for (const categoryId of announcement.categories) {
      const categories = await db.Category.findByPk(Number.parseInt(categoryId, 10));
      await temp.addCategories(categories);
    }

    return temp;
  } catch (err) {
    return err.message;
  }
};

const findByTitle = async (queryString) => {
  return await db.Announcement.findAll({
    attributes: {
      include: [
        [
          sequelize.literal(`(
                    SELECT image.image
        FROM "Images" AS image
        WHERE
                image."announcementId" = "Announcement".id
        limit 1
                )`),
          `images.image`
        ]
      ]
    },
    include: [{
      model: db.Type,
      attributes: [`type`],
      as: `types`,
    }],
    where: {
      title: {
        [Operator.substring]: queryString,
      },
    },
    raw: true,
  });
};

const getAnnouncement = async (announcementId) => await db.Image.findAll({
  attributes: [`image`],
  include: {
    model: db.Announcement,
    attributes: [`title`, `sum`, `description`, `createdAt`],
    where: {
      'id': announcementId,
    },
    include: [
      {
        model: db.Type,
        attributes: [`type`],
      },
      {
        model: db.User,
        attributes: [`firstName`, `lastName`, `email`],
      },
      {
        model: db.Category,
        attributes: [`category`],
      }],
  },
});

const addComment = async (newComment) => await db.Comment.create(newComment);

const edit = async (editAnnouncement) => {
  try {
    return await db.Announcement.update(editAnnouncement, {
      where: {
        id: editAnnouncement.id,
      }
    });
  } catch (err) {
    return err.message;
  }
};

module.exports = {
  findAll,
  findMyAnnouncements,
  getCommentsForAnnouncement,
  getAnnouncementsOfCategories,
  getTheNewestAnnouncements,
  getAnnouncementsListUser,
  getMostDiscussed,
  save,
  findByTitle,
  getAnnouncement,
  addComment,
  edit,
  // exists,
  // findById,
  // remove,
};


// старый код
// const findById = (id) => announcements.find((el) => el.id === id);

// const exists = (id) => findById(id) !== undefined;

// const save = (newAnnouncement, id) => {
//   if (id) {
//     const announcement = findById(id);
//     const newContent = deleteItemFromArray(announcements, id);
//     const newOffer = Object.assign({}, announcement, newAnnouncement);
//     newContent.push(newOffer);
//     announcements = newContent;
//   } else {
//     newAnnouncement.id = getNewId();
//     announcements.push(newAnnouncement);
//   }
//   return newAnnouncement.id;
// };

// const remove = (id) => {
//   announcements = deleteItemFromArray(announcements, id);
// };
