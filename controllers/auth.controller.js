const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.isAuthenticated = (req,res,next)=>{
    if (req.headers && req.headers.authorization && req.headers.authorization.split(""));
}