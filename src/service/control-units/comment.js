'use strict';

const nanoid = require(`nanoid`);

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
const addComment = (announcementList, newCommentText, id) => {
  const newAnnouncementList = deleteItemFromArray(announcementList, id);
  const mutableAnnouncement = announcementList.find((el) => el.id === id);

  const newComment = {
    id: nanoid(6),
    text: newCommentText.text,
  };
  mutableAnnouncement.comments.push(newComment);
  newAnnouncementList.push(mutableAnnouncement);

  return newAnnouncementList;
};

module.exports = {
  deleteComment,
  addComment,
};
