const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let coupon = new Schema({
    code: String,
    name: String,
    description: String,
    image: String,
    max:Number,
    exp: Date,
    type: {
        type: String,
        enum: ["fee", "provisional"]
    },
    percent: Number,
    restaurant: [
        {
            type: Schema.Types.ObjectId,
            ref: "Restaurant"
        }
    ]
}, { timestamps: true });
module.exports = mongoose.model("Coupon", coupon, "Coupon");