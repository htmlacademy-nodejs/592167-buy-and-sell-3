'use strict';

const {deleteItemFromArray, getNewId} = require(`../../utils`);
let announcementService = require(`./announcement`);
const errors = require(`../errors/errors`);

const getContent = (id) => {
  const offer = announcementService.getContent().find((el) => el.id === id);
  return offer.comments;
};

const remove = (id, commentId) => {
  const localContent = announcementService.getContent();
  const newAnnouncementList = deleteItemFromArray(localContent, id);
  if (newAnnouncementList !== -1) {
    const mutableAnnouncement = localContent.find((el) => el.id === id);

    const comments = mutableAnnouncement.comments;
    const newComments = {
      comments: deleteItemFromArray(comments, commentId),
    };
    if (newComments.comments === -1) {
      announcementService.changeContent(localContent);
      throw new errors.CommentNotFoundError();
    }
    const modifiedAnnouncement = Object.assign({}, mutableAnnouncement, newComments);
    newAnnouncementList.push(modifiedAnnouncement);
    announcementService.changeContent(newAnnouncementList);
  }
};

const add = (newCommentText, id) => {
  const localContent = announcementService.getContent();
  const newComment = {};
  const newAnnouncementList = deleteItemFromArray(localContent, id);
  if (newAnnouncementList !== -1) {
    const mutableAnnouncement = localContent.find((el) => el.id === id);

    newComment.id = getNewId();
    newComment.text = newCommentText.text;

    mutableAnnouncement.comments.push(newComment);
    newAnnouncementList.push(mutableAnnouncement);
    announcementService.changeContent(newAnnouncementList);
  }

  return newComment.id;
};


module.exports = {
  remove,
  add,
  getContent,
};
