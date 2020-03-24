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
const deleteComment = (announcementList, id, commentId) => {
  const newAnnouncementList = deleteItemFromArray(announcementList, id);
  const mutableAnnouncement = announcementList.find((el) => el.id === id);

  const comments = mutableAnnouncement.comments;
  const newComments = {
    comments: deleteItemFromArray(comments, commentId),
  };
  if (newComments.comments === -1) {
    return newComments.comments;
  }
  const modifiedAnnouncement = Object.assign({}, mutableAnnouncement, newComments);
  newAnnouncementList.push(modifiedAnnouncement);

  return newAnnouncementList;
};
const addComment = (announcementList, newCommentText, id) => {
  const newAnnouncementList = deleteItemFromArray(announcementList, id);
  const mutableAnnouncement = announcementList.find((el) => el.id === id);

  const newComment = {
    id: nanoid(6),
    text: newCommentText.text,
  };
  mutableAnnouncement.comments.push(newComment);
  newAnnouncementList.push(mutableAnnouncement);

  return newAnnouncementList;
};

const searchAnnouncements = (list, search) => {
  return list.filter((el) => el.title.toUpperCase().match(search.query.toUpperCase()));
};

module.exports = {
  getRandomInit,
  shuffle,
  addNewAnnouncement,
  getNewId,
  changeAnnouncment,
  deleteAnnouncment,
  deleteComment,
  addComment,
  searchAnnouncements,
};
