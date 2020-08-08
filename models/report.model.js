var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var reportSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: "Retaurant"
    },
    newfeed: {
        type: Schema.Types.ObjectId,
        ref: "Newfeed"
    },
    content: String
}, { timestamps: true }) 
module.exports = mongoose.model("Report", reportSchema, "Report")