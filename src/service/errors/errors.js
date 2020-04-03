'use strict';

class AnnouncementNotFoundError extends Error {
  constructor(offerId) {
    super();
    this.message = `Offer with id ${offerId}`;
  }
}

class CommentNotFoundError extends Error {
  constructor(offerId, commentId) {
    super();
    this.message = `Comment with id ${commentId} isn't found for offer with id ${offerId}`;
  }
}

module.exports = {
  AnnouncementNotFoundError,
  CommentNotFoundError,
};
