const admin = require('firebase-admin')
const config = require('./config');
var serviceAccount = require("./serviceAccount.json");

// Initialize firebase admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket:config.firebase.storageBucket,
})
// Cloud storage
const bucket = admin.storage().bucket()

module.exports = {
  bucket
}