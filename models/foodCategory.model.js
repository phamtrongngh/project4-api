var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var foodCategorySchema = new Schema({
    name:String
}, { timestamps: true })
module.exports = mongoose.model("FoodCategory", foodCategorySchema, "FoodCategory");