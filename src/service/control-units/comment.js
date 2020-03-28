'use strict';

const {deleteItemFromArray, getNewId} = require(`../../utils`);

const deleteComment = (announcementList, id, commentId) => {
  const newAnnouncementList = deleteItemFromArray(announcementList, id);
  const mutableAnnouncement = announcementList.find((el) => el.id === id);

  const comments = mutableAnnouncement.comments;
  const newComments = {
    comments: deleteItemFromArray(comments, commentId),
  };
  if (newComments.comments === -1) {
    return newComments.comments;
  }
  const modifiedAnnouncement = Object.assign({}, mutableAnnouncement, newComments);
  newAnnouncementList.push(modifiedAnnouncement);

  return newAnnouncementList;
};
const add = (announcementList, newCommentText, id) => {
  const newAnnouncementList = deleteItemFromArray(announcementList, id);
  const mutableAnnouncement = announcementList.find((el) => el.id === id);

  const newComment = {
    id: getNewId(),
    text: newCommentText.text,
  };
  mutableAnnouncement.comments.push(newComment);
  newAnnouncementList.push(mutableAnnouncement);

  return newAnnouncementList;
};

module.exports = {
  deleteComment,
  add,
};
