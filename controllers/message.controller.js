let User = require("../models/user.model");
let Message = require("../models/message.model");
const { json } = require("body-parser");
const { populate } = require("../models/user.model");

module.exports.sendMessage = async (req, res) => {

}
module.exports.getMessages = async (req, res) => {

}
module.exports.getListFriends = async (req, res) => {
    User.findOne(req.user._id, (err, doc) => {
        if (err) return res.json(err);
        doc.populate("friends.user",["fullname","avatar"],(err,docPopulated)=>{
            return res.json(docPopulated);
        })    
    });
}