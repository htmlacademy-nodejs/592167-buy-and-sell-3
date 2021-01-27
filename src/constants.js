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
const MOCK_ANNOUNCEMENT_ID = 5;

const REGISTER_MESSAGE = {
  USER_NAME_REQUIRED_FIELD: `Поле "Имя и фамилия" обязательно для заполнения`,
  EMAIL_REQUIRED_FIELD: `Поле "Эл. почта" обязательно для заполнения`,
  PASSWORD_REQUIRED_FIELD: `Поле "Пароль" обязательно для заполнения`,
  REPEAT_REQUIRED_FIELD: `Поле "Пароль ещё раз" обязательно для заполнения`,
  MAX_USER_NAME_LENGTH: `Фамилия и имя недолжны превышать 100 символов`,
  MIN_PASSWORD_LENGTH: `Минимальная длина пароля 6 символов`,
  MAX_PASSWORD_LENGTH: `Максимальная длина пароля 50 символов`,
  EMAIL_WRONG: `Неправильный email`,
  USER_NAME_WRONG: `Поле "Имя и фамилия" не должно содержать цифр и специальных символов`,
  PASSWORDS_NOT_EQUALS: `Пароль и подтверждение пароля не совпадают`,
  USER_ALREADY_REGISTER: `Пользователь с таким Email уже зарегистрирован`,
};

const LOGIN_MESSAGES = {
  USER_NOT_REGISTER: `Пользователь с таким Email не зарегистрирован`,
  USER_PASSWORD_IS_BAD: `Вы ввели неверный пароль`
};

const TEMPLATE = {
  REGISTER: `sign-up`,
  LOGIN: `login`,
};


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
  MOCK_USER_ID,
  REGISTER_MESSAGE,
  TEMPLATE,
  LOGIN_MESSAGES,
  MOCK_ANNOUNCEMENT_ID,
};
