const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let admin = new Schema({
    username: String,
    password: String,
    content: String
}, { timestamps: true });
module.exports = mongoose.model("Admin", admin, "Admin");