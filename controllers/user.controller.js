const bcrypt = require("bcrypt");
const User = require("../models/user.model");
module.exports.getUser = async (req, res) => {
    var users = await User.find();
    res.json(users);
}
module.exports.register = async (req, res, next) => {
    User.findOne({ phone: req.body.phone }, (err, user) => {
        if (user == null) {
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                if (err) return next(err);
                const user = new User(req.body);
                user.password = hash;
                user.save((err, result) => {
                    if (err) return res.json({ err });
                    res.json({ user: result });
                })
            })
        } else {
            res.json({ err: "Phone has been used" });
        }
    })
}
