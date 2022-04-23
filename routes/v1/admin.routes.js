const express = require('express');
const  AdminController = require('../../controllers/admin.controller');
const auth = require('../../middlewares/auth');
const router = express.Router();

router.post('/approvedArticle/:id',auth(), AdminController.approvedArticle )

module.exports = router;