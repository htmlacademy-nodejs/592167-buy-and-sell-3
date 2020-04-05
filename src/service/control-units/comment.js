'use strict';

const commentRepository = require(`../repositories/comment`);
const announcementRepository = require(`../repositories/announcement`);
const {AnnouncementNotFoundError, CommentNotFoundError} = require(`../errors/errors`);

const getContent = (id) => commentRepository.findByAnnouncementId(id);

const remove = (announcementId, commentId) => {
  if (commentRepository.exists(commentId)) {
    throw new CommentNotFoundError(announcementId, commentId);
  }

  commentRepository.remove(announcementId, commentId);
};

const add = (newCommentText, id) => {
  if (!announcementRepository.exists(id)) {
    throw new AnnouncementNotFoundError(id);
  }

  commentRepository.save(newCommentText, id);
};


module.exports = {
  getContent,
  add,
  remove,
};
