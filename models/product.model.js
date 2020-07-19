var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var productSchema = new Schema({
    name: String,
    price: Number,
    category: [
        {
            type: Schema.Types.ObjectId,
            ref: "FoodCategory"
        }
    ],
    saleoff: Number,
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant"
    },
    image: String,
    rating: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            stars: {
                type: Number,
                min:1,
                max:5
            },
            comment: String
        }
    ]
}, { timestamps: true })
module.exports = mongoose.model("Product", productSchema, "Product");