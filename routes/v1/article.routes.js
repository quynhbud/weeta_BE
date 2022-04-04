const express = require('express');
const validate = require('../../middlewares/validate');
const articleController = require('../../controllers/article.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/getListArticle',articleController.getListArticle);
router.post('/createArticle',auth(), articleController.createArticle);
router.put('/updateArticle/:articleId',auth(), articleController.updateArticle)
router.get('/searchArticle', articleController.searchArticle);
module.exports = router;
