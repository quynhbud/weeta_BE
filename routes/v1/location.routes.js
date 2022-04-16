const express = require('express');
const locationController  = require('../../controllers/location.controller');
const router = express.Router();

router.get('/districts',locationController.getDistricts);


module.exports = router;