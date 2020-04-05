'use strict';

const commentRepository = require(`src/service/repositories/comment`);
const announcementRepository = require(`src/service/repositories/announcement`);
const {AnnouncementNotFoundError, CommentNotFoundError} = require(`../errors/errors`);

const getContent = (id) => commentRepository.findByAnnouncementId(id);

const remove = (announcementId, commentId) => {
  if (commentRepository.exists(commentId)) {
    throw new CommentNotFoundError(announcementId, commentId);
  }

  commentRepository.remove(commentId);
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
