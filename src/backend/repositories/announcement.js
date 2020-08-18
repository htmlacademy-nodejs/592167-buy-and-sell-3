'use strict';

const fs = require(`fs`);
const {deleteItemFromArray, getNewId} = require(`../../utils`);
const {db, sequelize, Operator} = require(`../db/db-connect`);

const {MOCK_FILE_NAME} = require(`../../constants`);
let announcements = fs.existsSync(MOCK_FILE_NAME) ? JSON.parse(fs.readFileSync(MOCK_FILE_NAME)) : [];

const findById = (id) => announcements.find((el) => el.id === id);

const exists = (id) => findById(id) !== undefined;

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
    as: `types`,
  }],
  raw: true,
});

const findMyAnnouncements = async () => await db.Announcement.findAll({
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
  raw: true,
  where: {
    userId: 1
  }
});

const getAnnouncementsForComments = async (userId) => await db.Announcement.findAll({
  attributes: [`id`, `title`, `sum`],
  include: {
    model: db.Type,
    attributes: [`type`],
    as: `types`,
  },
  where: {
    userId
  },
  raw: true,
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

const save = (newAnnouncement, id) => {
  if (id) {
    const announcement = findById(id);
    const newContent = deleteItemFromArray(announcements, id);
    const newOffer = Object.assign({}, announcement, newAnnouncement);
    newContent.push(newOffer);
    announcements = newContent;
  } else {
    newAnnouncement.id = getNewId();
    announcements.push(newAnnouncement);
  }
  return newAnnouncement.id;
};

const remove = (id) => {
  announcements = deleteItemFromArray(announcements, id);
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


module.exports = {
  exists,
  findById,
  findAll,
  findMyAnnouncements,
  getAnnouncementsForComments,
  getAnnouncementsOfCategories,
  save,
  findByTitle,
  remove,
};
