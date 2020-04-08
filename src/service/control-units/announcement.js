'use strict';

const announcementRepository = require(`../repositories/announcement`);
const {AnnouncementNotFoundError} = require(`../errors/errors`);

const getContent = () => announcementRepository.findAll();

const getById = (id) => {
  if (announcementRepository.exists(id)) {
    return announcementRepository.findById(id);
  } else {
    throw new AnnouncementNotFoundError(id);
  }
};

const update = (newAnnouncment, id) => {
  if (!announcementRepository.exists(id)) {
    throw new AnnouncementNotFoundError(id);
  }

  announcementRepository.save(newAnnouncment, id);
};

const create = (newAnnouncement) => {
  announcementRepository.save(newAnnouncement, undefined);
};

const remove = (id) => {
  if (!announcementRepository.exists(id)) {
    throw new AnnouncementNotFoundError(id);
  }

  announcementRepository.remove(id);
};

const search = (queryString) => announcementRepository.findByTitle(queryString.query);


module.exports = {
  getContent,
  getById,
  update,
  create,
  remove,
  search,
};
