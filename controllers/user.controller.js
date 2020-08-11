const User = require("../models/user.model");
const Comment = require("../models/comment.model");
const Newfeed = require("../models/newfeed.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const polyline = require("@mapbox/polyline");
const Restaurant = require("../models/restaurant.model");
module.exports.getUsers = async (req, res) => {
    var users = await User.find();
    res.json(users);
}

module.exports.getUser = async (req, res) => {
    await User.findById({ _id: req.params.id }, async (err, user) => {
        if (err) res.json(res);
        if (!user) { return res.json('Cant Find') }
        else {
            await user.populate("newfeeds friends", async (err, result) => {
                await result.populate("newfeeds.restaurant newfeeds.comments friends.user", (err, doc) => {
                    doc.populate("newfeeds.comments.reply newfeeds.comments.user", (err, result) => {
                        result.populate("newfeeds.comments.reply.user", (err, result) => {
                            result.newfeeds = result.newfeeds.reverse();
                            return res.json(result);
                        })
                    })
                })
            })
        }
    });
}
module.exports.searchByFullName = async (req, res) => {
    const keyword = req.params.keyword;
    function removeAccents(str) {
        return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
    }
    let resultUser = await User.find().select("fullname _id avatar");

    return res.json(resultUser.filter(item => removeAccents(item.fullname).toLowerCase().includes(removeAccents(keyword.toLowerCase())) && (req.user._id.toString() != item._id)));
}
module.exports.search = async (req, res) => {
    const keyword = req.params.keyword;
    let resultRestaurant;
    let resultUser;
    let resultProduct;
    function removeAccents(str) {
        return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
    }
    await Restaurant.find(
        (err, docs) => {
            resultRestaurant = docs.filter(item => removeAccents(item.name).toLowerCase().includes(removeAccents(keyword.toLowerCase())));
        }
    );
    await User.find(
        (err, docs) => {
            resultUser = docs.filter(item => removeAccents(item.fullname).toLowerCase().includes(removeAccents(keyword.toLowerCase())));
        }
    );
    await Product.find(
        (err, docs) => {
            resultProduct = docs.filter(item => removeAccents(item.name.toLowerCase()).includes(removeAccents(keyword.toLowerCase())));
        }
    );
    return res.json(
        {
            products: resultProduct.slice(0, 3),
            restaurants: resultRestaurant.slice(0, 3),
            users: resultUser.slice(0, 3)
        }
    )
}

module.exports.searchAll = async (req, res) => {
    const keyword = req.params.keyword;
    let resultRestaurant;
    let resultUser;
    let resultProduct;
    function removeAccents(str) {
        return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
    }
    await Restaurant.find(
        (err, docs) => {
            resultRestaurant = docs.filter(item => removeAccents(item.name).toLowerCase().includes(removeAccents(keyword.toLowerCase())));
        }
    );
    await User.find(
        (err, docs) => {
            resultUser = docs.filter(item => removeAccents(item.fullname).toLowerCase().includes(removeAccents(keyword.toLowerCase())));
        }
    );
    await Product.find(
        (err, docs) => {
            resultProduct = docs.filter(item => removeAccents(item.name.toLowerCase()).includes(removeAccents(keyword.toLowerCase())));
        }
    );
    return res.json(
        {
            products: resultProduct,
            restaurants: resultRestaurant,
            users: resultUser
        }
    )
}

module.exports.getMyUser = async (req, res) => {
    let select = "fullname orders newfeeds friends avatar draft description followers following address phone";
    await User.findOne(req.user._id, select, async (err, user) => {
        if (err) return res.json(err);
        await user.populate("orders newfeeds friends.user draft.product following.users followers following.restaurants", async (err, result) => {
            await result.populate("orders.products.product draft.product.restaurant followers.users newfeeds.restaurant newfeeds.comments", async (err, doc) => {
                await doc.populate("orders.products.product.restaurant newfeeds.comments.reply newfeeds.comments.user", async (err, doc2) => {
                    await doc.populate("newfeeds.comments.reply.user", (err, resultttt) => {
                        resultttt.newfeeds = resultttt.newfeeds.reverse();
                        return res.json(resultttt);
                    })
                })
            })
        })
    })
}
module.exports.getNotifications = async (req, res) => {
    await req.user.populate("notifications.fromUser notifications.toRestaurant notifications.toNewfeed", (err, result) => {
        return res.json(result.notifications.reverse());
    })
}
module.exports.sendRouteToShipper = async (req, res) => {
    var points = req.body.polyline;
    var idOrder = req.body.idOrder;
    await Order.findOne({ _id: idOrder }, (err, order) => {
        var io = req.app.locals.io;
        var route = polyline.decode(points);
        io.sockets.emit("road", route);
    })
}
module.exports.sendLocationUser = async (req, res) => {
    var idOrder = req.body.idOrder;
    var userLocation = req.body.userLocation;
    var restaurantLocation = req.body.restaurantLocation;
    await Order.findOne({ _id: idOrder }, (err, order) => {
        var io = req.app.locals.io;
        io.sockets.emit("locationUser", {
            userLocation : userLocation,
            restaurantLocation : restaurantLocation
        });
       
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
            user.description = req.body.description;
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

module.exports.changeActiveUser = async (req, res) => {
    let user = await User.findOne({ _id: req.params.id });
    if (user.active == true) {
        user.active = false;
        await user.updateOne(user);
    }
    else {
        user.active = true;
        user.numberCancel = 0;
        await user.updateOne(user);
    }
    return res.json(user);
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

module.exports.follow = async (req, res) => {
    if (req.body.target == "user") {
        await User.findOne({ _id: req.body.idValue }, async (err, user) => {
            let item = req.user.following.users.find(x => x.toString() == req.body.idValue);
            if (!item) {
                req.user.following.users.push(req.body.idValue);
                await req.user.updateOne(req.user);
                user.followers.push(req.user._id);
                await user.updateOne(user);
                return res.json("follow");
            } else {
                let index = user.followers.indexOf(item);
                user.followers.splice(index, 1);
                await user.updateOne(user);
                let index2 = req.user.following.users.indexOf(item);
                req.user.following.users.splice(index2, 1);
                await req.user.updateOne(req.user);
                return res.json("unfollow");
            }
        })
    } else {
        await Restaurant.findOne({ _id: req.body.idValue }, async (err, restaurant) => {
            let item = req.user.following.restaurants.find(x => x.toString() == req.body.idValue);
            if (!item) {
                req.user.following.restaurants.push(req.body.idValue);
                await req.user.updateOne(req.user);
                restaurant.followers.push(req.user._id);
                await restaurant.updateOne(restaurant);
                return res.json("follow");
            } else {
                let index = restaurant.followers.indexOf(item);
                restaurant.followers.splice(index, 1);
                await restaurant.updateOne(restaurant);
                let index2 = req.user.following.restaurants.indexOf(item);
                req.user.following.restaurants.splice(index2, 1);
                await req.user.updateOne(req.user);
                return res.json("unfollow");
            }
        })
    }
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
module.exports.recart = async (req, res) => {
    req.user.cart = req.user.draft[req.params.index];
    await req.user.updateOne(req.user);
    return res.json(req.user.cart.length);
}

module.exports.reorder = async (req, res) => {
    Order.findOne({ _id: req.params.id }, async (err, order) => {
        req.user.cart = order.products;
        await req.user.updateOne(req.user);
        return res.json(req.user.cart.length);
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
            var io = req.app.locals.io;
            await User.findOne({_id:newfeed.user}, async(err,user)=>{
                let noti = {
                    fromUser: req.user._id,
                    toNewfeed: newfeed,
                    content:"đã like bài viết của bạn",
                    date : Date.now(),
                    link: "/detail-newfeed/"+newfeed._id
                }
                user.notifications.push(noti);
                await user.updateOne(user);
                noti.avatar = req.user.avatar;
                noti.fullname = req.user.fullname;
                io.sockets.in(newfeed.user.toString()).emit("likeNewfeed",noti);
            })
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
