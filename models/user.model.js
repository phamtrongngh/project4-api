var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    name:{
        type:String,
        require:true
    },
    age:{
        type:Number,
        required:true
    }
})
module.exports = mongoose.model("User",UserSchema,"User");