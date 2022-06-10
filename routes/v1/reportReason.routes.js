const express = require('express');
const { reportReasonController } = require('../../controllers');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/', auth(), reportReasonController.createReason);
router.patch('/:reasonId', auth(), reportReasonController.updateReason);
router.delete('/:reasonId', auth(), reportReasonController.deleteReason);
router.get('/', reportReasonController.getListReason);

module.exports = router;
