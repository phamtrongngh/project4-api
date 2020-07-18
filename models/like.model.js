const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let like = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    newfeed:{
        type:Schema.Types.ObjectId,
        ref:"Newfeed"
    }
},{timestamps:true});
module.exports = mongoose.model("Like",like,"Like");