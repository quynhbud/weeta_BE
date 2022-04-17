const httpStatus = require('http-status');
const firebase = require('../config/firebase');  // reference to our db 
require("firebase/storage"); // must be required for this to work
 // create a reference to storage
const { sendSuccess, sendError } = require('./return.controller');

// Add Image to Storage and return the file path

const addImage = async (req, res) => {
    try {
        console.log(firebase.bucket)
        if(!req.file) {
            res.status(400).send("Error: No files found")
        } else {
            const name = req.file.originalname.split(".")[0];
            const type = req.file.originalname.split(".")[1];
            const timestamp = new Date().getTime();
            const fileName = `${name}_${timestamp}.${type}`;
            const blob = firebase.bucket.file(fileName)
            
            const blobWriter = blob.createWriteStream({
                metadata: {
                    contentType: req.file.mimetype
                }
            })
            
            blobWriter.on('error', (err) => {
                console.log(err)
            })
            
            blobWriter.on('finish', () => {
                blob.makePublic();
                const firebaseURL = `https://storage.googleapis.com/${firebase.bucket.name}/${fileName}`
                sendSuccess(res, {firebaseURL}, httpStatus.OK, "File upload successfully")
            })
            blobWriter.end(req.file.buffer)
        }
     }  catch (error) {
        console.log (error)
        sendError(res, 400, "File upload fail")
    }
}
module.exports = {
    addImage
}