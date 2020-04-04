'use strict';

const fs = require(`fs`);
const {deleteItemFromArray, getNewId} = require(`../../utils`);
const {AnnouncementNotFoundError} = require(`../errors/errors`);

const {MOCK_FILE_NAME} = require(`../../constants`);
let content = fs.existsSync(MOCK_FILE_NAME) ? JSON.parse(fs.readFileSync(MOCK_FILE_NAME)) : [];

const getContent = () => content;

const add = (newAnnouncment) => {
  newAnnouncment.id = getNewId();
  content.push(newAnnouncment);

  return newAnnouncment.id;
};

const getById = (id) => {
  return content.find((el) => el.id === id);
};

const change = (newAnnouncement, id) => {
  const newContent = deleteItemFromArray(content, id);
  if (newContent !== -1) {
    newAnnouncement.id = id;
    newContent.push(newAnnouncement);
    content = newContent;
  } else {
    throw new AnnouncementNotFoundError(id);
  }
};

const remove = (id) => {
  const newContent = deleteItemFromArray(content, id);
  if (newContent === -1) {
    throw new AnnouncementNotFoundError(id);
  }
  content = newContent;
};

const search = (queryString) => {
  return content.filter((el) => el.title.toUpperCase().includes(queryString.query.toUpperCase()));
};

const changeContent = (newContent) => {
  content = newContent;
};

module.exports = {
  add,
  change,
  remove,
  search,
  content,
  getContent,
  getById,
  changeContent,
};
