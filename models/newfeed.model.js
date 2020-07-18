var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var newfeedSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant"
    },
    content: String,
    images: [ String
],
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            type:Schema.Types.ObjectId,
            ref:"Comment"
        }
    ],
    typed: Boolean //true = Normal Newfeed | false = Food Newfeed
}, { timestamps: true })
module.exports = mongoose.model("Newfeed", newfeedSchema, "Newfeed");