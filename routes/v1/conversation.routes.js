const express = require('express');
const validate = require('../../middlewares/validate');
const conversationController = require('../../controllers/conversation.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/conversation',auth(),conversationController.createConversation);
router.get('/conversation/:memberId',auth(),conversationController.getConversation);
router.get('/get-list-conversations', auth(), conversationController.getListConversations)

module.exports = router;