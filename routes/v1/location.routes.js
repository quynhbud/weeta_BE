const express = require('express');
const { locationController } = require('../../controllers');
const router = express.Router();

router.get('/districts', locationController.getDistricts);
router.get('/wards/:codeDistrict', locationController.getWards);

module.exports = router;
