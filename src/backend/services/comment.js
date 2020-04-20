'use strict';

const commentRepository = require(`../repositories/comment`);
const announcementRepository = require(`../repositories/announcement`);
const {AnnouncementNotFoundError, CommentNotFoundError} = require(`../errors/errors`);

const getByAnnouncementId = (id) => {
  if (!announcementRepository.exists(id)) {
    throw new AnnouncementNotFoundError(id);
  }

  return commentRepository.findByAnnouncementId(id);
};

const add = (newCommentText, id) => {
  if (!announcementRepository.exists(id)) {
    throw new AnnouncementNotFoundError(id);
  }

  return commentRepository.save(newCommentText, id);
};

const remove = (announcementId, commentId) => {
  if (!commentRepository.exists(commentId)) {
    throw new CommentNotFoundError(announcementId, commentId);
  }

  commentRepository.remove(announcementId, commentId);
  return `comment with id ${commentId} successfully deleted`;
};


module.exports = {
  getByAnnouncementId,
  add,
  remove,
};
