const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/foodtap", { useNewUrlParser: true, useUnifiedTopology: true });
let userRoute = require("./routes/user.route.js");
let newfeedRoute = require("./routes/newfeed.route.js");
let restaurentRoute = require("./routes/restaurent.route.js");

app.use(bodyParser.json());


const server = require("http").createServer(app);
const io = require("socket.io")(server);
io.on("connection",function(socket){
    socket.on("clientTyping",(data)=>{
        if (data){
            socket.broadcast.emit("serverTyping","block");
        }
        else{
            socket.broadcast.emit("serverTyping","none");
        }
    })
})
app.use("/user", userRoute);
app.use("/newfeed", newfeedRoute);
app.use("/restaurant", restaurentRoute);

server.listen(9032, () => {
    console.log("Server is running...");
})
global.listUser = [];
app.locals.io = io;