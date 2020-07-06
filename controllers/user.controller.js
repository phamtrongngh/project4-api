const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");


module.exports.getUser = async (req, res) => {
    var users = await User.find();
    res.json(users);
}

