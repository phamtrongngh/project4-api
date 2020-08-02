const Coupon = require("../models/coupon.model");
const Restaurant = require("../models/restaurant.model");
module.exports.getAll = async (req, res) => {
    Coupon.find((err, result) => {
        return res.json(result);
    })
}
module.exports.get = async (req, res) => {
    let code = req.params.code;
    Coupon.findOne({ code: code }, (err, coupon) => {
        return res.json(coupon);
    })
}
module.exports.post = async (req, res) => {
    let coupon = new Coupon(req.body);
    coupon.save((err, doc) => {
        return res.json(doc);
    })
}
module.exports.put = async (req, res) => {

}
module.exports.delete = async (req, res) => {

}

module.exports.check = async (req, res) => {
    const userId = req.user._id;
    const restaurantId = req.body.restaurant;
    const amount = req.body.amount;
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