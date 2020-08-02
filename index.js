const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/foodtap", { useNewUrlParser: true, useUnifiedTopology: true });

const userRoute = require("./routes/user.route.js");
const newfeedRoute = require("./routes/newfeed.route");
const restaurantRoute = require("./routes/restaurent.route.js");
const productRoute = require("./routes/product.route");
const foodCategoryRoute = require("./routes/foodCategory.route")
const authController = require("./controllers/auth.controller");
const shipperRoute = require("./routes/shipper.route");
const orderRoute = require("./routes/order.route")
const authRoute = require("./routes/auth.route");
const messageRoute = require("./routes/message.route");
const couponRoute = require("./routes/coupon.route");
app.use(bodyParser.json());
const server = require("http").createServer(app);
const io = require("socket.io")(server);


app.use("/authorization", authRoute);
app.use("/public/",express.static("public"));
app.use(authController.isAuthenticated);
app.use("/message",messageRoute);
app.use("/newfeed", newfeedRoute);
app.use("/restaurant", restaurantRoute);
app.use("/product", productRoute);
app.use("/foodcategory", foodCategoryRoute);
app.use("/shipper", shipperRoute);
app.use("/order", orderRoute);
app.use("/coupon",couponRoute);
app.use("/user",userRoute);
server.listen(9032, () => {
    console.log("Server is running...");
})
io.on("connection",function(socket){
    // console.log(socket.id);
})
app.locals.io = io;