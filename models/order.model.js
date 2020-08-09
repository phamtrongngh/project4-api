const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let order = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: Number
        }
    ],
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant"
    },
    note: String,
    address: String,
    discount: Number,
    coupon: {
        type: Schema.Types.ObjectId,
        ref: "Coupon"
    },
    fee: Number,
    amount: Number, //Tổng số tiền
    shipper: {
        type: Schema.Types.ObjectId,
        ref: "Shipper"
    },
    status: {
        type: String,
        enum: ["paying", "finding", "receiving, delivering, completed, canceled"]
    },
    rated:{
        restaurant: Boolean,
        shipper: Boolean
    },
    canceledBy:{
        type:String,
        enum:["user","shipper"]
    }
}, { timestamps: true });
module.exports = mongoose.model("Order", order, "Order");
