var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var imageSchema = new Schema({
    postBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    url: String
}, { timestamps: true })
module.exports = mongoose.model("Image", imageSchema, "Image");