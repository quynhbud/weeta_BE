const express = require('express');
const { imageController } = require('../../controllers');
const multer = require('multer');
const router = express.Router();
const storage = multer.memoryStorage();

const upload = multer({ storage: storage }).single('file');
// POST - Add Image to Cloud Storage
router.post('/upload', upload, imageController.addImage);

module.exports = router;
