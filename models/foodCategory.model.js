var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var foodCategorySchema = new Schema({
    name: String,
    image: String,
    tag:String
}, { timestamps: true })
module.exports = mongoose.model("FoodCategory", foodCategorySchema, "FoodCategory");