'use strict';

const {getNewId, deleteItemFromArray} = require(`../../utils`);
const announcementRepository = require(`../repositories/announcement`);

const exists = (commentId) => {
  const found = announcementRepository.findAll()
    .flatMap((announcment) => announcment.comments)
    .find((comment) => comment.id === commentId);
  return found !== undefined;
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
