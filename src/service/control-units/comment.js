'use strict';

const commentRepository = require(`../repositories/commentRepository`);
const announcementRepository = require(`../repositories/announcementRepository`);
const {AnnouncementNotFoundError, CommentNotFoundError} = require(`../errors/errors`);

const getContent = (id) => commentRepository.findByAnnouncementId(id);

const remove = (id, commentId) => {
  if (commentRepository.exists(commentId)) {
    throw new CommentNotFoundError(id, commentId);
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
