const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let comment = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    newfeed: {
        type: Schema.Types.ObjectId,
        ref: "Newfeed"
    },
    reply: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    replyTo:{
        type:Schema.Types.ObjectId,
        ref:"Comment"
    },
    commentType: {
        type: String,
        enum: ["text", "image"]
    },
    content: String
}, { timestamps: true });
module.exports = mongoose.model("Comment", comment, "Comment");