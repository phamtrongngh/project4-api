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
    await Restaurant.findById({ _id: req.params.id }, (err, restaurant) => {
        if (err) return res.json(err);
        if (!restaurant) { return res.json('Cant Find') }
        else {
            res.json(restaurant.populate());
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
        let restaurant =await Restaurant.findOne({ _id: idRestaurant })
                                        .populate(["menus","orders","newfeeds","followers"]); 
        return res.json(restaurant);
    }
}
module.exports.updateRestaurant = async (req, res) => {
    Restaurant.findById(req.body._id, (err, restaurant) => {
        if (err) return res.json(err)
        if (!restaurant) {
            return res.json('Cant Find');
        }
        else {
            restaurant.set(req.body);
            restaurant.updateOne((error, result) => {
                if (error) res.json(error)
                res.json(result)
            });
        }
    });
}

module.exports.deleteRestaurant = async (req, res) => {
    await Restaurant.deleteOne({ _id: req.params.id }, (err) => {
        if (err) return res.json(err);

    });
}