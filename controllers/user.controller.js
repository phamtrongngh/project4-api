var User = require("../models/user.model");
const { json } = require("body-parser");
module.exports.getUser = async (req, res) => {
    var users = await User.find();
    res.json(users);
}