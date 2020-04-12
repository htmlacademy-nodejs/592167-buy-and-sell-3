'use strict';

const announcementRepository = require(`../repositories/announcement`);
const {AnnouncementNotFoundError} = require(`../errors/errors`);

const getAll = () => announcementRepository.findAll();

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
};

const search = (queryString) => announcementRepository.findByTitle(queryString);


module.exports = {
  getAll,
  getById,
  update,
  create,
  remove,
  search,
};
