'use strict';

const nanoid = require(`nanoid`);

const getNewId = () => {
  return nanoid(6);
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

const addNewAnnouncement = (announcementList, newAnnouncment) => {
  newAnnouncment.id = getNewId();
  announcementList.push(newAnnouncment);

  return announcementList;
};
const changeAnnouncment = (announcementList, newAnnouncement, id) => {
  const newAnnouncementList = deleteItemFromArray(announcementList, id);
  if (newAnnouncementList !== -1) {
    const mutableAnnouncement = announcementList.find((el) => el.id === id);
    const modifiedAnnouncement = Object.assign({}, mutableAnnouncement, newAnnouncement);
    newAnnouncementList.push(modifiedAnnouncement);
  }

  return newAnnouncementList;
};
const deleteAnnouncment = (announcementList, id) => {
  return deleteItemFromArray(announcementList, id);
};
const searchAnnouncements = (list, search) => {
  return list.filter((el) => el.title.toUpperCase().match(search.query.toUpperCase()));
};

module.exports = {
  addNewAnnouncement,
  changeAnnouncment,
  deleteAnnouncment,
  searchAnnouncements,
};
