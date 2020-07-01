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
    idRes: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant"
    },
    rating: [
        {
            idUser: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            stars:{
                type:Number,
                enum:[1,2,3,4,5]
            },
            comment:String
        }
    ]
}, { timestamps: true })
module.exports = mongoose.model("Product", productSchema, "Product");