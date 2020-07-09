const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
mongoose.connect("mongodb://localhost:27017/foodtap", { useNewUrlParser: true, useUnifiedTopology: true });

const userRoute = require("./routes/user.route.js");
const newfeedRoute = require("./routes/newfeed.route.js");
const restaurantRoute = require("./routes/restaurent.route.js");
const productRoute = require("./routes/product.route");
const foodCategoryRoute = require("./routes/foodCategory.route")
const authController = require("./controllers/auth.controller");
const shipperRoute = require("./routes/shipper.route");
const orderRoute = require("./routes/order.route")
const authRoute = require("./routes/auth.route");

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

app.use("/auth", authRoute);
app.use(authController.isAuthenticated);
app.use("/newfeed", newfeedRoute);
app.use("/restaurant", restaurantRoute);
app.use("/product", productRoute)
app.use("/foodcategory", foodCategoryRoute)
app.use("/shipper", shipperRoute)
app.use("/order", orderRoute)

server.listen(9032, () => {
    console.log("Server is running...");
})
global.listUser = [];
app.locals.io = io;