'use strict';

const {getNewId} = require(`../../utils`);
const announcementRepository = require(`../repositories/announcement`);

const {db} = require(`../db/db-connect`);

const exists = (commentId) => {
  const found = announcementRepository.findAll()
    .flatMap((announcment) => announcment.comments)
    .find((comment) => comment.id === commentId);
  return found !== undefined;
};

const findByAnnouncementId = (id) => announcementRepository.findById(id).comments;

const getCommentsOnMyAnnouncements = async (announcementsId) => {
  return await db.Comment.findAll({
    attributes: [`id`, `announcementId`, `comment`, `userId`],
    include: {
      model: db.User,
      attributes: [`firstName`, `lastName`],
      as: `users`,
    },
    where: {
      announcementId: announcementsId,
    },
    order: [
      [`announcementId`],
      [`createdAt`, `DESC`],
    ],
    raw: true,
  });
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


const remove = (commentId) => db.Comment.destroy({
  where: {
    id: commentId,
  },
});

module.exports = {
  exists,
  findByAnnouncementId,
  getCommentsOnMyAnnouncements,
  save,
  remove,
};
