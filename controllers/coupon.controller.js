const Coupon = require("../models/coupon.model");
const Restaurant = require("../models/restaurant.model");
module.exports.getAll = async (req, res) => {
    let restaurants = await Coupon.find().populate("restaurants");
    return res.json(restaurants)
}
module.exports.get = async (req, res) => {
    let code = req.params.code;
    Coupon.findOne({ code: code }, async(err, coupon) => {
        coupon.populate("restaurants","_id name avatar",(err,result)=>{
            return res.json(result);
        })
    })
}

module.exports.post = async (req, res) => {
    req.body = JSON.parse(req.body.product);
    if (req.user.restaurants.find(x => x == req.body.restaurant)) {
        let product = new Product(req.body);
        let image = req.file;
        if (!image) {
            product.image = "product-default-image.jpg";
        } else {
            product.image = image.path.split("\\")[2];
        }
        await product.save((err, result) => {
            if (err) return res.json(err);
            Restaurant.findOne({ _id: result.restaurant }, async (err, restaurant) => {
                if (err) return res.json(err);
                restaurant.menus.push(result._id);
                await restaurant.updateOne(restaurant);
                return res.json(product);
            })
        })
    }
    
}
module.exports.put = async (req, res) => {

}
module.exports.delete = async (req, res) => {

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