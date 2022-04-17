const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation.js');
const lessorController = require('../../controllers/lessor.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();
router.post('/identifyPhoneNumber', lessorController.identifyPhoneNumber);
router.post('/create',  lessorController.createLessor);

module.exports = router;
