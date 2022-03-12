const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation.js');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/login', validate(authValidation.login), authController.login);
// router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
// router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
// router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
router.put('/update-profile', auth(), validate(authValidation.updateProfile), authController.updateProfile);
// router.put('/update-avatar', auth(), validate(authValidation.updateAvatar), authController.updateUserAvatar);
router.put('/change-password', auth(), validate(authValidation.changePassword), authController.changePassword);
// router.get('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);

//router.get('/get-current-account', auth(), authController.getCurrentAccount);
module.exports = router;
