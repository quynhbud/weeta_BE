const express = require('express');
//const accountController = require('../controllers/account.controller');
const accountController  = require('../../controllers/account.controller');

const router = express.Router();

router.post('/signup',accountController.createAccount);

router.get('/get-account', accountController.getAccount);

router.get('/get-account/:id', accountController.getAccountById);
// router
//   .route('/')
//   .get(accountController.getAllAccounts)
//   .post(accountController.createAccount);

// router
//   .route('/:id')
//   .get(accountController.getAccount)
//   .patch(accountController.updateAccount)
//   .delete(accountController.deleteAccount);

module.exports = router;