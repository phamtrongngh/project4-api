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
    active: {
        type: Boolean,
        default: true
    },
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
    numberCancel:{
        type:Number,
        default:0
    },
    notifications: [
        {
            fromUser: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            fromRestaurant: {
                type: Schema.Types.ObjectId,
                ref: "Restaurant"
            },
            toRestaurant: {
                type: Schema.Types.ObjectId,
                ref: "Restaurant"
            },
            toNewfeed: {
                type: Schema.Types.ObjectId,
                ref: "Newfeed"
            },
            date: Date,
            content: String,
            link: String
        }
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
            ],
            status:Boolean // true = Readed,  false = hasn't been readed
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
    following: {
        users: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        restaurants: [
            {
                type: Schema.Types.ObjectId,
                ref: "Restaurant"
            }
        ]
    },
    coupons: [
        {
            type: Schema.Types.ObjectId,
            ref: "Coupon"
        }
    ],
    favourites: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Newfeed"
        }
    ],
    active: Boolean
}, { timestamps: true })
module.exports = mongoose.model("User", userSchema, "User");