const Coupon = require("../models/coupon.model");
const Restaurant = require("../models/restaurant.model");
module.exports.getAll = async (req, res) => {
    let restaurants = await Coupon.find().populate("restaurants");
    return res.json(restaurants)
}
module.exports.get = async (req, res) => {
    let code = req.params.code;
    Coupon.findOne({ code: code }, async (err, coupon) => {
        coupon.populate("restaurants", "_id name avatar", (err, result) => {
            return res.json(result);
        })
    })
}

module.exports.post = async (req, res) => {
    req.body = JSON.parse(req.body.coupon);
    let coupon = new Coupon(req.body);
    let image = req.file;
    if (!image) {
        coupon.image = "product-default-image.jpg";
    } else {
        coupon.image = image.path.split("\\")[2];
    }
    await coupon.save((err, result) => {
        if (err) return res.json(err);
        res.json({ coupon: result });
    })
}
module.exports.put = async (req, res) => {
    req.body = JSON.parse(req.body.coupon);
    let coupon = await Coupon.findOne({ _id: req.body._id });
    let image = req.file;
    let restaurants = coupon.restaurants;
    if (!image) {} 
    else {
        coupon.image = image.path.split("\\")[2]
    }
    coupon.code = req.body.code;
    coupon.name = req.body.name;
    coupon.description = req.body.description;
    coupon.discount = req.body.discount;
    coupon.max = req.body.max;
    coupon.min = req.body.min;
    coupon.exp = req.body.min;
    coupon.percent = req.body.percent;
    restaurants.push(req.body.restaurants);
    await coupon.updateOne(coupon);
    return res.json(coupon);
}
module.exports.delete = async (req, res) => {
    let code = req.params.code;
    await Coupon.deleteOne({ code: code }, (err, result) => {
        if (err) return res.json(err);
    });
}

module.exports.check = async (req, res) => {
    const restaurantId = req.body.restaurant;
    const code = req.body.code;
    await Coupon.findOne({ code: code.toUpperCase() }, async (err, coupon) => {
        if (coupon) {
            await Restaurant.findOne({ _id: restaurantId }, (err, restaurant) => {
                if (err) return res.json(err);
                if (restaurant.coupons.find(x => x == coupon._id.toString())) {
                    if (req.user.coupons.find(x => x == coupon._id.toString())) {
                        return res.json(coupon);
                    } else {
                        return res.json("not found coupon user")
                    }
                } else {
                    return res.json("not found coupon restaurant");
                }
            })
        } else {
            return res.json("not found coupon");
        }
    });

}