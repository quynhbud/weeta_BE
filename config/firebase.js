const fb = require('firebase');
const config = require('./config');
// Creates and initializes a Firebase app instance. Pass options as param
const firebase = fb.initializeApp(config.firebase);
module.exports =  firebase;