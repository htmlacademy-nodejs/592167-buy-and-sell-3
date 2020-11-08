'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`http-status-codes`);
const chalk = require(`chalk`);
const {getLogger} = require(`../logger`);
const logger = getLogger();

const multer = require(`multer`);
const md5 = require(`md5`);

const UPLOAD_DIR = `${__dirname}/../tmp`;

const MimeTypeExtension = {
  'image/png': `png`,
  'image/jpeg': `jpg`,
  'image/jpg': `jpg`,
};

// Подготовка хранилища для сохранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const fileExtention = MimeTypeExtension[file.mimetype];
    cb(null, `${md5(Date.now())}.${fileExtention}`);
  },
});

// Функция определяющая допустимые файлы для загрузки
const fileFilter = (req, file, cb) => {
  const allowTypes = Object.keys(MimeTypeExtension);
  const isValid = allowTypes.includes(file.mimetype);
  cb(null, isValid);
};

const upload = multer({
  storage, fileFilter, limits: {
    fileSize: 5 * 1024 * 1024,
  }
});

const router = new Router();

const annoucementService = require(`../services/announcement`);
const {DEFAULT} = require(`../../constants`);


router.get(`/`, async (req, res) => {
  try {
    res.send(await annoucementService.getAll());
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      code: StatusCode.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

router.get(`/my`, async (req, res) => {
  try {
    res.send(await annoucementService.getMyAnnouncements());
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      code: StatusCode.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

router.get(`/my/comments`, async (req, res) => {
  try {
    res.send(await annoucementService.getListCommentsForUserAnnouncements(3));
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      code: StatusCode.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

router.get(`/newestAnnouncements`, async (req, res) => {
  try {
    res.send(await annoucementService.getTheNewestAnnouncements(DEFAULT.PREVIEW_COUNT));
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      code: StatusCode.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

router.get(`/mostDiscussed`, async (req, res) => {
  try {
    res.send(await annoucementService.getMostDiscussed(DEFAULT.PREVIEW_COUNT));
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      code: StatusCode.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

router.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const data = req.body;
  data.image = req.file.filename;
  try {
    await annoucementService.create(data);
    res.redirect(`http://localhost:8080/my`);
  } catch (err) {
    res.send(err);
  }
});

// router.post(`/add`, async (req, res) => {
//   try {
//     res.send(await annoucementService.create(req.body));
//   } catch (err) {
//     res.send(err);
//   }
// });

// router.post(`/add`, upload.single(`avatar`), async (req, res) => {
//   const {file} = req;
//   res.send(file);
// });

module.exports = router;
