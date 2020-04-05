'use strict';

const {getNewId, deleteItemFromArray} = require(`../../utils`);
const announcementRepository = require(`../repositories/announcement`);

const exists = (commentId) => {
  let localContent = announcementRepository.findAll();
  const arrayOfMatches = localContent.map((el) => el.comments.map((it) => it.id).indexOf(commentId));
  return (arrayOfMatches.filter((it) => it === -1).length === arrayOfMatches.length);
};

const findByAnnouncementId = (id) => {
  const offer = announcementRepository.findAll().find((el) => el.id === id);
  return offer.comments;
};

const save = (newCommentText, id) => {
  const localContent = announcementRepository.findAll();
  const newComment = {};
  const newAnnouncementList = deleteItemFromArray(localContent, id);
  if (newAnnouncementList !== -1) {
    const mutableAnnouncement = localContent.find((el) => el.id === id);

    newComment.id = getNewId();
    newComment.text = newCommentText.text;

    mutableAnnouncement.comments.push(newComment);
    newAnnouncementList.push(mutableAnnouncement);
    announcementRepository._changeContent(newAnnouncementList);
  }

  return newComment.id;
};

const remove = (announcementId, commentId) => {
  let localContent = announcementRepository.findAll();
  const announcement = localContent.find((el) => el.id === announcementId);
  const comments = announcement.comments;
  announcement.comments = deleteItemFromArray(comments, commentId);
};

module.exports = {
  exists,
  findByAnnouncementId,
  save,
  remove,
};
