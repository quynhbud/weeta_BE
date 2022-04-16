const express = require('express');
const validate = require('../../middlewares/validate');
const messageController = require('../../controllers/message.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/message',auth(),messageController.createMessage);
router.get('/message/:conversationId',auth(),messageController.getMessage);

module.exports = router;