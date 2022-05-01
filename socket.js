const SocketHandler = require('./sockets/handlers')
const jwt = require('jsonwebtoken')

function Socket(io) {
    // constructor
    this.io = io; //cache io
    // io.use(function (socket, next) {
    //     if(socket.handshake.query && socket.handshake.query.token){
    //         jwt.verify(socket.handshake.query.token, 'SECRET_KEY', function(err, decoded) {
    //             if (err) return next(new Error('Authentication error'));
    //             socket.decoded = decoded;
    //             next();
    //         });
    //     }
    // })
    io.on("connection", (socket) => {
        console.log(`-(${socket.id})` + " is connected");
        Object.keys(SocketHandler).forEach(e => {
            registerEventHandler(SocketHandler[e](socket), socket)
        })
        socket.on("disconnect", async () => {
        });
        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
    });
}
function registerEventHandler(handler, socket) {
    console.log("handle", handler)
    Object.keys(handler).forEach((eventName) => {
        socket.on(eventName, handler[eventName]);
    });
}
module.exports = Socket;