'use strict';

const announcementRepository = require(`../repositories/announcement`);
const {AnnouncementNotFoundError} = require(`../errors/errors`);

const getAll = async () => {
  return await announcementRepository.findAll();
};

const getMyAnnouncements = async () => {
  return await announcementRepository.findMyAnnouncements();
};

const getAnnouncementsForComments = async (userId) => {
  return await announcementRepository.getAnnouncementsForComments(userId);
}

const getById = (id) => {
  if (!announcementRepository.exists(id)) {
    throw new AnnouncementNotFoundError(id);
  }

  return announcementRepository.findById(id);
};

const update = (newAnnouncment, id) => {
  if (!announcementRepository.exists(id)) {
    throw new AnnouncementNotFoundError(id);
  }

  return announcementRepository.save(newAnnouncment, id);
};

const create = (newAnnouncement) => {
  return announcementRepository.save(newAnnouncement);
};

const remove = (id) => {
  if (!announcementRepository.exists(id)) {
    throw new AnnouncementNotFoundError(id);
  }

  announcementRepository.remove(id);
  return true;
};

const search = async (queryString) => await announcementRepository.findByTitle(queryString);


module.exports = {
  getAll,
  getMyAnnouncements,
  getAnnouncementsForComments,
  getById,
  update,
  create,
  remove,
  search,
};
