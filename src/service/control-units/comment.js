'use strict';

const {deleteItemFromArray, getNewId} = require(`../../utils`);
let {content} = require(`./announcement`);

const getContent = (id) => {
  const offer = content.find((el) => el.id === id);
  return offer.comments;
};

const remove = (id, commentId) => {
  const newAnnouncementList = deleteItemFromArray(content, id);
  if (newAnnouncementList !== -1) {
    const mutableAnnouncement = content.find((el) => el.id === id);

    const comments = mutableAnnouncement.comments;
    const newComments = {
      comments: deleteItemFromArray(comments, commentId),
    };
    if (newComments.comments === -1) {
      return newComments.comments;
    }
    const modifiedAnnouncement = Object.assign({}, mutableAnnouncement, newComments);
    newAnnouncementList.push(modifiedAnnouncement);
    content = newAnnouncementList;
  }

  return content;
};

const add = (newCommentText, id) => {
  const newAnnouncementList = deleteItemFromArray(content, id);
  if (newAnnouncementList !== -1) {
    const mutableAnnouncement = content.find((el) => el.id === id);

    const newComment = {
      id: getNewId(),
      text: newCommentText.text,
    };
    mutableAnnouncement.comments.push(newComment);
    newAnnouncementList.push(mutableAnnouncement);
    content = newAnnouncementList;
  }

  return content;
};


module.exports = {
  remove,
  add,
  getContent,
};
