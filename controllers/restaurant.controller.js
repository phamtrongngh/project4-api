const Restaurant = require('../models/restaurant.model');
const User = require("../models/user.model");
const Momo = require("../momo.util/momo.restaurant");
const Pay = require("../models/pay.model");
module.exports.getRestaurants = async (req, res) => {
    var restaurant = await Restaurant.find().populate("managers.user");
    return res.json(restaurant);
}

module.exports.createRestaurant = async (req, res) => {
    req.body = JSON.parse(req.body.restaurant);
    await Restaurant.findOne({ name: req.body.name }, (err, restaurant) => {
        if (restaurant == null) {
            restaurant = new Restaurant(req.body);
            restaurant.managers.push({
                user: req.user._id,
                role: "admin"
            });

            let avatar = req.files.find(x => x.fieldname == "avatar");
            if (!avatar) {
                restaurant.avatar = "deufault-logo-restaurant.jpg";
            } else {
                restaurant.avatar = avatar.path.split("\\")[2];
            }
            let licenseImage = req.files.find(x => x.fieldname == "licenseImage");
            if (licenseImage) {
                restaurant.licenseImage = licenseImage.path.split("\\")[2];
            }
            restaurant.active = false;
            restaurant.save((err, result) => {
                if (err) return res.json({ err });
                User.findOne({ _id: result.managers[0].user.toString() }, async (err, user) => {
                    user.restaurants.push(result._id.toString());
                    await user.updateOne(user);
                })
                let pay = new Pay({
                    user: req.user._id,
                    restaurant: result._id,
                    amount: 200000,
                    type: "creating_restaurant",
                    status: false
                })
                pay.save((err, doc) => {
                    Momo(doc).then(value => {
                        return res.json(value);
                    })
                })

            })
        } else {
            return res.json("Tên cửa hàng đã được sử dụng, vui lòng chọn tên khác!");
        }
    })
}
module.exports.paying = async (req, res) => {
    let orderId = req.params.id;
    await Pay.findOne({ _id: orderId }, async (err, pay) => {
        if (err) {
            return res.json("failed");
        }
        Restaurant.findOne({ _id: pay.restaurant }, async (err, result) => {
            result.active = true;
            await result.updateOne(result);
        })
    })
    return res.json("");
}
module.exports.getRestaurant = async (req, res) => {
    await Restaurant.findById({ _id: req.params.id }, async (err, restaurant) => {
        if (err) return res.json(err);
        if (!restaurant) { return res.json('Cant Find') }
        else {
            await restaurant.populate("newfeeds menus orders managers", async (err, result) => {
                await result.populate("newfeeds.comments managers.user orders.products", async (err, result) => {
                    await result.populate("newfeeds.comments.reply newfeeds.comments.user orders.products.product", async (err, result) => {
                        await result.populate("newfeeds.comments.reply.user", async (err, result) => {
                            result.newfeeds = result.newfeeds.reverse();
                            return res.json(result);
                        })
                    })
                })
            })
        }
    });
}
module.exports.getMenu = async (req, res) => {
    await Restaurant.findById({ _id: req.params.id }, async (err, restaurant) => {
        if (err) return res.json(err);
        if (!restaurant) { return res.json('Cant Find') }
        else {
            await restaurant.populate("menus",async (err, result) => {
                await result.populate("menus.category", (err, result) => {
                    let a= [];
                    var objectResponse = {...result};
                    let categoryArray = objectResponse._doc.menus.reduce((pre, cur) => {
                        pre.push(...cur.category);
                        return pre;
                    }, []);
                    objectResponse._doc.category = categoryArray.map(x=>{
                        if (!a.includes(x.name)){
                            a.push(x.name)
                            return x;
                        }
                    })
                    return res.json(objectResponse._doc);
                })
            })
        }
    });
}
module.exports.getMyRestaurants = async (req, res) => {
    await User.findOne(req.user._id, "restaurants -_id", (err, user) => {
        user.populate({
            path: "restaurants",
            select: "name avatar verified",
            match: { active: true },
            populate: {
                path: "managers",
                populate: {
                    path: "user",
                    select: "fullname"
                }
            }
        }, (err, doc) => {
            return res.json(doc.restaurants);
        })
    })
}
module.exports.manageMyRestaurant = async (req, res) => {
    let idRestaurant = req.params.id;
    if (req.user.restaurants.find(x => x == idRestaurant)) {
        let restaurant = await Restaurant.findOne({ _id: idRestaurant })
            .populate(["menus", "orders", "newfeeds", "followers"]);
        await restaurant.populate("orders.user orders.shipper orders.products.product orders.restaurant", "_id fullname name image price", async (err, docc) => {
            await docc.populate("newfeeds.comments menus.category", async (err, docc) => {
                await docc.populate("newfeeds.comments.user rating.user newfeeds.comments.reply", async (err, docc) => {
                    await docc.populate("newfeeds.comments.reply.user", async (err, docc) => {
                        docc.newfeeds = docc.newfeeds.reverse();
                        return res.json(docc);
                    })
                })
            })
        })
    }
    else {
        return res.json("Bạn không có quyền");
    }
}
module.exports.updateRestaurant = async (req, res) => {
    req.body = JSON.parse(req.body.restaurant);
    await Restaurant.findOne({ _id: req.body._id }, async (err, restaurant) => {
        if (err) return res.json(err);

        if (restaurant.managers.find(x => x.user.toString() == req.user._id)) {
            let avatar = req.files.find(x => x.fieldname == "avatar");
            if (!avatar) {
                //Nothing
            } else {
                restaurant.avatar = avatar.path.split("\\")[2];
            }
            let licenseImage = req.files.find(x => x.fieldname == "licenseImage");
            if (licenseImage) {
                restaurant.licenseImage = licenseImage.path.split("\\")[2];
            }
            restaurant.name = req.body.name;
            restaurant.address = req.body.address;
            restaurant.description = req.body.description;
            restaurant.openAt = req.body.openAt;
            restaurant.closeAt = req.body.closeAt;

            await restaurant.updateOne(restaurant);
            return res.json(restaurant);
        } else {
            return res.json("Bạn không có quyền")
        }
    })
}

module.exports.changeActiveRestaurant = async (req, res) => {
    let restaurant = await Restaurant.findOne({ _id: req.params.id });
    if (restaurant.active == true){
        restaurant.active = false;
        await restaurant.updateOne(restaurant);
    }
    else {
        restaurant.active = true;
        await restaurant.updateOne(restaurant);
    }
    return res.json(restaurant);
}

module.exports.changeVerifyRestaurant = async (req, res) => {
    let restaurant = await Restaurant.findOne({ _id: req.params.id });
    if (restaurant.verified == true){
        restaurant.verified = false;
        await restaurant.updateOne(restaurant);
    }
    else {
        restaurant.verified = true;
        await restaurant.updateOne(restaurant);
    }
    return res.json(restaurant);
}

module.exports.deleteRestaurant = async (req, res) => {
    await Restaurant.deleteOne({ _id: req.params.id }, (err) => {
        if (err) return res.json(err);

    });
}