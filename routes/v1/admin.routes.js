const express = require('express');
const  AdminController = require('../../controllers/admin.controller');
const auth = require('../../middlewares/auth');
const router = express.Router();

router.post('/approvedArticle/:id',auth(), AdminController.approvedArticle )
router.post('/rejectArticle/:id', auth(), AdminController.rejectArticle)
router.post('/approvedIDCard/:id',auth(), AdminController.approvedIDCard )
router.get('/get-list-user', auth(), AdminController.getListUser)
router.get('/get-list-lessor', auth(), AdminController.getListLessor)
router.delete('/delete-account/:accountId', auth(), AdminController.deleteAccount)
router.get('/article-of-week', AdminController.articleOfWeek)
router.get('/statistical-transaction', AdminController.statisticalTransaction)
router.get('/list-lessor-need-autoapproved', AdminController.listLessorNeedAutoApproved)

module.exports = router;