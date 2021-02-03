'use strict';

const fs = require(`fs`);

const {db, sequelize, Operator} = require(`../db/db-connect`);


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
    attributes: [`id`, `title`, `sum`],
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
  attributes: [`id`, `comment`],
  where: {
    'announcementId': announcementId,
  },
  include: {
    model: db.User,
    attributes: [`userName`],
  },
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

const getTheNewestAnnouncements = async (limit) => db.Announcement.findAll({
  include: [{
    model: db.Type,
    attributes: [`type`],
  }, {
    model: db.Image,
    attributes: [`image`],
    limit: 1,
  }, {
    model: db.Category,
    attributes: [`id`, `category`],
    through: {
      attributes: [],
    },
  }],
  order: [
    [`createdAt`, `desc`],
  ],
  limit,
});

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

const findByTitle = async (queryString) => await db.Image.findAll({
  attributes: [`image`],
  include: {
    model: db.Announcement,
    attributes: [`id`, `title`, `sum`, `description`, `createdAt`],
    where: {
      title: {
        [Operator.like]: `%${queryString}%`,
      },
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
        attributes: [`category`, `id`],
      }],
  },
});

const getAnnouncement = async (announcementId) => await db.Image.findAll({
  attributes: [`image`],
  include: {
    model: db.Announcement,
    attributes: [`id`, `title`, `sum`, `description`, `createdAt`],
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
        attributes: [`userName`, `email`],
      },
      {
        model: db.Category,
        attributes: [`category`],
      }],
  },
});

const addComment = async (newComment) => await db.Comment.create(newComment);

const edit = async (editAnnouncement, announcementId) => {
  try {
    return await db.Announcement.update(editAnnouncement, {
      where: {
        id: announcementId,
      }
    });
  } catch (err) {
    return err.message;
  }
};

const remove = async (announcementId) => {
  try {
    const temp = await db.Image.findOne({
      attributes: [`image`],
      include: {
        model: db.Announcement,
        attributes: [`id`],
        include: {
          model: db.Category,
          attributes: [`id`, `category`],
          through: {
            attributes: [],
          },
        },
        where: {
          id: announcementId,
        },
      },
    });

    const currentCategoriesList = temp.Announcement.Categories.map((el) => el.id);

    const announcement = await db.Announcement.findByPk(announcementId);


    currentCategoriesList.forEach(async (el) => {
      const category = await db.Category.findByPk(el);
      await announcement.removeCategories(category);
    });

    await db.Comment.destroy({
      where: {
        announcementId,
      },
    });

    await db.Image.destroy({
      where: {
        announcementId,
      },
    });

    if (temp.image) {
      try {
        fs.unlinkSync(`${__dirname}/../../static/upload/${temp.image}`);
      } catch (err) {
        console.log(err);
      }
    }

    return await db.Announcement.destroy({
      where: {
        id: announcementId,
      },
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
  remove,
};
