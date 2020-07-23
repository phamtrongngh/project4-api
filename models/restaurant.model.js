var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var restaurantSchema = new Schema({
    name: String,
    description: String,
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
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: "Order"
        }
    ],
    address: String,
    active: Boolean,
    verified: Boolean,
    avatar: String,
    licenseImage: String,
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ]

}, { timestamps: true })
module.exports = mongoose.model("Restaurant", restaurantSchema, "Restaurant");