const Product = require('../models/product.model');
const Restaurant = require("../models/restaurant.model");
module.exports.getProducts = async (req, res) => {
    var product = await Product.find().lean().populate(["restaurant", "category"]);
    res.json(product);
}

module.exports.createProduct = async (req, res) => {
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

module.exports.getProduct = async (req, res) => {
    await Product.findById({ _id: req.params.id }, (err, product) => {
        if (err) res.json(res);
        if (!product) { return res.json('Cant Find') }
        else {
            res.json(product);
        }
    });
}

module.exports.updateProduct = async (req, res) => {
    Product.findById(req.body._id, (err, product) => {
        if (err) res.json(err)
        if (!product) {
            return res.json('Cant Find');
        }
        else {
            product.set(req.body);
            product.updateOne((error, result) => {
                if (error) res.json(error)
                res.json({ result })
            });
        }
    });
}

module.exports.deleteProduct = async (req, res) => {
    let result = await Product.deleteOne({ _id: req.params.id }).exec();
    res.json(result);
}
