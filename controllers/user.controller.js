var User = require("../models/user.model");
module.exports.getUser = async (req, res) => {
    var users = await User.find();
    res.json(users);
}
