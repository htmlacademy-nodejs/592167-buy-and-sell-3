'use strict';

const {Router} = require(`express`);
const router = new Router();

const multer = require(`multer`);
const md5 = require(`md5`);

const usersServices = require(`../services/users`);
const {FRONTEND_URL} = require(`../../constants`);

const UPLOAD_DIR = `${__dirname}/../../static/avatar`;

const MimeTypeExtension = {
  'image/png': `png`,
  'image/jpeg': `jpg`,
  'image/jpg': `jpg`,
};

const maxFileSize = 5 * 1024 * 1024;

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
    fileSize: maxFileSize,
  }
});

router.post(`/`, upload.single(`avatar`), async (req, res) => {
  try {
    const data = req.body;
    data.avatar = req.file.filename;
    await usersServices.add(data);
    res.redirect(`${FRONTEND_URL}/login`);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
