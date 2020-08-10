const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const Shipper = require("../models/shipper.model");
const Admin = require("../models/admin.model");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res, next) => {
    User.findOne({ phone: req.body.phone }, (err, user) => {
        if (user == null) {
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                if (err) return next(err);
                const user = new User(req.body);
                user.password = hash;
                user.avatar = "user-avatar-default.png";
                user.save((err, result) => {
                    if (err) return res.json({ err });
                    var token = jwt.sign({ _id: user._id, cart: user.cart.length, fullname: user.fullname, admin: false, avatar: user.avatar }, "project4foodtap", { algorithm: "HS256" });
                    res.json({ access_token: token });

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
                var token = jwt.sign({ _id: user._id, cart: user.cart.length, fullname: user.fullname, admin: false, avatar: user.avatar }, "project4foodtap", { algorithm: "HS256" });
                // var io = req.app.locals.io;
                // io.on("connection", (socket) => {
                //     io.sockets.emit("connection");
                // })
                res.json({ access_token: token });
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
module.exports.logout = async (req, res) => {
    res.json("You have signed out!!!");
}

module.exports.loginShipper = async (req, res) => {
    Shipper.findOne({ phone: req.body.phone }, (err, shipper) => {
        if (err) res.json(err);
        if (shipper != null) {
            if (bcrypt.compareSync(req.body.password, shipper.password)) {
                var io = req.app.locals.io;
                var token = jwt.sign({ _id: shipper._id, fullname: shipper.fullname, shipper: true }, "project4foodtap", { algorithm: "HS256" });
                // io.on("connection", (socket) => {
                //     io.sockets.emit("messageServer");
                // })
                res.json({ access_token: token });
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
module.exports.registerShipper = async (req, res) => {
    Shipper.findOne({ phone: req.body.phone }, (err, shipper) => {
        if (shipper == null) {
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                if (err) return res.json(err);
                const shipper = new Shipper(req.body);
                shipper.password = hash;
                shipper.save((err, result) => {
                    if (err) return res.json({ err });
                    res.json({ shipper: result });
                })
            })
        } else {
            res.json({ err: "Phone has been used" });
        }
    })
}

module.exports.loginAdmin = async (req, res) => {
    Admin.findOne({ username: req.body.username }, (err, user) => {
        if (err) res.json(err);
        if (user != null) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                var token = jwt.sign({ _id: user._id, fullname: user.fullname, admin: true, avatar: user.avatar }, "project4foodtap", { algorithm: "HS256" });
                res.json({ access_token: token });
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

module.exports.logoutShipper = async (req, res) => {
    Shipper.findOne({ phone: req.body.phone }, (err, shipper) => {
        if (shipper == null) {
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                if (err) return res.json(err);
                const shipper = new Shipper(req.body);
                shipper.password = hash;
                shipper.save((err, result) => {
                    if (err) return res.json({ err });
                    res.json({ shipper: result });
                })
            })
        } else {
            res.json({ err: "Phone has been used" });
        }
    })
}

module.exports.isAuthenticated = (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(" ")[0] == "JWT") {
        var jwtToken = req.headers.authorization.split(" ")[1];
        jwt.verify(jwtToken, "project4foodtap", (err, payload) => {
            if (err) {
                res.status(401).json({ message: "Unauthorized" });
            } else {
                if (!payload.shipper) {
                    if (payload.admin == false) {
                        User.findOne({ _id: payload._id }, (err, user) => {
                            if (user) {
                                if (user.active){
                                    req.user = user;
                                    next();
                                }else{
                                    return res.status(325).json({message:"Account has been disabled"})
                                }
                            } else {
                                res.status(401).json({ message: "Unauthorized user!" });
                            }
                        })
                    } else {
                        Admin.findOne({ _id: payload._id }, (err, user) => {
                            if (user) {
                                req.user = user;
                                next();
                            } else {
                                res.status(401).json({ message: "Unauthorized user!" });
                            }
                        })
                    }

                }
                else {
                    Shipper.findOne({ "_id": payload._id }, (err, shipper) => {
                        if (shipper) {
                            req.shipper = shipper;
                            next();
                        } else {
                            res.status(401).json({ message: "Unauthorized user!" });
                        }
                    })
                }
            }
        })
    } else {
        res.status(401).json({ message: "Unauthorized user!" });
    };
}