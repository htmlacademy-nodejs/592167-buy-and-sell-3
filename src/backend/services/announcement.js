'use strict';

const {MONTH_LIST, ANNOUNCEMENT_TYPE, MOCK_USER_ID} = require(`../../constants`);

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
    announcementInfo.type = listUserAnnouncementsId[i].typeId === ANNOUNCEMENT_TYPE.BUY ? `Куплю` : `Продам`;
    announcementInfo.comments = await announcementRepository.getCommentsForAnnouncement(listUserAnnouncementsId[i].id);
    listUserAnnouncements.push(announcementInfo);
  }
  // listUserAnnouncementsId.forEach(async (el) => {
  //   const announcementInfo = {
  //     title: el.title,
  //     sum: el.sum,
  //   };
  //   announcementInfo.type = el.typeId === ANNOUNCEMENT_TYPE.BUY ? `Куплю` : `Продам`;
  //   announcementInfo.comments = await announcementRepository.getCommentsForAnnouncement(el);
  //   listUserAnnouncements.push(announcementInfo);
  // });

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
  let announcementType = ANNOUNCEMENT_TYPE.BUY;
  if (newAnnouncement.action === `sell`) {
    announcementType = ANNOUNCEMENT_TYPE.SELL;
  }
  const announcement = {
    title: newAnnouncement[`ticket-name`],
    description: newAnnouncement.comment,
    sum: newAnnouncement.price,
    userId: MOCK_USER_ID,
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
    return err;
  }
};

const getAnnouncement = async (announcementId) => {
  const announcementList = await announcementRepository.getAnnouncement(announcementId);
  const commentList = await announcementRepository.getCommentsForAnnouncement(announcementId);
  const firstList = announcementList.shift();
  return {
    id: firstList.Announcement.id,
    image: firstList.image,
    title: firstList.Announcement.title,
    sum: firstList.Announcement.sum,
    description: firstList.Announcement.description,
    createdAt: createDate(firstList.Announcement.createdAt),
    type: firstList.Announcement.Type.type,
    author: `${firstList.Announcement.User.firstName} ${firstList.Announcement.User.lastName}`,
    email: firstList.Announcement.User.email,
    categories: firstList.Announcement.Categories.map((el) => el.category),
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
    return err;
  }
};

const edit = async (editAnnouncement, announcementId) => {
  let announcementType = ANNOUNCEMENT_TYPE.BUY;
  if (editAnnouncement.action === `sell`) {
    announcementType = ANNOUNCEMENT_TYPE.SELL;
  }
  const announcement = {
    title: editAnnouncement[`ticket-name`],
    description: editAnnouncement.comment,
    sum: editAnnouncement.price,
    userId: MOCK_USER_ID,
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
