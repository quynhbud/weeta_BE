const express = require('express');
const { conversationController } = require('../../controllers');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/conversation', auth(), conversationController.createConversation);
router.get(
    '/conversation/:memberId',
    auth(),
    conversationController.getConversation
);
router.get(
    '/get-list-conversations',
    auth(),
    conversationController.getListConversations
);
router.get(
    '/search-conversations',
    auth(),
    conversationController.searchConversations
);
module.exports = router;
