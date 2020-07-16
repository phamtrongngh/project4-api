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
module.exports.requestFriend = async (req,res) =>{
    let idRequest = req.params.id;
    await User.findOne(req.user._id, async (err,doc)=>{
        doc.friends.push({
            user:idRequest,
            status:"pending"
        })
        await doc.updateOne(doc);
    })
    await User.findOne({_id:idRequest}, async (err,doc)=>{
        doc.friends.push({
            user:req.user._id,
            status:"requested"
        })
        await doc.updateOne(doc);
    })
    res.json("Successfully");
}
module.exports.cancelRequest = async (req,res) =>{
    let idRequest = req.params.id;
    await User.findOne(req.user._id, async (err,doc)=>{
        var friendRequest = doc.friends.find(x=>x.user==idRequest.toString());
        doc.friends.splice(doc.friends.indexOf(friendRequest),1);
        await doc.updateOne(doc);
    })
    await User.findOne({_id:idRequest}, async (err,doc)=>{
        var friendRequest = doc.friends.find(x=>x.user==req.user._id.toString());
        doc.friends.splice(doc.friends.indexOf(friendRequest),1);
        await doc.updateOne(doc);
    })
    res.json("Successfully");
}
module.exports.acceptRequest = async (req,res) =>{
    let idRequest = req.params.id;
    await User.findOne(req.user._id, async (err,doc)=>{
        var friendRequest = doc.friends.find(x=>x.user==idRequest.toString());
        friendRequest.status="accepted";
        await doc.updateOne(doc);
    })
    await User.findOne({_id:idRequest}, async (err,doc)=>{
        var friendRequest = doc.friends.find(x=>x.user==req.user._id.toString());
        friendRequest.status="accepted";
        await doc.updateOne(doc);
    })
    res.json("Successfully");
}