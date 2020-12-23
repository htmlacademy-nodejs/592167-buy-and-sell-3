'use strict';

const commentRepository = require(`../repositories/comment`);
const announcementRepository = require(`../repositories/announcement`);
const {AnnouncementNotFoundError} = require(`../errors/errors`);

const getByAnnouncementId = (id) => {
  if (!announcementRepository.exists(id)) {
    throw new AnnouncementNotFoundError(id);
  }

  return commentRepository.findByAnnouncementId(id);
};

const getCommentsOnMyAnnouncements = (announcementsId) => {
  return commentRepository.getCommentsOnMyAnnouncements(announcementsId);
};

const add = (newCommentText, id) => {
  if (!announcementRepository.exists(id)) {
    throw new AnnouncementNotFoundError(id);
  }

  return commentRepository.save(newCommentText, id);
};


const remove = async (commentId) => await commentRepository.remove(commentId);


module.exports = {
  getByAnnouncementId,
  getCommentsOnMyAnnouncements,
  add,
  remove,
};
