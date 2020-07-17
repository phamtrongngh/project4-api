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
    address: {
        city: String, // Thanh pho
        town: String, // Quan
        ward: String, // Phuong
        street: String // Dia chi cu the tu viet
    },
    total: Number,
    shipper: {
        type: Schema.Types.ObjectId,
        ref: "Shipper"
    },
    status: {
        type: String,
        enum: ["finding","receiving, delivering, completed, canceled"]
    }
}, { timestamps: true });
module.exports = mongoose.model("Order", order, "Order");