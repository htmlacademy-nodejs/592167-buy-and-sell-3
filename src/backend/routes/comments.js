'use strict';

const {Router} = require(`express`);
const router = new Router();

const commentServices = require(`../services/comment`);

router.get(`/delete/:id`, async (req, res) => {
  try {
    await commentServices.remove(req.params.id);
    res.json({isDelete: true});
  } catch (err) {
    console.error(err);
    res.json({isDelete: false});
  }
});

module.exports = router;
