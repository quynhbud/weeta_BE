const express = require('express');
const validate = require('../../middlewares/validate');
const articleController = require('../../controllers/article.controller');
const auth = require('../../middlewares/auth');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('files',12);

const router = express.Router();

router.get('/getListArticle',articleController.getListArticle);
router.post('/createArticle',auth(),upload, articleController.createArticle);
router.put('/updateArticle/:articleId',auth(), articleController.updateArticle)
router.get('/searchArticle', articleController.searchArticle);
router.get('/detailArticle/:articleId', articleController.getDetailArticle);
router.get('/get-list-tin-top', articleController.getListTinTop);

module.exports = router;
