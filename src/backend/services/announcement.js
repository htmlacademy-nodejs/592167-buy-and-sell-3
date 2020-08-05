'use strict';

const announcementRepository = require(`../repositories/announcement`);
const {AnnouncementNotFoundError} = require(`../errors/errors`);

const getAll = async () => {
  return await announcementRepository.findAll();
};

const getMyAnnouncements = async () => {
  const myAnnouncements = await announcementRepository.findMyAnnouncements();
  console.table(myAnnouncements);
  return myAnnouncements;
};

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

const search = (queryString) => announcementRepository.findByTitle(queryString);


module.exports = {
  getAll,
  getMyAnnouncements,
  getById,
  update,
  create,
  remove,
  search,
};
