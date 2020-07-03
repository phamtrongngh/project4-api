const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let order = new Schema({
    idUser:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    listIdProduct:[
        {
            type:Schema.Types.ObjectId,
            ref:"Product"
        }
    ],
    address:{
        city:String, // Thanh pho
        town:String, // Quan
        ward:String, // Phuong
        street:String // Dia chi cu the tu viet
    },
    total: Number,
    shipperId:{
        type:Schema.Types.ObjectId,
        ref:"Shipper"
    },
    status:Boolean
},{timestamps:true});
module.exports = mongoose.model("Order",order,"Order");