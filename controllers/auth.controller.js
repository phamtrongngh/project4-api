const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.isAuthenticated = (req,res,next)=>{
    if (req.headers && req.headers.authorization && req.headers.authorization.split(" ")[0]=="JWT"){
        var jwtToken = req.headers.authorization.split(" ")[1];
        jwt.verify(jwtToken,"project4foodtap")
    };
}