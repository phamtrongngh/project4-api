module.exports = function (io) {
    io.sockets.emit("messageServer", "Xin chao");
}