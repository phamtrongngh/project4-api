const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");


module.exports.getUser = async (req, res) => {
    var ref = ['friends', 'restaurants', 'comments', 'newfeeds', 'followers', 'following'];
    var users = await User.find().populate(ref);
    res.json(users);
}

module.exports.updateUser = async (req, res) => {
    User.findById(req.body._id, (err, user) => {
        if (err) res.json(err)
        if (!user) {
            return res.json('Cant Find');
        }
        else {
            user.set(req.body);
            user.save((error, result) => {
                if (error) res.json(error)
                res.json({ us: result })
            });
        }
    });
}

