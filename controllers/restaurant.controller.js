const Restaurant = require('../models/restaurant.model');
const User = require("../models/user.model");

module.exports.getRestaurants = async (req, res) => {
    var restaurant = await Restaurant.find();
    res.json(restaurant);
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
            restaurant.active = true;
            restaurant.save((err, result) => {
                if (err) return res.json({ err });
                User.findOne({ _id: result.managers[0].user.toString() }, async (err, user) => {
                    user.restaurants.push(result._id.toString());
                    await user.updateOne(user);
                })
                return res.json(result);
            })
        } else {
            return res.json("Tên cửa hàng đã được sử dụng, vui lòng chọn tên khác!");
        }
    })
}

module.exports.getRestaurant = async (req, res) => {
    await Restaurant.findById({ _id: req.params.id }, async (err, restaurant) => {
        if (err) return res.json(err);
        if (!restaurant) { return res.json('Cant Find') }
        else {
            await restaurant.populate("newfeeds", (err, result) => {
                return res.json(result);
            })
        }
    });
}
module.exports.getMenu = async (req, res) => {
    await Restaurant.findById({ _id: req.params.id }, async (err, restaurant) => {
        if (err) return res.json(err);
        if (!restaurant) { return res.json('Cant Find') }
        else {
            await restaurant.populate("menus", (err, result) => {
                return res.json(result);
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
        await restaurant.populate("orders.user orders.products.product orders.restaurant", "_id fullname name image", async (err, docc) => {
            return res.json(docc);
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

        if (restaurant.managers.find(x => x.user == req.user._id)) {
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
            await restaurant.updateOne(restaurant);
            return res.json(restaurant);
        }else{
            return res.json("Bạn không có quyền")
        }
    })
}

module.exports.deleteRestaurant = async (req, res) => {
    await Restaurant.deleteOne({ _id: req.params.id }, (err) => {
        if (err) return res.json(err);

    });
}