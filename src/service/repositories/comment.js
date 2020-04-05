'use strict';

const {getNewId, deleteItemFromArray} = require(`../../utils`);
const announcementRepository = require(`src/service/repositories/announcement`);

const exists = (commentId) => {
  let localContent = announcementRepository.findAll();
  const arrayOfMatches = localContent.map((el) => el.comments.map((it) => it.id).indexOf(commentId));
  return (arrayOfMatches.filter((it) => it === -1).length === arrayOfMatches.length);
};

const findByAnnouncementId = (id) => {
  const offer = announcementRepository.findAll().find((el) => el.id === id);
  return offer.comments;
};

const save = (newCommentText, id) => {
  const localContent = announcementRepository.findAll();
  const newComment = {};
  const newAnnouncementList = deleteItemFromArray(localContent, id);
  if (newAnnouncementList !== -1) {
    const mutableAnnouncement = localContent.find((el) => el.id === id);

    newComment.id = getNewId();
    newComment.text = newCommentText.text;

    mutableAnnouncement.comments.push(newComment);
    newAnnouncementList.push(mutableAnnouncement);
    announcementRepository._changeContent(newAnnouncementList);
  }

  return newComment.id;
};

const _deleteComment = (array, id) => {
  const idx = array.map((el) => el.id).indexOf(id);
  if (idx !== -1) {
    const beforeIdx = array.slice(0, idx);
    const affterIdx = array.slice(idx + 1);

    return [...beforeIdx, ...affterIdx];
  } else {
    return array;
  }
};

const remove = (commentId) => {
  let localContent = announcementRepository.findAll();
  const arrayOfMatches = localContent.map((el) => el.comments.map((it) => it.id).indexOf(commentId));
  for (const i of arrayOfMatches) {
    if (i !== -1) {
      const idx = arrayOfMatches.indexOf(i);
      const newOffer = localContent[idx];
      localContent = _deleteComment(localContent, newOffer.id);
      newOffer.comments = _deleteComment(newOffer.comments, commentId);
      localContent.push(newOffer);
      announcementRepository._changeContent(localContent);
      break;
    }
  }
};

module.exports = {
  exists,
  findByAnnouncementId,
  save,
  remove,
};
