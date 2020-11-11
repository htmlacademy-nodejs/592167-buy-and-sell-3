'use strict';

const createDate = (date) => {
  const newDate = new Date(date);
  const month = [`января`, `февраля`, `марта`, `апреля`, `мая`, `июня`, `июля`, `августа`, `сентября`, `октября`, `ноября`, `декабря`];
  const tempMonth = month[newDate.getMonth()];
  return `${newDate.getDate()} ${tempMonth} ${newDate.getFullYear()}`;
};

const announcementRepository = require(`../repositories/announcement`);
// const {AnnouncementNotFoundError} = require(`../errors/errors`);

const getAll = async () => {
  return await announcementRepository.findAll();
};

const getMyAnnouncements = async () => {
  const tempAnnouncements = await announcementRepository.findMyAnnouncements();
  return Array(tempAnnouncements.length).fill({}).map((el, i) => {
    return {
      image: tempAnnouncements[i].image,
      title: tempAnnouncements[i].Announcement.dataValues.title,
      sum: tempAnnouncements[i].Announcement.dataValues.sum,
      type: tempAnnouncements[i].Announcement.dataValues.Type.dataValues.type,
    };
  });
};

const getAnnouncementsForComments = async (userId) => {
  return await announcementRepository.getAnnouncementsForComments(userId);
};

const getListCommentsForUserAnnouncements = async (userId) => {
  const listUserAnnouncementsId = await announcementRepository.getAnnouncementsListUser(userId);
  const listUserAnnouncements = [];
  for (let i = 0; i < listUserAnnouncementsId.length; i++) {
    const announcementInfo = {
      title: listUserAnnouncementsId[i].title,
      sum: listUserAnnouncementsId[i].sum,
    };
    announcementInfo.type = listUserAnnouncementsId[i].typeId === 1 ? `Куплю` : `Продам`;
    announcementInfo.comments = await announcementRepository.getCommentsForAnnouncement(listUserAnnouncementsId[i].id);
    listUserAnnouncements.push(announcementInfo);
  }
  return listUserAnnouncements.filter((el) => el.comments.length > 0);
};

const getAnnouncementsOfCategories = async (categoryName) => {
  return await announcementRepository.getAnnouncementsOfCategories(categoryName);
};

const getTheNewestAnnouncements = async (limitAnnouncements) => await announcementRepository.getTheNewestAnnouncements(limitAnnouncements);

const getMostDiscussed = async (limitAnnouncements) => {
  const mostDiscussed = await announcementRepository.getMostDiscussed(limitAnnouncements);
  return mostDiscussed.filter((it) => Number.parseInt(it.comments, 10) > 0);
};

const search = async (queryString) => {
  const announcementList = await announcementRepository.findByTitle(queryString);
  return Array(announcementList.length).fill({}).map((el, i) => {
    return {
      image: announcementList[i].image,
      title: announcementList[i].Announcement.title,
      type: announcementList[i].Announcement.Type.type,
      sum: announcementList[i].Announcement.sum,
      description: announcementList[i].Announcement.description,
      categories: announcementList[i].Announcement.Categories.map((it) => it.category),
    };
  });
};

const create = async (newAnnouncement) => {
  let announcementType = 1;
  if (newAnnouncement.action === `sell`) {
    announcementType = 2;
  }
  const announcement = {
    title: newAnnouncement[`ticket-name`],
    description: newAnnouncement.comment,
    sum: newAnnouncement.price,
    userId: 3,
    typeId: announcementType,
    categories: newAnnouncement.category,
  };

  const image = {
    image: newAnnouncement.image,
  };


  return await announcementRepository.save(announcement, image);
};

const getAnnouncement = async (announcementId) => {
  const announcementList = await announcementRepository.getAnnouncement(announcementId);
  const commentList = await announcementRepository.getCommentsForAnnouncement(announcementId);
  return {
    image: announcementList[0].image,
    title: announcementList[0].Announcement.title,
    sum: announcementList[0].Announcement.sum,
    description: announcementList[0].Announcement.description,
    createdAt: createDate(announcementList[0].Announcement.createdAt),
    type: announcementList[0].Announcement.Type.type,
    author: `${announcementList[0].Announcement.User.firstName} ${announcementList[0].Announcement.User.lastName}`,
    email: announcementList[0].Announcement.User.email,
    categories: announcementList[0].Announcement.Categories.map((el) => el.category),
    comments: commentList.map((el) => {
      return {
        comment: el.comment,
        author: `${el.User.firstName} ${el.User.lastName}`
      };
    }),
  };
};

const addComment = async (newComment) => {
  const normalizedComment = {
    comment: newComment.comment,
    announcementId: newComment.offersId,
    userId: newComment.userId,
  };
  return await announcementRepository.addComment(normalizedComment);
};

const edit = async (editAnnouncement) => {
  let announcementType = 1;
  if (editAnnouncement.action === `sell`) {
    announcementType = 2;
  }
  const announcement = {
    id: editAnnouncement.id,
    title: editAnnouncement[`ticket-name`],
    description: editAnnouncement.comment,
    sum: editAnnouncement.price,
    userId: 3,
    typeId: announcementType,
    categories: editAnnouncement.category,
  };
  return await announcementRepository.edit(announcement);
};

module.exports = {
  getAll,
  getMyAnnouncements,
  getAnnouncementsForComments,
  getAnnouncementsOfCategories,
  getTheNewestAnnouncements,
  getMostDiscussed,
  create,
  search,
  getListCommentsForUserAnnouncements,
  getAnnouncement,
  addComment,
  edit,
  // getById,
  // update,
  // remove,
};

// старый код
// const getById = (id) => {
//   if (!announcementRepository.exists(id)) {
//     throw new AnnouncementNotFoundError(id);
//   }
//
//   return announcementRepository.findById(id);
// };
//
// const update = (newAnnouncment, id) => {
//   if (!announcementRepository.exists(id)) {
//     throw new AnnouncementNotFoundError(id);
//   }
//
//   return announcementRepository.save(newAnnouncment, id);
// };
//
// const remove = (id) => {
//   if (!announcementRepository.exists(id)) {
//     throw new AnnouncementNotFoundError(id);
//   }
//
//   announcementRepository.remove(id);
//   return true;
// };
