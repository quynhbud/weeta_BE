const httpStatus = require('http-status');
const firebase = require('../config/firebase');  // reference to our db 
const catchAsync = require('../utils/catchAsync');
const { imageService } = require('../services');
require("firebase/storage"); // must be required for this to work
 // create a reference to storage
const { sendSuccess, sendError } = require('./return.controller');

// Add Image to Storage and return the file path

const addImage = catchAsync (async(req, res) => {
    const image = await imageService.addImage(req.file);
    if(image.status === 400){
        return sendError(res, httpStatus.BAD_REQUEST,image.msg)
    }
    sendSuccess(res, image, httpStatus.OK, image.msg)
})

module.exports = {
    addImage
}