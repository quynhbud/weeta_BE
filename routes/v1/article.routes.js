const express = require('express');
const validate = require('../../middlewares/validate');
const articleController = require('../../controllers/article.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/createArticle',auth(), articleController.createArticle);

module.exports = router;
