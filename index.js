const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/foodtap", { useNewUrlParser: true, useUnifiedTopology: true });
let userRoute = require("./routes/user.route.js");

let newfeedRoute = require("./routes/newfeed.route.js");

let restaurentRoute = require("./routes/restaurent.route.js");

let productRoute = require("./routes/product.route");

app.use(bodyParser.json());

app.use("/user", userRoute);
app.use("/newfeed", newfeedRoute);
app.use("/restaurant", restaurentRoute);
app.use("/product", productRoute)

const server = require("http").createServer(app);
const io = require("socket.io")(server);
server.listen(9032, () => {
    console.log("Server is running...");
})
app.locals.io = io;