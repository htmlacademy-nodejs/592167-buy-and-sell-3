'use strict';

const announcementRepository = require(`../repositories/announcementRepository`);
const {AnnouncementNotFoundError} = require(`../errors/errors`);

const getContent = () => announcementRepository.findAll();

const getById = (id) => {
  if (announcementRepository.exists(id)) {
    return announcementRepository.findById(id);
  } else {
    throw new AnnouncementNotFoundError(id);
  }
};

const add = (newAnnouncment, id) => {
  if (id && !announcementRepository.exists(id)) {
    throw new AnnouncementNotFoundError(id);
  }

  announcementRepository.save(newAnnouncment, id);
};


const remove = (id) => {
  if (!announcementRepository.exists(id)) {
    throw new AnnouncementNotFoundError(id);
  }

  announcementRepository.remove(id);
};

const search = (queryString) => announcementRepository.findByTitle(queryString);


module.exports = {
  getContent,
  getById,
  add,
  remove,
  search,
};
