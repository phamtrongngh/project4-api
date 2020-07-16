var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    messageType: {
        type: String,
        enum: ["text", "image"]
    },
    content: String
}, { timestamps: true })
module.exports = mongoose.model("Message", messageSchema, "Message");