var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var newfeedSchema = new Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    idRes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Restaurant"
        }
    ],
    content: String,
    images: [
        {
            type: Schema.Types.ObjectId,
            ref: "Image"
        }
    ],
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            content: String
        }
    ],
    typed: Boolean //true = Normal Newfeed | false = Food Newfeed
}, { timestamps: true })
module.exports = mongoose.model("Newfeed", newfeedSchema, "Newfeed");