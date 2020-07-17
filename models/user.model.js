var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema({
    phone: String,
    password: String,
    dob: Date,
    fullname: String,
    email: String,
    address: {
        city: String, //Thanh pho
        town: String, //Quan
        ward: String, //Phuong
        street: String //dia chi cu the tu viet
    },
    avatar: String,
    gender: Boolean,
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
    orders:[
        {
            type:Schema.Types.ObjectId,
            ref:"Order"
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
            ref: "NewFeed"
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
    active: Boolean
}, { timestamps: true })
module.exports = mongoose.model("User", userSchema, "User");