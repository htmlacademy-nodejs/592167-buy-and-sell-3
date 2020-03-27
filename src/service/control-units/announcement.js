'use strict';

const nanoid = require(`nanoid`);
const {deleteItemFromArray} = require(`../../utils`);

const getNewId = () => {
  return nanoid(6);
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
