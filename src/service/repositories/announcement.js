'use strict';

const fs = require(`fs`);
const {deleteItemFromArray, getNewId} = require(`../../utils`);

const {MOCK_FILE_NAME} = require(`../../constants`);
let content = fs.existsSync(MOCK_FILE_NAME) ? JSON.parse(fs.readFileSync(MOCK_FILE_NAME)) : [];

const findById = (id) => content.find((el) => el.id === id);

const exists = (id) => findById(id) !== undefined;

const findAll = () => content;

const save = (announcement, id) => {
  if (id) {
    const offer = content.find((el) => el.id === id);
    const newContent = deleteItemFromArray(content, id);
    const newOffer = Object.assign({}, offer, announcement);
    newContent.push(newOffer);
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
  return content.filter((el) => el.title.toUpperCase().includes(queryString.toUpperCase()));
};


module.exports = {
  exists,
  findById,
  findAll,
  save,
  findByTitle,
  remove,
};
