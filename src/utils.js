'use strict';

const fs = require(`fs`).promises;
const nanoid = require(`nanoid`);
const {MOCK_ANNOUNCEMENT, MOCK_FILE_NAME} = require(`./constants`);


const getRandomInit = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const deleteItemFromArray = (array, id) => {
  const idx = array.map((el) => el.id).indexOf(id);
  if (idx === -1) {
    return idx;
  }
  const beforeIdx = array.slice(0, idx);
  const affterIdx = array.slice(idx + 1);

  return [...beforeIdx, ...affterIdx];
};

const getNewId = () => {
  return nanoid(6);
};

const createMockDatabase = async () => {
  await fs.writeFile(MOCK_FILE_NAME, MOCK_ANNOUNCEMENT);
};


module.exports = {
  getRandomInit,
  shuffle,
  deleteItemFromArray,
  getNewId,
  createMockDatabase,
};
