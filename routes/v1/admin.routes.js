const express = require('express');
const { adminController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const router = express.Router();

router.post('/approvedArticle/:id', auth(), adminController.approvedArticle);
router.post('/rejectArticle/:id', auth(), adminController.rejectArticle);
router.post('/approvedIDCard/:id', auth(), adminController.approvedIDCard);
router.post('/rejectIDCard/:id', auth(), adminController.rejectIDCard);
router.get('/get-list-user', auth(), adminController.getListUser);
router.get('/get-list-lessor', auth(), adminController.getListLessor);
router.delete(
    '/delete-account/:accountId',
    auth(),
    adminController.deleteAccount
);
router.get('/article-of-week', adminController.articleOfWeek);
router.get('/statistical-transaction', adminController.statisticalTransaction);
router.get(
    '/list-lessor-need-autoapproved',
    adminController.listLessorNeedAutoApproved
);
router.get('/total-revenue', adminController.totalRevenue);
router.get('/total-article', adminController.totalArticle);
router.get('/total-user', adminController.totalUser);
module.exports = router;
