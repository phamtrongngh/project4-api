const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let coupon = new Schema({
    code: String,
    name: String,
    description: String,
    image: String,
    discount:Number,
    max: Number,
    min: Number,
    exp: Date,
    percent: Number,
    restaurants: [
        {
            type: Schema.Types.ObjectId,
            ref: "Restaurant"
        }
    ]
}, { timestamps: true });
module.exports = mongoose.model("Coupon", coupon, "Coupon");