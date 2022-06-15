const firebase = require('../config/firebase');  
require("firebase/storage"); 

const addImage = async(file) => {
    try {
        if(!file) {
            return {
              status : 400,
              msg : "file not found"
            }
        } else {
            const name = file.originalname.split(".")[0];
            const type = file.originalname.split(".")[1];
            const timestamp = new Date().getTime();
            const fileName = `${name}_${timestamp}.${type}`;
            const blob = firebase.bucket.file(fileName)
            
            const blobWriter = blob.createWriteStream({
                metadata: {
                    contentType: file.mimetype
                }
            })
            blobWriter.on('error', (err) => {
                console.log(err)
            })
            blobWriter.on('finish', () => {
                blob.makePublic();
            })
            blobWriter.end(file.buffer)
            const firebaseURL = `https://storage.googleapis.com/${firebase.bucket.name}/${fileName}`
            return {
              status: 200,
              msg : "uploaded file successfully",
              data: firebaseURL
            }
        }
     }  catch (error) {
      return {
        status : 400,
        msg : "Uploaded file fail"
      }
    }
}
const addMultiImage = async(files) => {
    let imageULRs = [];
    try {
        if(files.length > 10) {
            return {
                status: 400,
                msg: "Không quá 10 hình ảnh"
            }
        }
        files.map((file) => {
            if(!file) {
                return {
                  status : 400,
                  msg : "file not found"
                }
            } else {
                const name = file.originalname.split(".")[0];
                const type = file.mimetype.split("/")[1];
                const timestamp = new Date().getTime();
                const fileName = `${name}_${timestamp}.${type}`;
                const blob = firebase.bucket.file(fileName)
                
                const blobWriter = blob.createWriteStream({
                    metadata: {
                        contentType: file.mimetype
                    }
                })
                blobWriter.on('error', (err) => {
                    console.log(err)
                })
                blobWriter.on('finish', () => {
                    blob.makePublic();
                })
                blobWriter.end(file.buffer)
                const firebaseURL = `https://storage.googleapis.com/${firebase.bucket.name}/${fileName}`
                imageULRs.push(firebaseURL);
            }
        })
        return imageULRs;  
     }  catch (error) {
         return [];
    }

}
module.exports = {
    addImage,
    addMultiImage,
}