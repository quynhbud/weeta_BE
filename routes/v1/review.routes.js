const express = require('express');
const reviewController = require('../../controllers/review.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/', auth(), reviewController.createReview);
router.put('/:id', auth(), reviewController.updateReview);
router.delete('/:id', auth(), reviewController.deleteReview);
router.get('/list-review/:articleId', reviewController.getListReview);


module.exports = router;