const User = require("../models/user.model");
const Comment = require("../models/comment.model");
const Newfeed = require("../models/newfeed.model");
const Like = require("../models/like.model");
module.exports.getUsers = async (req, res) => {
    var users = await User.find();
    res.json(users);
}
module.exports.getUser = async (req,res) =>{
    return res.json(User.findOne({_id:req.params.id}));
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
module.exports.requestFriend = async (req, res) => {
    let idRequest = req.params.id;
    await User.findOne(req.user._id, async (err, doc) => {
        doc.friends.push({
            user: idRequest,
            status: "pending"
        })
        await doc.updateOne(doc);
    })
    await User.findOne({ _id: idRequest }, async (err, doc) => {
        doc.friends.push({
            user: req.user._id,
            status: "requested"
        })
        await doc.updateOne(doc);
    })
    res.json("Successfully");
}
module.exports.cancelRequest = async (req, res) => {
    let idRequest = req.params.id;
    await User.findOne(req.user._id, async (err, doc) => {
        var friendRequest = doc.friends.find(x => x.user == idRequest.toString());
        doc.friends.splice(doc.friends.indexOf(friendRequest), 1);
        await doc.updateOne(doc);
    })
    await User.findOne({ _id: idRequest }, async (err, doc) => {
        var friendRequest = doc.friends.find(x => x.user == req.user._id.toString());
        doc.friends.splice(doc.friends.indexOf(friendRequest), 1);
        await doc.updateOne(doc);
    })
    res.json("Successfully");
}
module.exports.acceptRequest = async (req, res) => {
    let idRequest = req.params.id;
    await User.findOne(req.user._id, async (err, doc) => {
        var friendRequest = doc.friends.find(x => x.user == idRequest.toString());
        friendRequest.status = "accepted";
        await doc.updateOne(doc);
    })
    await User.findOne({ _id: idRequest }, async (err, doc) => {
        var friendRequest = doc.friends.find(x => x.user == req.user._id.toString());
        friendRequest.status = "accepted";
        await doc.updateOne(doc);
    })
    res.json("Successfully");
}

module.exports.comment = async (req, res) => {
    let comment = new Comment(req.body);
    comment.user = req.user._id;
    comment.newfeed = req.params.id;
    comment.save((err, doc) => {
        User.findById(doc.user, async (err, user) => {
            user.comments.push(doc);
            await user.updateOne(user);
        })
        Newfeed.findById(doc.newfeed, async (err,newfeed)=>{
            newfeed.comments.push(doc);
            await newfeed.updateOne(newfeed);
        })
        return res.json(doc);
    })
}

module.exports.like = async (req, res) => {
    let like = new Like(req.body);
    like.user = req.user._id;
    like.newfeed = req.params.id;
    like.save((err, doc) => {
        User.findById(doc.user, async (err, user) => {
            user.likes.push(doc);
            await user.updateOne(user);
        })
        Newfeed.findById(doc.newfeed, async (err,newfeed)=>{
            newfeed.likes.push(doc);
            await newfeed.updateOne(newfeed);
        })
        return res.json(doc);
    })
}