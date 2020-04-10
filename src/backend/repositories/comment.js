'use strict';

const {getNewId, deleteItemFromArray} = require(`../../utils`);
const announcementRepository = require(`../repositories/announcement`);

const exists = (commentId) => {
  const found = announcementRepository.findAll()
    .flatMap((announcment) => announcment.comments)
    .find((comment) => comment.id === commentId);
  return found !== undefined;
};

const findByAnnouncementId = (id) => announcementRepository.findById(id).comments;

const save = (newCommentText, announcementId) => {
  const announcement = announcementRepository.findById(announcementId);
  const newComment = {
    id: getNewId(),
    text: newCommentText.text,
  };
  announcement.comments.push(newComment);

  return newComment.id;
};

const remove = (announcementId, commentId) => {
  const announcement = announcementRepository.findById(announcementId);
  const comments = announcement.comments;
  announcement.comments = deleteItemFromArray(comments, commentId);
};

module.exports = {
  exists,
  findByAnnouncementId,
  save,
  remove,
};
