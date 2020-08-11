const mongoose = require("mongoose");
const Scheme = mongoose.Schema;
let shipper = new Scheme(
    {
        fullname: String,
        phone: String,
        password: String,
        dob: Date,
        idCard: String,
        gender: Boolean,
        numberCancel: {
            type:Number,
            default:0
        },
        active: {
            type:Boolean, 
            default: true
        },
        avatar: String,
        currentOrder: {
            type: Scheme.Types.ObjectId,
            ref: "Order"
        },
        rating: [
            {
                user: {
                    type: Scheme.Types.ObjectId,
                    ref: "User"
                },
                stars: {
                    type: Number,
                    min: 1,
                    max: 5
                },
                comment: String
            }
        ],
        orders: [
            {
                type: Scheme.Types.ObjectId,
                ref: "Order"
            }
        ]
    }
)
module.exports = mongoose.model("Shipper", shipper, "Shipper");