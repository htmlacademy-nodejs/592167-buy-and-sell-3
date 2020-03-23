'use strict';

const nanoid = require(`nanoid`);

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

const getNewId = () => {
  return nanoid(6);
};

const addNewAnnouncement = (announcementList, newAnnouncment) => {
  // const announcmentId = getNewId();
  newAnnouncment.id = getNewId();
  announcementList.push(newAnnouncment);

  return announcementList;
};

module.exports = {
  getRandomInit,
  shuffle,
  addNewAnnouncement,
  getNewId,
};
