'use strict';

const {getNewId, deleteItemFromArray} = require(`../../utils`);
const announcementRepository = require(`../repositories/announcement`);

const {db} = require(`../db/db-connect`);

const exists = (commentId) => {
  const found = announcementRepository.findAll()
    .flatMap((announcment) => announcment.comments)
    .find((comment) => comment.id === commentId);
  return found !== undefined;
};

const findByAnnouncementId = (id) => announcementRepository.findById(id).comments;

const getCommentsOnMyAnnouncements = async (userId) => {
  const result = await db.Announcement.findAll({
    attributes: [`title`, `description`],
    include: [{
      model: db.Type,
      attributes: [`type`],
      as: `types`,
    }, {
      model: db.User,
      attributes: [`firstName`, `lastName`],
      as: `users`,
    }, {
      model: db.Comment,
      attributes: [`comment`],
      as: `comments`,
    }],
    where: {
      userId,
    },
    // raw: true,
  });

  return result;
};

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
  getCommentsOnMyAnnouncements,
  save,
  remove,
};
