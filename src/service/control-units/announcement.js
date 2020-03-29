'use strict';

const {deleteItemFromArray, getNewId} = require(`../../utils`);


const add = (announcementList, newAnnouncment) => {
  newAnnouncment.id = getNewId();
  announcementList.push(newAnnouncment);

  return announcementList;
};

const change = (announcementList, newAnnouncement, id) => {
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

const search = (list, queryString) => {
  return list.filter((el) => el.title.toUpperCase().match(queryString.query.toUpperCase()));
};


module.exports = {
  add,
  change,
  deleteAnnouncment,
  search,
};
