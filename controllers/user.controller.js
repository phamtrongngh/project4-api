const User = require("../models/user.model");
const Comment = require("../models/comment.model");
const Newfeed = require("../models/newfeed.model");
const Like = require("../models/like.model");

module.exports.getUsers = async (req, res) => {
    var users = await User.find();
    res.json(users);
}

module.exports.getUser = async (req, res) => {
    await User.findById({ _id: req.params.id }, async (err, user) => {
        if (err) res.json(res);
        if (!user) { return res.json('Cant Find') }
        else {
            await user.populate("newfeeds", async (err, result) => {
                await result.populate("newfeeds.restaurant", (err, doc) => {
                    return res.json(doc);
                })
            })
        }
    });
}

module.exports.getMyUser = async (req, res) => {
    let select = "fullname orders newfeeds friends avatar description followers address phone";
    await User.findOne(req.user._id, select, async (err, user) => {
        if (err) return res.json(err);
        await user.populate("orders newfeeds", async (err, result) => {
            await result.populate("orders.products.product newfeeds.restaurant", async (err, doc) => {
                await doc.populate("orders.products.product.restaurant", (err, doc2) => {
                    return res.json(doc);
                })
            })
        })
    })
}
module.exports.updateUser = async (req, res) => {
    req.body = JSON.parse(req.body.user);
    User.findById(req.user._id, (err, user) => {
        if (err) res.json(err)
        if (!user) {
            return res.json('Cant Find');
        }
        else {
            user.address = req.body.address;
            let avatar = req.file;
            if (!avatar) {
                user.avatar = "user-avatar-default.png";
            } else {
                user.avatar = avatar.path.split("\\")[2];
            }
            user.fullname = req.body.fullname;
            user.updateOne(user, (err, raw) => {
                if (err) return res.json(err);
                return res.json(user);
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
        Newfeed.findById(doc.newfeed, async (err, newfeed) => {
            newfeed.comments.push(doc);
            await newfeed.updateOne(newfeed);
        })
        return res.json(doc);
    })
}

module.exports.addToCart = async (req, res) => {
    let objCart = {
        product: req.body.product,
        quantity: req.body.quantity
    }
    var check = true;
    req.user.cart.forEach(x => {
        if (x.product.toString() == objCart.product) {
            x.product = objCart.product;
            x.quantity = objCart.quantity;
            check = false;
        }
    })
    if (check) req.user.cart.push(objCart);
    await req.user.updateOne(req.user);
    let size = req.user.cart.length;
    return res.json(size);

}
module.exports.removeFromCart = async (req, res) => {
    let id = req.params.id;
    let item = req.user.cart.find(x => x.product == id);
    let index = req.user.cart.indexOf(item);
    req.user.cart.splice(index, 1);
    await req.user.updateOne(req.user);
    return res.json("Đã thêm món vào giỏ hàng");
}
module.exports.getCart = async (req, res) => {
    let user = await User.findOne({ _id: req.user._id })
        .select("fullname phone cart address _id");
    user.populate("cart.product", async (err, doc) => {
        doc.populate("cart.product.restaurant", "name address", (err, result) => {
            return res.json(result);
        })
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
        Newfeed.findById(doc.newfeed, async (err, newfeed) => {
            newfeed.likes.push(doc);
            await newfeed.updateOne(newfeed);
        })
        return res.json(doc);
    })
}
