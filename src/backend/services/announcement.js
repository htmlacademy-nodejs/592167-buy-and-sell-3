'use strict';

const {MONTH_LIST, ANNOUNCEMENT_TYPE, MOCK_USER_ID} = require(`../../constants`);

const createDate = (date) => {
  const newDate = new Date(date);
  const tempMonth = MONTH_LIST[newDate.getMonth()];
  return `${newDate.getDate()} ${tempMonth} ${newDate.getFullYear()}`;
};

const announcementRepository = require(`../repositories/announcement`);
const categoriesRepository = require(`../repositories/categories`);

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
      id: tempAnnouncements[i].Announcement.dataValues.id,
      title: tempAnnouncements[i].Announcement.dataValues.title,
      sum: tempAnnouncements[i].Announcement.dataValues.sum,
      type: tempAnnouncements[i].Announcement.dataValues.Type.dataValues.type,
    };
  });
};

const getListCommentsForUserAnnouncements = async (userId) => {
  const listUserAnnouncementsId = await announcementRepository.getAnnouncementsListUser(userId);

  const listUserAnnouncements = [];
  for (const announcement of listUserAnnouncementsId) {
    const announcementInfo = {
      id: announcement.id,
      title: announcement.title,
      sum: announcement.sum,
    };
    announcementInfo.type = announcement.typeId === ANNOUNCEMENT_TYPE.BUY ? `Куплю` : `Продам`;
    const comments = await announcementRepository.getCommentsForAnnouncement(announcement.id);
    announcementInfo.comments = comments.map((el) => {
      return {
        id: el.id,
        comment: el.comment,
        user: `${el.User.userName}`,
      };
    });
    listUserAnnouncements.push(announcementInfo);
  }

  return listUserAnnouncements.filter((el) => el.comments.length > 0);
};

const getTheNewestAnnouncements = async (limitAnnouncements) => {
  const temp = await announcementRepository.getTheNewestAnnouncements(limitAnnouncements);
  return Array(temp.length).fill({}).map((el, i) => {
    return {
      id: temp[i].id,
      title: temp[i].title,
      description: temp[i].description,
      sum: temp[i].sum,
      type: temp[i].Type.type,
      image: temp[i].Images[0].image,
      categories: temp[i].Categories,
    };
  });
};

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
  const categories = await categoriesRepository.findAll();
  const firstList = announcementList.shift();
  const currentCategoriesList = firstList.Announcement.Categories.map((el) => el.category);
  const categoriesList = Array(categories.length).fill({}).map((el, i) => {
    return {
      id: categories[i].id,
      category: categories[i].category,
      selected: currentCategoriesList.includes(categories[i].category),
    };
  });
  return {
    id: firstList.Announcement.id,
    image: firstList.image,
    title: firstList.Announcement.title,
    sum: firstList.Announcement.sum,
    description: firstList.Announcement.description,
    createdAt: createDate(firstList.Announcement.createdAt),
    type: firstList.Announcement.Type.type,
    author: `${firstList.Announcement.User.userName}`,
    email: firstList.Announcement.User.email,
    categories: categoriesList,
    comments: commentList.map((el) => {
      return {
        comment: el.comment,
        author: `${el.User.userName}`
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
    return err;
  }
};

const remove = async (announcementId) => await announcementRepository.remove(announcementId);


module.exports = {
  getAll,
  getMyAnnouncements,
  getTheNewestAnnouncements,
  getMostDiscussed,
  create,
  search,
  getListCommentsForUserAnnouncements,
  getAnnouncement,
  addComment,
  edit,
  remove,
};
