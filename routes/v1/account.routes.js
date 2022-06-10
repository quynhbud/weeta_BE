const express = require('express');
const auth = require('../../middlewares/auth');
const { accountController } = require('../../controllers');

const router = express.Router();

router.post('/signup', accountController.createAccount);

router.get('/get-account', accountController.getAccount);

router.get('/get-account/:id', accountController.getAccountById);

router.get('/save-article/:articleId', auth(), accountController.saveArticle);

module.exports = router;
