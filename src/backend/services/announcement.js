'use strict';

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
    }
  });
};

const getAnnouncementsForComments = async (userId) => {
  return await announcementRepository.getAnnouncementsForComments(userId);
};

const getAnnouncementsOfCategories = async (categoryName) => {
  return await announcementRepository.getAnnouncementsOfCategories(categoryName);
};

const getTheNewestAnnouncements = async (limitAnnouncements) => await announcementRepository.getTheNewestAnnouncements(limitAnnouncements);

const getMostDiscussed = async (limitAnnouncements) => {
  const mostDiscussed = await announcementRepository.getMostDiscussed(limitAnnouncements);
  return mostDiscussed.filter((it) => Number.parseInt(it.comments, 10) > 0);
};

const search = async (queryString) => await announcementRepository.findByTitle(queryString);

const create = async (newAnnouncement) => {
  let announcementType = 1;
  if (newAnnouncement.action === 'sell') {
    announcementType = 2;
  }
  const announcement = {
    title: newAnnouncement['ticket-name'],
    description: newAnnouncement.comment,
    sum: newAnnouncement.price,
    userId: 3,
    typeId: announcementType,
    category: newAnnouncement.category,
  }

  const image = {
    image: newAnnouncement.image,
  }


  return await announcementRepository.save(announcement, image)
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
