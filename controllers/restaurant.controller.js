const Restaurant = require('../models/restaurant.model');
const User = require("../models/user.model");
module.exports.getRestaurants = async (req, res) => {
    var restaurant = await Restaurant.find();
    res.json(restaurant);
}

module.exports.createRestaurant = async (req, res) => {

    await Restaurant.findOne({ name: req.body.name }, (err, restaurant) => {
        if (restaurant == null) {
            restaurant = new Restaurant(req.body);
            restaurant.managers.push({
                user: req.user._id,
                role: "admin"
            });
            restaurant.avatar.push(req.file.path);
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
    let result = await Restaurant.deleteOne({ _id: req.params.id }).exec();
    res.json(result);
}