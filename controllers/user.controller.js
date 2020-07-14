const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.getUsers = async (req, res) => {
    var users = await User.find();
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
            user.updateOne(user, (err, raw) => {
                if (err) return res.json(err);
                return res.json(raw)
            })
        }
    });
}

module.exports.getUser = async (req, res) => {
    let user = await User.findById({_id: req.params.id}, (err, user) => {
        if (err) res.json(res);
        if (!user) { return res.json('Cant Find')}
        else {
            res.json(user);
        }
    });
}