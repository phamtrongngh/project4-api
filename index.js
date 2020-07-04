const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
mongoose.connect("mongodb://localhost:27017/foodtap", { useNewUrlParser: true, useUnifiedTopology: true });

let userRoute = require("./routes/user.route.js");
let newfeedRoute = require("./routes/newfeed.route.js");
let restaurantRoute = require("./routes/restaurent.route.js");
let productRoute = require("./routes/product.route");
let foodCategoryRoute = require("./routes/foodCategory.route")
let authController = require("./controllers/auth.controller");

app.use(cookieParser());
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
app.use(authController.isAuthenticated);
app.use("/newfeed", newfeedRoute);
app.use("/restaurant", restaurantRoute);
app.use("/product", productRoute)
app.use("/foodcategory", foodCategoryRoute)

server.listen(9032, () => {
    console.log("Server is running...");
})
global.listUser = [];
app.locals.io = io;