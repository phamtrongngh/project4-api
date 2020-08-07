const User = require("../models/user.model");
const Comment = require("../models/comment.model");
const Newfeed = require("../models/newfeed.model");
const Product = require("../models/product.model");

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
module.exports.search = async (req, res) => {
    const keyword = req.params.keyword;
}
module.exports.getMyUser = async (req, res) => {
    let select = "fullname orders newfeeds friends avatar description followers address phone";
    await User.findOne(req.user._id, select, async (err, user) => {
        if (err) return res.json(err);
        await user.populate("orders newfeeds", async (err, result) => {
            await result.populate("orders.products.product newfeeds.restaurant newfeeds.comments newfeeds.likes", async (err, doc) => {
                await doc.populate("orders.products.product.restaurant newfeeds.comments.reply", (err, doc2) => {
                    return res.json(doc);
                })
            })
        })
    })
}
module.exports.getNotifications = async (req, res) => {
    await req.user.populate("notifications.fromUser notifications.toRestaurant", (err, result) => {
        return res.json(result.notifications);
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
                //Nothing
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
        var io = req.app.locals.io;
        io.sockets.in(doc._id).emit("friendRequest", req.user);
    })
    return res.json("Successfully");
}
module.exports.getFriendRequests = async (req, res) => {
    User.findOne({ _id: req.user._id }, async (err, resul) => {
        await resul.populate("friends.user", (err, docc) => {

            return res.json(docc.friends);
        });
    })
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
    let rep = req.body.reply;
    req.body.replyTo = rep;
    req.body.reply = undefined;
    let comment = new Comment(req.body);
    comment.user = req.user._id;
    comment.commentType = "text";
    comment.save(async (err, doc) => {
        if (rep) {
            await Comment.findOne({ _id: rep }, async (err, reply) => {
                reply.reply.push(doc._id);
                await reply.updateOne(reply);
            })
        }
        Newfeed.findById(doc.newfeed, async (err, newfeed) => {
            newfeed.comments.push(doc);
            await newfeed.updateOne(newfeed);
        })
        req.user.comments.push(doc._id);
        await req.user.updateOne(req.user);
        doc.populate("user", (err, resultss) => {
            return res.json(resultss);
        })
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
    if (req.user.cart.length > 0) {
        let item0 = await Product.findOne({ _id: req.user.cart[0].product })
        let currentItem = await Product.findOne({ _id: req.body.product })
        if (item0.restaurant.toString() == currentItem.restaurant.toString()) {
            if (check) req.user.cart.push(objCart);
            await req.user.updateOne(req.user);
            let size = req.user.cart.length;
            return res.json(size);
        }
        else {
            await req.user.updateOne(req.user);
            return res.json(-1);
        }
    } else {
        if (check) req.user.cart.push(objCart);
        await req.user.updateOne(req.user);
        let size = req.user.cart.length;
        return res.json(size);
    }
}
module.exports.switchCart = async (req, res) => {
    let objCart = {
        product: req.body.product,
        quantity: req.body.quantity
    }
    if (req.body.type == "save") {
        req.user.draft.push(req.user.cart);
    }
    req.user.cart = [];
    req.user.cart.push(objCart);
    await req.user.updateOne(req.user);
    return res.json(objCart);
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
    await Newfeed.findById(req.params.id, async (err, newfeed) => {
        let item = newfeed.likes.find(x => x.toString() == req.user._id);
        if (!item) {
            req.user.likes.push(req.params.id);
            await req.user.updateOne(req.user);
            newfeed.likes.push(req.user._id);
            await newfeed.updateOne(newfeed);
            return res.json("like");
        } else {
            let index = newfeed.likes.indexOf(item);
            newfeed.likes.splice(index, 1);
            await newfeed.updateOne(newfeed);
            let index2 = req.user.likes.indexOf(item);
            req.user.likes.splice(index2, 1);
            await req.user.updateOne(req.user);
            return res.json("unlike");
        }
    })
}
