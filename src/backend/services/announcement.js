'use strict';

const {MONTH_LIST} = require(`../../constants`);

const createDate = (date) => {
  const newDate = new Date(date);
  const tempMonth = MONTH_LIST[newDate.getMonth()];
  return `${newDate.getDate()} ${tempMonth} ${newDate.getFullYear()}`;
};

const announcementRepository = require(`../repositories/announcement`);
const checkAnnouncement = require(`../validation-schemas/announcement-schema`);
const checkComment = require(`../validation-schemas/comment-schema`);

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
      id: announcementList[i].Announcement.id,
      image: announcementList[i].image,
      title: announcementList[i].Announcement.title,
      type: announcementList[i].Announcement.Type.type,
      sum: announcementList[i].Announcement.sum,
      description: announcementList[i].Announcement.description,
      categories: announcementList[i].Announcement.Categories.map((it) => {
        return {
          id: it.id,
          category: it.category
        };
      }),
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

  try {
    const checkedAnnouncement = await checkAnnouncement.validateAsync(announcement);
    const image = {
      image: newAnnouncement.image,
    };

    return await announcementRepository.save(checkedAnnouncement, image);
  } catch (err) {
    return `что-то пошло не так`;
  }
};

const getAnnouncement = async (announcementId) => {
  const announcementList = await announcementRepository.getAnnouncement(announcementId);
  const commentList = await announcementRepository.getCommentsForAnnouncement(announcementId);
  return {
    id: announcementList[0].Announcement.id,
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

  try {
    const checkedComment = await checkComment.validateAsync(normalizedComment);
    return await announcementRepository.addComment(checkedComment);
  } catch (err) {
    return `что-то пошло не так`;
  }
};

const edit = async (editAnnouncement, announcementId) => {
  let announcementType = 1;
  if (editAnnouncement.action === `sell`) {
    announcementType = 2;
  }
  const announcement = {
    title: editAnnouncement[`ticket-name`],
    description: editAnnouncement.comment,
    sum: editAnnouncement.price,
    userId: 3,
    typeId: announcementType,
    categories: editAnnouncement.category,
  };

  try {
    const checkedAnnouncement = await checkAnnouncement.validateAsync(announcement);
    return await announcementRepository.edit(checkedAnnouncement, announcementId);
  } catch (err) {
    return `Что-то пошло не так`;
  }
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
};
