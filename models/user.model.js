var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema({
    phone: String,
    password: String,
    dob: Date,
    fullname: String,
    email: String,
    address: String,
    avatar: String,
    gender: Boolean,
    friends: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            status: Number,
            enums: [
                0,    //'add friend',
                1,    //'requested',
                2,    //'pending',
                3,    //'friends'
            ]
        }
    ],
    restaurants: [
        {
            restaurant: {
                type: Schema.Types.ObjectId,
                ref: "Restaurant"
            }
        }
    ],
    comments: [
        {
            idNewFeed: String,
            content: String,
            created_date: Date
        }
    ],
    newfeeds:[{type:Schema.Types.ObjectId, ref:"NewFeed"}],
    followers:[{type:Schema.Types.ObjectId,ref:"User"}],
    following:[{type:Schema.Types.ObjectId,ref:"User"}],
    active:Boolean
}, { timestamps: true })
module.exports = mongoose.model("User", userSchema, "User");