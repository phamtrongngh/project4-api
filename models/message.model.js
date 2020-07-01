var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var messageSchema = new Schema({
    
}, { timestamps: true })
module.exports = mongoose.model("Message", newfeedSchema, "Message");