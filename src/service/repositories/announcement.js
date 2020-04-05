'use strict';

const fs = require(`fs`);
const {deleteItemFromArray, getNewId} = require(`../../utils`);

const {MOCK_FILE_NAME} = require(`../../constants`);
let content = fs.existsSync(MOCK_FILE_NAME) ? JSON.parse(fs.readFileSync(MOCK_FILE_NAME)) : [];

const exists = (id) => {
  const idx = content.map((el) => el.id).indexOf(id);
  return idx !== -1;
};

const findById = (id) => {
  if (exists(id)) {
    return content.find((el) => el.id === id);
  } else {
    return undefined;
  }
};

const findAll = () => content;

const save = (announcement, id) => {
  if (id) {
    const newContent = deleteItemFromArray(content, id);
    announcement.id = id;
    newContent.push(announcement);
    content = newContent;
  } else {
    announcement.id = getNewId();
    content.push(announcement);
  }
  return announcement.id;
};

const remove = (id) => {
  content = deleteItemFromArray(content, id);
};

const findByTitle = (queryString) => {
  return content.filter((el) => el.title.toUpperCase().includes(queryString.query.toUpperCase()));
};

const _changeContent = (newContent) => {
  content = newContent;
};

module.exports = {
  exists,
  findById,
  findAll,
  save,
  findByTitle,
  remove,
  _changeContent,
};