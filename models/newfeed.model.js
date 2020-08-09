var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var newfeedSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    place:String,
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant"
    },
    product:{
        type:Schema.Types.ObjectId,
        ref:"Product"
    },
    content: String,
    images: [String],
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            type:Schema.Types.ObjectId,
            ref:"Comment"
        }
    ],
    active: {
      type:Boolean,
      default:true  
    },
    typed: Boolean //true = Normal Newfeed | false = Food Newfeed
}, { timestamps: true })
module.exports = mongoose.model("Newfeed", newfeedSchema, "Newfeed");