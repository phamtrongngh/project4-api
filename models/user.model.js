var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema({
    phone: String,
    password: String,
    dob: Date,
    description: String,
    fullname: String,
    email: String,
    address: String,
    avatar: String,
    gender: Boolean,
    draft: [
        [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product"
                },
                quantity: Number
            }
        ]
    ],
    friends: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            status: {
                type: String,
                enum: [
                    "accepted",
                    "requested",
                    "pending"
                ]
            }
        }
    ],
    restaurants: [
        {
            type: Schema.Types.ObjectId,
            ref: "Restaurant"
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: "Order"
        }
    ],
    cart: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: Number
        }
    ],
    conversations: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            messages: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Message"
                }
            ]
        }
    ],
    newfeeds: [
        {
            type: Schema.Types.ObjectId,
            ref: "Newfeed"
        }
    ],
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    coupons:[
        {
            type:Schema.Types.ObjectId,
            ref:"Coupon"
        }
    ],
    favourites: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    active: Boolean
}, { timestamps: true })
module.exports = mongoose.model("User", userSchema, "User");