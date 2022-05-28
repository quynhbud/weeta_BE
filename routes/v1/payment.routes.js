const express = require('express');
const auth = require('../../middlewares/auth');
const paymentController = require('../../controllers/payment.controller');
const router = express.Router();

router.post('/payment-package', auth(), paymentController.paymentPackage);
router.get('/save-payment-result', paymentController.savePaymentResult);

router.post('/payment-package-momo', paymentController.paymentWithMomo);
router.get('/save-payment-momo', paymentController.savePaymentMomo)
module.exports = router;
