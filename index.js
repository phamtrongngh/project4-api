const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/foodtap");
let userRoute = require("./routes/user.route.js");
app.use("/user/", userRoute);
app.listen(9032, () => {
    console.log("Ok");
})