'use strict';

const {getNewId, deleteItemFromArray} = require(`../../utils`);
const announcementRepository = require(`../repositories/announcement`);

const exists = (commentId) => {
  let localContent = announcementRepository.findAll();
  const comments = localContent.map((el) => el.comments.map((it) => it.id).indexOf(commentId));
  return (comments.filter((it) => it === -1).length === comments.length);
};

const findByAnnouncementId = (id) => {
  const offer = announcementRepository.findAll().find((el) => el.id === id);
  return offer.comments;
};

const save = (newCommentText, announcementId) => {
  let localContent = announcementRepository.findAll();
  const announcement = localContent.find((el) => el.id === announcementId);
  const newComment = {
    id: getNewId(),
    text: newCommentText.text,
  };
  announcement.comments.push(newComment);

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
