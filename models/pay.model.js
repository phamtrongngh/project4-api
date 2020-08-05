const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let pay = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    restaurant:{
        type:Schema.Types.ObjectId,
        ref:"Restaurant"
    },
    type:{
        type:String,
        enum:["creating_restaurant"]
    },
    status:Boolean,
    amount: Number
}, { timestamps: true });
module.exports = mongoose.model("Pay", pay, "Pay");
