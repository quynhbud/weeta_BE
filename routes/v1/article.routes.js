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
router.post('/update-service-package', auth(), articleController.updateServicePackage);
router.post('/payment-service-package', auth(), articleController.paymentServicePackage);
router.get('/vnpay_ipn', articleController.getIPN)
router.get('/save-payment-result',articleController.savePaymentResult);
router.get('/get-all-article', articleController.getAllArticle);
module.exports = router;
