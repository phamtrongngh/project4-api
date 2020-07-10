const mongoose = require("mongoose");
const Scheme = mongoose.Schema;
let shipper = new Scheme(
    {
        name: String,
        dob: Date,
        gender: Boolean,
        avatar: String,
        rating: [
            {
                user: {
                    type: Scheme.Types.ObjectId,
                    ref: "User"
                },
                stars: {
                    type: Number,
                    min:1,
                    max:5
                },
                comment: String
            }
        ],
        order: [
            {
                type: Scheme.Types.ObjectId,
                ref: "Order"
            }
        ]
    }
)
module.exports = mongoose.model("Shipper", shipper, "Shipper");