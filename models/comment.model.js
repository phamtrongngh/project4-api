const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let comment = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    newfeed:{
        type:Schema.Types.ObjectId,
        ref:"Newfeed"
    },
    commentType:{
        type:String,
        enum:["text","image"]
    }
},{timestamps:true});
module.exports = mongoose.model("Comment",comment,"Comment");