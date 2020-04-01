'use strict';

class AnnouncementNotFoundError extends Error {}

class CommentNotFoundError extends Error {}

module.exports = {
  AnnouncementNotFoundError,
  CommentNotFoundError,
};
