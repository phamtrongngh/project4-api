var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var restaurantSchema = new Schema({
    name: String,
    managers: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            role: Boolean //true = admin, false = mod
        }
    ],
    newfeeds: [
        {
            type: Schema.Types.ObjectId,
            ref: "Newfeed"
        }
    ],
    menus: [
        {
            type: Schema.Types.ObjectId,
            ref: "Food"
        }
    ],
    address: String,
    verified: Boolean,
    avatar: {
        type: Schema.Types.ObjectId,
        ref: "Image"
    },
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ]

}, { timestamps: true })
module.exports = mongoose.model("Restaurant", restaurantSchema, "Restaurant");