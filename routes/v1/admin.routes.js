const express = require('express');
const accountController  = require('../../controllers/account.controller');

const router = express.Router();

router.post('/signup',accountController.createAccount);

router.get('/get-account', accountController.getAccount);

router.get('/get-account/:id', accountController.getAccountById);
module.exports = router;