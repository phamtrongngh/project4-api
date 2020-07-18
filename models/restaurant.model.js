var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var restaurantSchema = new Schema({
    name: String,
    managers: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            role: {
                type: String,
                enum: [
                    "admin",
                    "mod"
                ]
            }
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
            ref: "Product"
        }
    ],
    address: String,
    verified: Boolean,
    avatar: String,
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ]

}, { timestamps: true })
module.exports = mongoose.model("Restaurant", restaurantSchema, "Restaurant");