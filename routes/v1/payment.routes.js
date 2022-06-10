const express = require('express');
const auth = require('../../middlewares/auth');
const { paymentController } = require('../../controllers');
const router = express.Router();

router.post('/payment-package', auth(), paymentController.paymentPackage);
router.get('/save-payment-result', paymentController.savePaymentResult);

router.post('/payment-package-momo', auth(), paymentController.paymentWithMomo);
router.get('/save-payment-momo', paymentController.savePaymentMomo);
module.exports = router;
