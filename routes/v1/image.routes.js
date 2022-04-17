const express = require('express');
const multer = require('multer');
const imageController = require('../../controllers/image.controller');
const router = express.Router();
const storage = multer.memoryStorage();

const upload = multer({ storage: storage }).single('file');
// POST - Add Image to Cloud Storage
router.post('/upload', upload, imageController.addImage);


module.exports = router;