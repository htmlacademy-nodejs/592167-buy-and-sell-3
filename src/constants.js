'use strict';

const ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  GONE: 410,
  INTERNAL_SERVER_ERROR: 500,
};

const DEFAULT = {
  COMMAND: `--help`,
  PREVIEW_COUNT: 8,
  OFFSET: 0,
  ORDER: `DESC`,
};

const ANNOUNCEMENT_TYPE = {
  BUY: 1,
  SELL: 2,
};

const USER_ARGV_INDEX = 2;
const MOCK_FILE_NAME = `mock.json`;
const BACKEND_URL = `http://localhost:8081`;
const FRONTEND_URL = `http://localhost:8080`;
const MONTH_LIST = [`января`, `февраля`, `марта`, `апреля`, `мая`, `июня`, `июля`, `августа`, `сентября`, `октября`, `ноября`, `декабря`];
const MOCK_USER_ID = 3;


module.exports = {
  ExitCode,
  HttpCode,
  DEFAULT,
  USER_ARGV_INDEX,
  MOCK_FILE_NAME,
  BACKEND_URL,
  FRONTEND_URL,
  MONTH_LIST,
  ANNOUNCEMENT_TYPE,
  MOCK_USER_ID
};
