const express = require('express');
const { reviewController } = require('../../controllers');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/', auth(), reviewController.createReview);
router.patch('/:id', auth(), reviewController.updateReview);
router.delete('/:id', auth(), reviewController.deleteReview);
router.get('/list-review/:articleId', reviewController.getListReview);

module.exports = router;
