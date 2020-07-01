const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.isAuthenticated = (req,res,next)=>{
    if (req.headers && req.headers.authorization && req.headers.authorization.split(" ")[0]=="JWT"){
        var jwtToken = req.headers.authorization.split(" ")[1];
        jwt.verify(jwtToken,"project4foodtap",(err,payload)=>{
            if (err){
                res.status(401).json({message:"Unauthorized"});
            } else{
                User.findOne({"_id":payload._id}, (err,user)=>{
                    if (user){
                        req.user = user;
                        next();
                    }else{
                        res.status(401).json({message:"Unauthorized user!"});
                    }
                })
            }
        })
    }else{
        res.status(401).json({message:"Unauthorized user!"});
    };
}