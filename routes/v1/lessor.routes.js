const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation.js');
const lessorController = require('../../controllers/lessor.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();
router.post('/identifyPhoneNumber', auth(),lessorController.identifyPhoneNumber);
router.post('/verifyOtp', auth(), lessorController.createLessor)

router.get('/articles', auth(), lessorController.getListArticles)
module.exports = router;
