const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");


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
                    var io = req.app.locals.io;
                    io.sockets.emit("messageRegister", "There some register");
                })
            })
        } else {
            res.json({ err: "Phone has been used" });
        }
    })
}

module.exports.login = async (req, res) => {
    User.findOne({ phone: req.body.phone }, (err, user) => {
        if (err) res.json(err);
        if (user != null) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                var io = req.app.locals.io;
                if (!listUser.find(x => x.phone == user.phone)) {
                    listUser.push(user);
                }
                var token = jwt.sign({ _id: user._id, fullname: user.fullname }, "project4foodtap", { algorithm: "HS256", expiresIn: "3h" });
                io.on("connection", (socket) => {
                    io.sockets.emit("messageServer", listUser);
                })
                res.json({access_token:token});
            }
            else {
                res.json({ message: "Wrong password" })
            }
        }
        else {
            res.json({ message: "Wrong username" });
        }
    })
}
module.exports.getUser = async (req, res) => {
    var users = await User.find();
    res.json(users);
}
module.exports.logout = async (req, res) => {
    var io = req.app.locals.io;
    listUser.splice(listUser.indexOf(listUser.find((x) => x.phone == req.body.phone)), 1);
    io.sockets.emit("messageServer", listUser);
    res.json("You have signed out!!!");
}