const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.json());
mongoose.connect("mongodb://localhost:27017/foodtap");


let userRoute = require("./routes/user.route.js");
var server =   require("http").Server(app);
app.use("/user/", userRoute);

server.listen(9032, () => {
    console.log("Server is running...");
})
const io = require("socket.io")(server);
io.on("connection",(socket)=>{
    socket.on("sendMessageServer",function(data){
        socket.broadcast.emit("sendMessageClient",data);
    })
})