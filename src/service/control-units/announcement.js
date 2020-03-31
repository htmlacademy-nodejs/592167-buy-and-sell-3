'use strict';

const fs = require(`fs`);
const {deleteItemFromArray, getNewId} = require(`../../utils`);
const errors = require(`../errors/errors`);

const {MOCK_FILE_NAME} = require(`../../constants`);
let content = fs.existsSync(MOCK_FILE_NAME) ? JSON.parse(fs.readFileSync(MOCK_FILE_NAME)) : [];

const getContent = () => content;

const add = (newAnnouncment) => {
  newAnnouncment.id = getNewId();
  content.push(newAnnouncment);

  return newAnnouncment.id;
};

const getById = (id) => {
  return content.filter((el) => el.id === id);
};

const change = (newAnnouncement, id) => {
  const newContent = deleteItemFromArray(content, id);
  if (newContent !== -1) {
    const mutableAnnouncement = content.find((el) => el.id === id);
    const modifiedAnnouncement = Object.assign({}, mutableAnnouncement, newAnnouncement);
    newContent.push(modifiedAnnouncement);
    content = newContent;
  }

  return content;
};

const remove = (id) => {
  const answer = {};
  const newContent = deleteItemFromArray(content, id);
  if (newContent !== -1) {
    content = newContent;
  } else {
    errors.offerNotFound();
  }
  return answer;
};

const search = (queryString) => {
  return content.filter((el) => el.title.toUpperCase().match(queryString.query.toUpperCase()));
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
